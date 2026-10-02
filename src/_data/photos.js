import { loadPhotoData, photoTile } from '../_lib/photo-data.js';
import { dailySeed, shuffle } from '../_lib/shuffle.js';

const DAILY_COUNT = 100;

export default async function () {
  const data = await loadPhotoData();
  if (!data) return { daily: [] };

  // The permanent collection only appears in the admin area
  const publicPhotos = data.sets.filter(set => !set.permanent).flatMap(set => set.photos.map(photoTile(data.base, set)));

  return {
    daily: shuffle(publicPhotos, dailySeed()).slice(0, DAILY_COUNT),
  };
}
