import { readFile } from 'node:fs/promises';

// Stores whose purchase links no longer work; hidden until they're replaced
const INACTIVE_STORES = new Set(['Clips4Sale']);

async function load(name) {
  const json = await readFile(new URL(`../data/${name}.json`, import.meta.url), 'utf8');
  return JSON.parse(json.replace(/^\uFEFF/, ''));
}

function slugify(text) {
  return text.toLowerCase().normalize('NFKD').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Deterministic PRNG so the shuffle is stable for a given seed (mulberry32)
function random(seed) {
  let a = [...seed].reduce((hash, char) => Math.imul(hash ^ char.charCodeAt(0), 2654435761), 1779033703);
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(items, seed) {
  const next = random(seed);
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default async function () {
  const [videos, models, links] = await Promise.all([load('videos'), load('models'), load('links')]);
  const modelsBySlug = new Map(models.map(model => [model.slug, { ...model, videosCount: 0 }]));

  // Several videos share a title, so add the models' names to those slugs
  const titleCounts = Map.groupBy(videos, video => slugify(video.title));
  const usedSlugs = new Set();

  const catalog = videos
    .filter(video => video.purchaseOptions.length > 0)
    .map((video) => {
      let base = slugify(video.title);
      if (titleCounts.get(base).length > 1) base = `${base}-${video.models.join('-')}`;
      let slug = base;
      for (let n = 2; usedSlugs.has(slug); n++) slug = `${base}-${n}`;
      usedSlugs.add(slug);

      const cast = video.models.map(modelSlug => modelsBySlug.get(modelSlug)).filter(Boolean);
      cast.forEach((model) => { model.videosCount++; });

      const purchaseOptions = video.purchaseOptions.filter(option => !INACTIVE_STORES.has(option.storeName));

      return { ...video, slug, cast, purchaseOptions };
    });

  // Reshuffled daily (the site is rebuilt every day by a scheduled Netlify function)
  const seed = new Date().toISOString().substring(0, 10);

  return {
    videos: shuffle(catalog, seed),
    models: [...modelsBySlug.values()]
      .filter(model => model.videosCount > 0)
      .sort((a, b) => b.videosCount - a.videosCount),
    links,
  };
}
