# la5

The Limited Audience website: a static site built with [Eleventy](https://www.11ty.dev/), with search by [Pagefind](https://pagefind.app/) and a few web components for progressive enhancement. It's hosted on Netlify.

## Development

```bash
npm install
npm start      # http://localhost:8888, via Netlify Dev (applies _redirects, serves functions)
npm run dev    # http://localhost:8080, plain Eleventy dev server
npm run build  # outputs to _site/
```

Node 22 or newer is required. `npm start` needs the [Netlify CLI](https://docs.netlify.com/cli/get-started/) installed globally.

## How it's put together

- `src/data/*.json`: the videos, models and links. Edit these to update the catalogue.
- `src/_data/catalog.js`: loads the JSON, gives each video a URL slug, counts videos per model, and shuffles the videos using the build date as the seed.
- `src/*.html`, `src/*.njk`: the pages. Every video gets its own page at `/videos/<slug>/`.
- `src/css/`: plain CSS, combined into `/app.css` by `src/app.css.11ty.js`.
- `src/js/`: web components that enhance the static HTML:
  - `<age-gate>`: the age warning, remembered in a cookie for two weeks
  - `<video-dialog>`: opens video pages in a dialog instead of navigating to them
  - `<video-search>`: search box and results, powered by the Pagefind index
- `eleventy.config.js`: builds the Pagefind index after every Eleventy build.
- `netlify/functions/daily-rebuild.mjs`: a scheduled function that rebuilds the site daily, so the video order changes every day. It needs a Netlify build hook URL in the `BUILD_HOOK_URL` environment variable.
