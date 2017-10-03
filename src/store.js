import axios from 'axios';
import shuffleSeed from 'shuffle-seed';

export default {
  state: {
    videos: [],
    links: [],
  },

  loadVideos() {
    const seed = (new Date()).toISOString().substring(0, 10);
    return axios.get('/static/videos.json')
      .then((response) => {
        const filtered = response.data.filter(v => v.purchaseOptions.length > 0);
        this.state.videos = shuffleSeed.shuffle(filtered, seed);

        return this.state.videos;
      });
  },

  loadLinks() {
    return axios.get('/static/links.json')
    .then((response) => {
      this.state.links = response.data;

      return this.state.links;
    });
  },
};
