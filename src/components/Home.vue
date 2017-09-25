<template>
  <div class="grid">
    <div v-for="(video, index) in pageOfVideos" :key="index" :class="'item-' + index">
      <img :src="video.cover['320']">
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        videos: [],
        pageOfVideos: [],
      };
    },

    mounted() {
      axios.get('/static/videos.json')
        .then((response) => {
          this.videos = response.data;
          this.pageOfVideos = this.videos.slice(0, 20);
        });
    },
  };
</script>

<style>
  @import "../assets/css/global.css";

  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 1rem;

    & img {
      max-width: 100%;
      display: block;
    }
  }

  @media screen and (max-width: 640px) {
    .grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media screen and (max-width: 480px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
