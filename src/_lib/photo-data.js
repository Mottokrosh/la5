import { readFile } from 'node:fs/promises';

// The gallery and video metadata includes the permanent collection, so it
// lives in Netlify Blobs rather than this (public) repo. On Netlify, the
// photo-data build plugin fetches it into .cache/; locally, it's the photo
// export's own output, or a sample made with --local (see the README).
const SOURCES = [
  '../../.cache/photos/galleries.json',
  '../../tools/photo-export/out/galleries.json',
  '../../tools/photo-export/out/galleries.local.json',
];

let loading;

/** The export's data, or null when there's none. Loaded once per build. */
export function loadPhotoData() {
  loading ??= (async () => {
    for (const file of SOURCES) {
      try {
        return JSON.parse(await readFile(new URL(file, import.meta.url), 'utf8'));
      } catch {
        // Try the next one
      }
    }
    if (process.env.CONTEXT === 'production') throw new Error('No photo gallery data: check the "photos" blob store');
    console.warn('[photos] No gallery data found; the photo pages will be empty');
    return null;
  })();
  return loading;
}

/** Turns an exported [key, width, height, colour] photo into what photo-tile.njk needs. */
export function photoTile(base, set) {
  const url = (size, key, format) => `${base}/${size}/${key}.${format}`;
  return ([key, width, height, color]) => ({
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
}
