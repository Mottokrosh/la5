import { readFile } from 'node:fs/promises';
import { dailySeed, shuffle } from '../_lib/shuffle.js';

const DAILY_COUNT = 250;

// The metadata includes the permanent collection, so it lives in Netlify Blobs
// rather than this (public) repo. On Netlify, the photo-data build plugin
// fetches it into .cache/; locally, it's the photo export's own output, or a
// sample made with --local (see the README).
const SOURCES = [
  '../../.cache/photos/galleries.json',
  '../../tools/photo-export/out/galleries.json',
  '../../tools/photo-export/out/galleries.local.json',
];

async function load() {
  for (const file of SOURCES) {
    try {
      return JSON.parse(await readFile(new URL(file, import.meta.url), 'utf8'));
    } catch {
      // Try the next one
    }
  }
  return null;
}

export default async function () {
  const data = await load();

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
    models: set.models,
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
