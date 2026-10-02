import { mkdir, writeFile } from 'node:fs/promises';
import { getStore } from '@netlify/blobs';

// The gallery metadata lives in Netlify Blobs (it includes the permanent
// collection, so it can't be in this public repo). Blobs can't be read from
// the build command itself, but build plugins get the credentials, so fetch
// it here and leave it where src/_data/photos.js looks for it.
const OUTPUT = '.cache/photos/galleries.json';

export async function onPreBuild({ constants, utils }) {
  const store = getStore({ name: 'photos', siteID: constants.SITE_ID, token: constants.NETLIFY_API_TOKEN });

  let data;
  try {
    data = await store.get('galleries');
  } catch (error) {
    utils.build.failBuild('Couldn’t read the photos blob store', { error });
  }
  if (!data) {
    utils.build.failBuild('The "galleries" blob in the "photos" store is missing; see the README');
  }

  await mkdir('.cache/photos', { recursive: true });
  await writeFile(OUTPUT, data);
  console.log(`Wrote ${OUTPUT} (${Math.round(data.length / 1024)} KB)`);
}
