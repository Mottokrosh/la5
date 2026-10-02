import { readFile } from 'node:fs/promises';
import { getStore } from '@netlify/blobs';
import { dailySeed, shuffle } from '../_lib/shuffle.js';

const DAILY_COUNT = 500;

// Written by tools/photo-export; see the README. The metadata includes the
// permanent collection, so it lives in Netlify Blobs rather than this (public) repo.
async function fromBlobs() {
  const options = process.env.NETLIFY_BLOBS_CONTEXT
    ? {}
    : process.env.SITE_ID && process.env.NETLIFY_BLOBS_TOKEN
      ? { siteID: process.env.SITE_ID, token: process.env.NETLIFY_BLOBS_TOKEN }
      : null;
  if (!options) return null;
  return getStore({ name: 'photos', ...options }).get('galleries', { type: 'json' });
}

// For local development: the export's own output, or a sample made with --local
async function fromExport() {
  for (const file of ['galleries.json', 'galleries.local.json']) {
    try {
      return JSON.parse(await readFile(new URL(`../../tools/photo-export/out/${file}`, import.meta.url), 'utf8'));
    } catch {
      // Try the next one
    }
  }
  return null;
}

export default async function () {
  let data;
  try {
    data = await fromBlobs();
  } catch (error) {
    if (process.env.CONTEXT === 'production') throw error;
    console.warn(`[photos] Couldn't read the photos blob store: ${error.message}`);
  }
  data ??= await fromExport();

  if (!data) {
    // Never replace the live gallery with an empty one
    if (process.env.CONTEXT === 'production') throw new Error('No photo gallery data: check the "photos" blob store');
    console.warn('[photos] No gallery data found; the photo pages will be empty');
    return { base: '', daily: [], sets: [] };
  }

  const url = (size, key, format) => `${data.base}/${size}/${key}.${format}`;
  const photo = set => ([key, width, height, color]) => ({
    full: url('full', key, 'jpg'),
    fullAvif: url('full', key, 'avif'),
    thumb: url('thumb', key, 'jpg'),
    thumbAvif: url('thumb', key, 'avif'),
    width,
    height,
    ratio: (width / height).toFixed(4),
    color,
    caption: set.models.length ? `${set.title} – ${set.models.join(', ')}` : set.title,
  });

  // The permanent collection only appears in the admin area
  const publicPhotos = data.sets.filter(set => !set.permanent).flatMap(set => set.photos.map(photo(set)));

  return {
    base: data.base,
    daily: shuffle(publicPhotos, dailySeed()).slice(0, DAILY_COUNT),
    // Newest first; only ever written under /admin/
    sets: data.sets,
  };
}
