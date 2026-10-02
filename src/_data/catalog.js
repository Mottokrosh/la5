import { readFile } from 'node:fs/promises';
import { dailySeed, shuffle } from '../_lib/shuffle.js';
import slugify from '../_lib/slugify.js';

// Stores whose purchase links no longer work; hidden until they're replaced
const INACTIVE_STORES = new Set(['Clips4Sale']);

async function load(name) {
  const json = await readFile(new URL(`../data/${name}.json`, import.meta.url), 'utf8');
  return JSON.parse(json.replace(/^\uFEFF/, ''));
}

export default async function () {
  const [videos, models, links] = await Promise.all([load('videos'), load('models'), load('links')]);
  const modelsBySlug = new Map(models.map(model => [model.slug, { ...model, videosCount: 0 }]));

  // Several videos share a title, so add the models' names to those slugs
  const titleCounts = Map.groupBy(videos, video => slugify(video.title));
  const usedSlugs = new Set();

  // Videos without purchase links are shown too, with an "under construction" notice
  const catalog = videos
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

  return {
    videos: shuffle(catalog, dailySeed()),
    models: [...modelsBySlug.values()]
      .filter(model => model.videosCount > 0)
      .sort((a, b) => b.videosCount - a.videosCount),
    links,
  };
}
