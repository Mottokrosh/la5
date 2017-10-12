import shuffleSeed from 'shuffle-seed';
import videos from './data/videos.json';
import links from './data/links.json';
import models from './data/models.json';

const seed = (new Date()).toISOString().substring(0, 10);
const videosFiltered = videos.filter(v => v.purchaseOptions.length > 0);
const videosShuffled = shuffleSeed.shuffle(videosFiltered, seed);

/* eslint-disable no-plusplus */
videosShuffled.forEach((video) => {
  video.models.forEach((modelSlug) => {
    const model = models.find(m => m.slug === modelSlug);
    if (model) model.videosCount++;
  });
});

export default {
  state: {
    videos: videosShuffled,
    links,
    models,
  },
};
