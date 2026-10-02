// Every gallery, permanent collection included, newest first. Only ever
// served from behind the Basic-Auth on /admin/* (see _headers.11ty.js).
export const data = {
  permalink: '/admin/photos.json',
  layout: null,
  eleventyExcludeFromCollections: true,
};

export function render({ photos }) {
  return JSON.stringify({ base: photos.base, sets: photos.sets });
}
