import { rm } from 'node:fs/promises';
import * as pagefind from 'pagefind';
import icon from './src/_lib/icon.js';

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('static');
  eleventyConfig.addPassthroughCopy({ 'src/_redirects': '_redirects', 'src/js': 'js' });
  eleventyConfig.addWatchTarget('src/data/');
  eleventyConfig.addWatchTarget('src/css/');

  eleventyConfig.addShortcode('icon', icon);

  eleventyConfig.addFilter('filesize', bytes => `${Math.round(bytes / 1024 / 1024)}MB`);
  eleventyConfig.addFilter('stripHtml', html => html.replace(/<[^>]*>/g, ''));
  // The home page link is also current on the paginated pages
  eleventyConfig.addFilter('isCurrent', (url, href) => (
    href === '/' ? url === '/' || url.startsWith('/page/') : url.startsWith(href)
  ));

  eleventyConfig.addFilter('featuring', (videos, modelSlug) => videos.filter(video => video.models.includes(modelSlug)));

  // Build the search index from the generated video pages
  eleventyConfig.on('eleventy.after', async ({ directories }) => {
    const outputPath = `${directories.output}pagefind`;
    const { index } = await pagefind.createIndex();
    const indexed = await index.addDirectory({ path: directories.output, glob: 'videos/**/*.html' });
    await rm(outputPath, { recursive: true, force: true });
    const written = await index.writeFiles({ outputPath });
    await pagefind.close();

    const errors = [...indexed.errors, ...written.errors];
    if (errors.length) throw new Error(`Pagefind failed:\n${errors.join('\n')}`);
    console.log(`[pagefind] Indexed ${indexed.page_count} video pages`);
  });

  return {
    dir: {
      input: 'src',
    },
    htmlTemplateEngine: 'njk',
  };
}
