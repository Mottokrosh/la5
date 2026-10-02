#!/usr/bin/env node
/**
 * Encodes every gallery photo from the LimitedAudienceLar database and media
 * drive, uploads full-size and thumbnail AVIF + JPEG to S3, and writes
 * out/galleries.json for the la5 build (pushed to Netlify Blobs by hand).
 *
 *   node export.mjs                 encode + upload whatever isn't done yet, then write the JSON
 *   node export.mjs --limit 200     only do 200 more photos (trial run)
 *   node export.mjs --set 123       only do the photos of gallery 123 (repeatable)
 *   node export.mjs --verify        check the bucket has every logged object; forget the ones missing
 *   node export.mjs --json-only     just rewrite out/galleries.json from the DB and the progress log
 *   node export.mjs --local         write to out/local/ instead of S3, for trying the site out
 *                                   (its own progress log; npm run dev serves it at /local-photos)
 *
 * Built to be killed at any moment: each photo is finished (all four objects
 * uploaded) before it's appended to .progress.jsonl, keys are deterministic so
 * redoing a half-done photo overwrites the same objects, and a re-run skips
 * everything already in the log.
 */
import { createHash } from 'node:crypto';
import { appendFileSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { cpus } from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import mysql from 'mysql2/promise';
import sharp from 'sharp';

const here = path.dirname(new URL(import.meta.url).pathname);
if (existsSync(path.join(here, '.env'))) process.loadEnvFile(path.join(here, '.env'));

const { values: args } = parseArgs({
  options: {
    limit: { type: 'string' },
    set: { type: 'string', multiple: true },
    concurrency: { type: 'string' },
    verify: { type: 'boolean', default: false },
    'json-only': { type: 'boolean', default: false },
    local: { type: 'boolean', default: false },
  },
});

const env = process.env;
const MEDIA_ROOT = env.MEDIA_ROOT ?? '/Volumes/Vhalhisstre/Projects/LimitedAudienceLar/app/storage/media';
const BUCKET = env.BUCKET ?? 'limited-audience-gallery';
const REGION = env.AWS_REGION ?? 'eu-central-1';
const LOCAL_DIR = args.local ? path.join(here, 'out', 'local') : null;
const PUBLIC_BASE = LOCAL_DIR ? '/local-photos' : env.PUBLIC_BASE ?? `https://s3.${REGION}.amazonaws.com/${BUCKET}`;
const CONCURRENCY = Number(args.concurrency ?? env.CONCURRENCY ?? Math.max(2, Math.floor(cpus().length / 2)));

const PROGRESS = path.join(here, LOCAL_DIR ? '.progress.local.jsonl' : '.progress.jsonl');
const FAILURES = path.join(here, '.failures.jsonl');
const OUT = path.join(here, 'out', LOCAL_DIR ? 'galleries.local.json' : 'galleries.json');

const FULL_EDGE = 2400;
const THUMB_HEIGHT = 400;
const CACHE_CONTROL = 'public, max-age=31536000, immutable';

// fast-gallery's encoder settings, except AVIF effort 3 rather than 4:
// five times faster for files only ~2% bigger, which matters over 40k photos
const ENCODE = {
  full: {
    avif: s => s.avif({ quality: 55, effort: 3 }),
    jpg: s => s.jpeg({ quality: 82, mozjpeg: true, progressive: true }),
  },
  thumb: {
    avif: s => s.avif({ quality: 50, effort: 3 }),
    jpg: s => s.jpeg({ quality: 80, mozjpeg: true }),
  },
};
const CONTENT_TYPES = { avif: 'image/avif', jpg: 'image/jpeg' };
const objectKeys = key => ['full', 'thumb'].flatMap(size => ['avif', 'jpg'].map(format => `${size}/${key}.${format}`));

// Stop after this many photos in a row fail: the network or the drive is gone,
// and carrying on would just log the whole queue as failed
const MAX_CONSECUTIVE_FAILURES = 20;
// Backoff for retrying uploads, about five minutes in all
const RETRY_DELAYS = [5, 10, 20, 40, 80, 160].map(s => s * 1000);

const s3 = new S3Client({ region: REGION, maxAttempts: 10, retryMode: 'adaptive' });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const hex = ({ r, g, b }) => `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;

// Mirrors Tools::modelName() in LimitedAudienceLar, preferring la5's own names
const la5Models = JSON.parse(readFileSync(path.join(here, '../../src/data/models.json'), 'utf8').replace(/^﻿/, ''));
const la5Names = new Map(la5Models.map(model => [model.slug, model.name]));
function modelName(slug) {
  if (la5Names.has(slug)) return la5Names.get(slug);
  const fixes = [['-', ' '], ['altsiren', 'AltSiren'], ['andromedax', 'AndromedaX'], ['demi jay', 'Demi-Jay'], ['jenvy', 'JenVy']];
  const name = fixes.reduce((text, [from, to]) => text.replaceAll(from, to), slug);
  return name.replace(/(^|\s)(\S)/g, (_, space, char) => space + char.toUpperCase());
}

function photoKey(id) {
  if (!env.EXPORT_SALT) throw new Error('EXPORT_SALT is not set (see README)');
  return createHash('sha256').update(`${env.EXPORT_SALT}:${id}`).digest('hex').substring(0, 20);
}

// --- Progress log --------------------------------------------------------

function readLog(file) {
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8').split('\n').flatMap((line) => {
    try {
      return line ? [JSON.parse(line)] : [];
    } catch {
      return []; // A line cut short by a crash; that photo just gets redone
    }
  });
}

function loadProgress() {
  return new Map(readLog(PROGRESS).map(entry => [entry.id, entry]));
}

const log = (file, entry) => appendFileSync(file, `${JSON.stringify(entry)}\n`);

// --- Database ------------------------------------------------------------

async function loadGalleries() {
  const db = await mysql.createConnection({
    host: env.DB_HOST ?? '127.0.0.1',
    port: Number(env.DB_PORT ?? 3307),
    user: env.DB_USER ?? 'limitedaudience',
    password: env.DB_PASSWORD ?? 'limitedaudience',
    database: env.DB_NAME ?? 'limitedaudience',
    dateStrings: true,
  });
  try {
    // Raw columns: the Eloquent accessors rewrite the dates
    const [photos] = await db.query(`
      SELECT i.id, i.filename, s.id AS setId
      FROM mediaitems i JOIN mediasets s ON s.id = i.mediaset_id
      WHERE s.type = 'gallery' AND i.type = 'photo'
      ORDER BY s.live_date DESC, s.id DESC, i.filename`);
    const [sets] = await db.query(`
      SELECT id, path, title, description, live_date AS liveDate, code
      FROM mediasets WHERE type = 'gallery'`);
    const [tags] = await db.query(`
      SELECT st.mediaset_id AS setId, t.name
      FROM mediaset_tag st JOIN tags t ON t.id = st.tag_id
      WHERE t.type = 'model'
      ORDER BY st.id`);

    const models = Map.groupBy(tags, tag => tag.setId);
    const setsById = new Map(sets.map(set => [set.id, {
      id: set.id,
      path: set.path,
      title: set.title.trim(),
      description: (set.description ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
      models: [...new Set((models.get(set.id) ?? []).map(tag => modelName(tag.name)))],
      date: set.liveDate?.startsWith('0000') ? null : set.liveDate?.substring(0, 10) ?? null,
      // code -1 marks the subscriber-only "permanent collection"
      permanent: set.code === -1,
    }]));

    return { photos: photos.map(photo => ({ ...photo, set: setsById.get(photo.setId) })), sets: setsById };
  } finally {
    await db.end();
  }
}

// --- Encoding and upload -------------------------------------------------

async function encode(src) {
  // Decode once (rotate() bakes in EXIF orientation) and encode everything from that
  const full = await sharp(src, { failOn: 'error' })
    .rotate()
    .flatten({ background: '#000000' })
    .resize(FULL_EDGE, FULL_EDGE, { fit: 'inside', withoutEnlargement: true })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const thumb = await sharp(full.data, { raw: full.info })
    .resize({ height: THUMB_HEIGHT, withoutEnlargement: true })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { dominant } = await sharp(thumb.data, { raw: thumb.info }).stats();

  const files = {};
  for (const [size, image] of Object.entries({ full, thumb })) {
    for (const format of ['avif', 'jpg']) {
      files[`${size}.${format}`] = await ENCODE[size][format](sharp(image.data, { raw: image.info })).toBuffer();
    }
  }
  return { width: full.info.width, height: full.info.height, color: hex(dominant), files };
}

async function upload(key, files) {
  if (LOCAL_DIR) {
    for (const [name, body] of Object.entries(files)) {
      const [size, format] = name.split('.');
      mkdirSync(path.join(LOCAL_DIR, size), { recursive: true });
      writeFileSync(path.join(LOCAL_DIR, size, `${key}.${format}`), body);
    }
    return;
  }
  await Promise.all(Object.entries(files).map(([name, body]) => {
    const [size, format] = name.split('.');
    return s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: `${size}/${key}.${format}`,
      Body: body,
      ContentType: CONTENT_TYPES[format],
      CacheControl: CACHE_CONTROL,
    }));
  }));
}

async function withRetry(task, describe) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await task();
    } catch (error) {
      if (attempt >= RETRY_DELAYS.length || stopping) throw error;
      console.warn(`\n${describe}: ${error.message}; retrying in ${RETRY_DELAYS[attempt] / 1000}s`);
      await sleep(RETRY_DELAYS[attempt]);
    }
  }
}

class DriveGone extends Error {}

let stopping = false;

async function run(progress) {
  if (!existsSync(MEDIA_ROOT)) throw new Error(`Media drive not found at ${MEDIA_ROOT}. Is it mounted?`);
  photoKey(0); // Fail fast without a salt

  const { photos } = await loadGalleries();
  const onlySets = args.set && new Set(args.set.map(Number));
  let queue = photos.filter(photo => !progress.has(photo.id) && (!onlySets || onlySets.has(photo.setId)));
  if (args.limit) queue = queue.slice(0, Number(args.limit));
  console.log(`${photos.length} gallery photos, ${progress.size} done, ${queue.length} to do (concurrency ${CONCURRENCY})`);
  if (!queue.length) return;

  const started = Date.now();
  let done = 0;
  let failed = 0;
  let consecutiveFailures = 0;
  let bytes = 0;
  let lastReport = 0;

  const report = (force = false) => {
    const now = Date.now();
    if (!force && now - lastReport < 2000) return;
    lastReport = now;
    const rate = done / ((now - started) / 60000); // photos per minute
    const left = queue.length - done - failed;
    const eta = rate > 0 ? `${Math.floor(left / rate / 60)}h${String(Math.round(left / rate % 60)).padStart(2, '0')}m` : '?';
    const line = `${done + failed}/${queue.length} · ${failed} failed · ${(bytes / 1e6).toFixed(0)} MB uploaded · ${rate.toFixed(0)}/min · ETA ${eta}`;
    if (process.stdout.isTTY) process.stdout.write(`\r${line}\x1b[K`);
    else console.log(line);
  };

  const process1 = async (photo) => {
    const src = path.join(MEDIA_ROOT, photo.set.path, 'photos', photo.filename);
    const key = photoKey(photo.id);

    let encoded;
    try {
      encoded = await encode(src);
    } catch (error) {
      if (!existsSync(MEDIA_ROOT)) throw new DriveGone(`Media drive disappeared from ${MEDIA_ROOT}`);
      throw error;
    }
    await withRetry(() => upload(key, encoded.files), `Uploading ${photo.id}`);

    const size = Object.values(encoded.files).reduce((sum, file) => sum + file.length, 0);
    log(PROGRESS, { id: photo.id, key, w: encoded.width, h: encoded.height, color: encoded.color, bytes: size });
    return size;
  };

  let next = 0;
  const worker = async () => {
    while (!stopping && next < queue.length) {
      const photo = queue[next++];
      try {
        bytes += await process1(photo);
        done++;
        consecutiveFailures = 0;
      } catch (error) {
        if (error instanceof DriveGone) {
          stopping = true;
          console.error(`\n${error.message}. Stopping; re-run once it's back.`);
          return;
        }
        failed++;
        log(FAILURES, { id: photo.id, path: `${photo.set.path}/photos/${photo.filename}`, error: error.message, at: new Date().toISOString() });
        if (++consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          stopping = true;
          console.error(`\n${consecutiveFailures} failures in a row (last: ${error.message}). Stopping; re-run to resume.`);
        }
      }
      report();
    }
  };

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, worker));
  report(true);
  console.log(stopping ? '\nStopped early. Run again to carry on where this left off.' : '\nDone.');
  if (failed) console.log(`${failed} photos failed; see ${path.relative(process.cwd(), FAILURES)}. They're retried on the next run.`);
}

// --- Verify --------------------------------------------------------------

async function verify(progress) {
  const existing = new Set();
  let ContinuationToken;
  do {
    const page = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, ContinuationToken }));
    for (const object of page.Contents ?? []) existing.add(object.Key);
    ContinuationToken = page.NextContinuationToken;
  } while (ContinuationToken);

  const complete = [...progress.values()].filter(entry => objectKeys(entry.key).every(key => existing.has(key)));
  const missing = progress.size - complete.length;
  console.log(`${existing.size} objects in ${BUCKET}; ${complete.length} of ${progress.size} logged photos complete, ${missing} missing objects`);

  if (missing) {
    // Rewrite atomically, so a crash here can't lose the log
    writeFileSync(`${PROGRESS}.tmp`, complete.map(entry => `${JSON.stringify(entry)}\n`).join(''));
    renameSync(`${PROGRESS}.tmp`, PROGRESS);
    console.log(`Removed ${missing} from the progress log; the next run redoes them.`);
  }
}

// --- Gallery JSON --------------------------------------------------------

async function writeJson(progress) {
  const { photos, sets } = await loadGalleries();
  const bySet = new Map();
  for (const photo of photos) {
    const entry = progress.get(photo.id);
    if (!entry) continue;
    if (!bySet.has(photo.setId)) bySet.set(photo.setId, []);
    bySet.get(photo.setId).push([entry.key, entry.w, entry.h, entry.color]);
  }

  const galleries = [...bySet].map(([setId, setPhotos]) => {
    const { path: _path, ...set } = sets.get(setId);
    return { ...set, photos: setPhotos };
  }).sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '') || b.id - a.id);

  mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify({ base: PUBLIC_BASE, sets: galleries }));
  const count = galleries.reduce((sum, set) => sum + set.photos.length, 0);
  console.log(`Wrote ${path.relative(process.cwd(), OUT)}: ${galleries.length} galleries, ${count} photos`);
}

// --- Main ----------------------------------------------------------------

process.on('SIGINT', onSignal);
process.on('SIGTERM', onSignal);
function onSignal() {
  if (stopping) process.exit(130); // Second Ctrl-C: don't wait
  stopping = true;
  console.log('\nFinishing the photos in progress, then stopping (Ctrl-C again to quit now)…');
}

const progress = loadProgress();
if (args.verify && LOCAL_DIR) {
  throw new Error('--verify checks the S3 bucket; it can\'t be combined with --local');
} else if (args.verify) {
  await verify(progress);
} else {
  if (!args['json-only']) await run(progress);
  await writeJson(loadProgress());
}
