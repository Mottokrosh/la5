import { readFile } from 'node:fs/promises';
import { loadPhotoData, photoTile } from '../_lib/photo-data.js';
import slugify from '../_lib/slugify.js';
import catalog from './catalog.js';

// Everything in the admin area (only ever written under /admin/, which is
// password-protected): every model with all her videos and galleries,
// permanent collection included.

const byNewest = (a, b) => (b.date ?? '').localeCompare(a.date ?? '') || b.id - a.id;

export default async function () {
  const [data, { videos: la5Videos }, modelsJson] = await Promise.all([
    loadPhotoData(),
    catalog(),
    readFile(new URL('../data/models.json', import.meta.url), 'utf8').then(json => JSON.parse(json.replace(/^﻿/, ''))),
  ]);
  if (!data) return { models: [], galleryPages: [] };

  const la5ByTrailer = new Map(la5Videos.map(video => [video.trailer.filename, video]));
  const names = new Map(modelsJson.map(model => [model.slug, model.name]));
  const modelLinks = slugs => slugs.map(slug => ({ slug, name: names.get(slug) ?? slug }));

  // Older exports have no videos or model slugs
  const videos = (data.videos ?? []).map((video) => {
    const la5 = video.la5 && la5ByTrailer.get(video.la5);
    const [coverKey, coverWidth, coverHeight] = video.cover ?? [];
    return {
      ...video,
      href: la5 ? `/videos/${la5.slug}/` : null,
      image: la5 ? la5.cover['320'] : coverKey && `${data.base}/vcover/${coverKey}.jpg`,
      imageRatio: la5 ? '16 / 9' : coverKey ? `${coverWidth} / ${coverHeight}` : '16 / 9',
      cast: modelLinks(video.slugs),
    };
  });

  const galleries = data.sets.map(set => ({
    ...set,
    slugs: set.slugs ?? [],
    cast: modelLinks(set.slugs ?? []),
    tiles: set.photos.map(photoTile(data.base, set)),
  }));

  const models = modelsJson.map((model) => {
    const modelVideos = videos.filter(video => video.slugs.includes(model.slug)).sort(byNewest);
    const modelGalleries = galleries.filter(gallery => gallery.slugs.includes(model.slug)).sort(byNewest);

    // Gallery URLs under this model; titles repeat, so number the later ones
    // (skipping numbers a title like "Hogtied 2" has already taken)
    const titles = new Set(modelGalleries.map(gallery => slugify(gallery.title)));
    const used = new Set();
    const galleryLinks = [...modelGalleries].sort((a, b) => a.id - b.id).map((gallery) => {
      const base = slugify(gallery.title) || `gallery-${gallery.id}`;
      let slug = base;
      for (let n = 2; used.has(slug) || (slug !== base && titles.has(slug)); n++) slug = `${base}-${n}`;
      used.add(slug);
      return { gallery, slug };
    });
    const slugs = new Map(galleryLinks.map(link => [link.gallery, link.slug]));

    return {
      ...model,
      videos: modelVideos,
      galleries: modelGalleries.map(gallery => ({ ...gallery, slug: slugs.get(gallery) })),
      counts: {
        videos: modelVideos.length,
        videosPermanent: modelVideos.filter(video => video.permanent).length,
        galleries: modelGalleries.length,
        galleriesPermanent: modelGalleries.filter(gallery => gallery.permanent).length,
        photos: modelGalleries.reduce((sum, gallery) => sum + gallery.photos.length, 0),
      },
    };
  }).filter(model => model.counts.videos || model.counts.galleries)
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    models,
    // One page per gallery under each of its models
    galleryPages: models.flatMap(model => model.galleries.map(gallery => ({ model, gallery }))),
  };
}
