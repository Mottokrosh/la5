import { readFile } from 'node:fs/promises';

// Concatenated in this order into a single stylesheet
const files = [
  'variables', 'basics', 'typography', 'buttons', 'inputs',
  'banner-links', 'contact', 'home', 'modal', 'models', 'model-details',
  'navigation', 'photo-grid', 'search', 'the-header', 'the-footer', 'video-details', 'warning', 'admin',
];

export const data = {
  permalink: '/app.css',
  layout: null,
  eleventyExcludeFromCollections: true,
};

export async function render() {
  const css = await Promise.all(files.map(file => readFile(new URL(`css/${file}.css`, import.meta.url), 'utf8')));
  return css.join('\n');
}
