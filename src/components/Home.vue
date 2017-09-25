<template>
  <div>
    <section class="grid">
      <div v-for="(video, index) in pageOfVideos" :key="index" :class="'item-' + index">
        <img :src="video.cover['320']">
      </div>
    </section>

    <nav class="pagination">
      <router-link
        v-if="page > 1"
        :to="{ name: 'HomePaginated', params: { page: page - 1 }}">
          Previous
      </router-link>
      <span v-else>Previous</span>

      <router-link
        v-if="page < totalPages"
        :to="{ name: 'HomePaginated', params: { page: page + 1 }}">
          Next
      </router-link>
      <span v-else>Next</span>
    </nav>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        page: 1,
        perPage: 20,
        videos: [],
      };
    },

    computed: {
      offset() {
        return (this.page * this.perPage) - this.perPage;
      },

      totalPages() {
        return Math.ceil(this.videos.length / this.perPage);
      },

      pageOfVideos() {
        return this.videos.slice(this.offset, this.page * this.perPage);
      },
    },

    created() {
      axios.get('/static/videos.json')
        .then((response) => {
          this.videos = response.data;
        });
    },

    watch: {
      $route(to) {
        this.page = to.params.page || 1;
      },
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

  .pagination {
    margin-top: 1rem;
    text-align: center;
    
    & > * {
      display: inline-block;
      padding: 0.5rem;
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
