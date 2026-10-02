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
- `src/_data/photos.js`: loads the gallery photo metadata (see [Photos](#photos)) and picks the day's 100 random photos, leaving out the permanent collection. Each model's page shows the ones she's in.
- `src/*.html`, `src/*.njk`: the pages. Every video gets its own page at `/videos/<slug>/`.
- `src/css/`: plain CSS, combined into `/app.css` by `src/app.css.11ty.js`.
- `src/js/`: web components that enhance the static HTML:
  - `<age-gate>`: the age warning, remembered in a cookie for two weeks
  - `<video-dialog>`: opens video pages in a dialog instead of navigating to them
  - `<video-search>`: search box and results, powered by the Pagefind index
  - `<photo-gallery>`: opens the photo tiles inside it in a [PhotoSwipe](https://photoswipe.com/) lightbox
  - `<admin-gallery>`: the admin area's searchable grid of every photo
  - `vendor/trackpad-gestures.js`: PhotoSwipe plugin for trackpad swipes, copied from fast-gallery (`src/client/trackpad-gestures.js`). Keep the two in sync.
- `eleventy.config.js`: builds the Pagefind index after every Eleventy build.
- `netlify/functions/daily-rebuild.mjs`: a scheduled function that rebuilds the site daily, so the video order changes every day. It needs a Netlify build hook URL in the `BUILD_HOOK_URL` environment variable.
- `src/_headers.11ty.js`: password-protects `/admin/` with Netlify's Basic-Auth (user `admin`, password from the `ADMIN_PASSWORD` environment variable). Netlify builds fail without it, so the admin area can't go live unprotected.

## Photos

`/photos/` shows 100 random gallery photos, changing daily, and each model page shows the ones she appears in. `/admin/` shows every gallery photo, newest first, and you can search it by title, model and description. The permanent collection only appears in the admin area, and photostories aren't included.

The photos are in the `limited-audience-gallery` S3 bucket (eu-central-1) and served through CloudFront. The keys are unguessable, of the form `full/<key>.avif|jpg` and `thumb/<key>.avif|jpg`. The metadata is kept in Netlify Blobs, not in this public repo, because it includes the permanent collection. Before each Netlify build, a local build plugin (`netlify/plugins/photo-data/`) fetches it from the `galleries` key of the `photos` store into `.cache/`, because the build command itself can't read Blobs. `/admin/photos.json` is the only place it gets published, and that path is behind the password.

### Exporting the photos

`tools/photo-export/` reads the galleries from the LimitedAudienceLar database and media drive. For each photo it encodes full-size (long edge up to 2400px) and 400px-high thumbnail versions as AVIF and JPEG, uploads them, and writes `out/galleries.json`.

1. Mount the media drive and start the database: `docker compose up -d db` in LimitedAudienceLar.
2. Create `tools/photo-export/.env` with these values:
   - `EXPORT_SALT`: any long random string. Keep it safe and never change it, because it determines the object keys.
   - `AWS_PROFILE=la5-photo-export`: an AWS CLI profile with the access key of the `la5-photo-export` IAM user. That user can only upload to the bucket and list it. Without this setting the export uses your default AWS credentials.
3. Run the export:
   ```bash
   cd tools/photo-export
   npm install
   node export.mjs --limit 200   # a trial run
   npm run export                # everything; caffeinate keeps the Mac awake (or `npm run photos:export` from the repo root)
   ```
   The export can be stopped and resumed at any point. It records each finished photo in `.progress.jsonl` and re-runs skip those. Ctrl-C finishes the photos in progress before stopping. If the network or the drive goes away, it stops after a handful of failures; just run it again. Failed photos are listed in `.failures.jsonl` and retried on the next run. `npm run verify` checks that the bucket has every logged object and queues any missing ones to be redone.
4. Upload the metadata, then trigger a deploy:
   ```bash
   netlify blobs:set photos galleries --input out/galleries.json
   ```

To try the pages locally without S3, run `node export.mjs --local --limit 500`. It writes to `out/local/`, which `npm start` serves at `/local-photos`.

### Netlify environment variables

- `ADMIN_PASSWORD`: the admin area's password.

### CloudFront

The gallery photos, video covers and trailers are served through CloudFront, where AWS's always-free tier covers 1 TB of downloads a month. Downloads from S3 to CloudFront are free.

| Bucket | Distribution | Address |
|---|---|---|
| `limited-audience-gallery` | `E1C7KB8Q7KLHF9` | `https://d14bn3hw7yvfhd.cloudfront.net` |
| `limited-audience-covers` | `E3CGUU93ABGFV3` | `https://d3h12rtbqhy9yo.cloudfront.net` |
| `limited-audience-trailers` | `E7IB8YMIW1251` | `https://d20xnhkw69yz83.cloudfront.net` |

- **Access:** each distribution reads its bucket through the `la5-s3` Origin Access Control, which each bucket's policy allows. The three buckets are private, with all of Block Public Access on, so direct S3 URLs return 403.
- **Price class:** `PriceClass_100`, meaning edge locations in Europe and North America.
- **Caching:** the `la5-static-min-1d` cache policy keeps files for at least a day and otherwise follows each file's own `Cache-Control`:
  - gallery photos: `public, max-age=31536000, immutable`, set by the export
  - covers and trailers: `public, max-age=2592000` (30 days)

  Upload new covers and trailers with the same header, for example:
  ```bash
  aws s3 cp <file> s3://limited-audience-covers/ --cache-control "public, max-age=2592000"
  ```
- **Replaced files:** after replacing a cover or trailer under the same name, create an invalidation, for example:
  ```bash
  aws cloudfront create-invalidation --distribution-id E3CGUU93ABGFV3 --paths "/<file>"
  ```
  Browsers that already have the old file can keep it for up to 30 days.

The banners in `links.json` are still served straight from S3.
