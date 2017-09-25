<template>
  <div>
    <p>Hello, world.</p>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        videos: [],
      };
    },

    mounted() {
      axios.get('/static/videos.json')
        .then((response) => {
          this.videos = response.data;
        });
    },
  };
</script>

<style>
  @import "../assets/css/global.css";
</style>
