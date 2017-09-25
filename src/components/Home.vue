<template>
  <div>
    <section class="grid">
      <div v-for="(video, index) in pageOfVideos" :key="index" :class="'item-' + index">
        <button class="transparent">
          <img :src="video.cover['320']">
        </button>
      </div>
    </section>

    <nav class="pagination">
      <router-link
        v-if="page > 1"
        :to="{ name: 'HomePaginated', params: { page: page - 1 }}">
          <chevron-left-icon></chevron-left-icon> Previous
      </router-link>
      <span v-else><chevron-left-icon></chevron-left-icon> Previous</span>

      <router-link
        v-if="page < totalPages"
        :to="{ name: 'HomePaginated', params: { page: page + 1 }}">
          Next <chevron-right-icon></chevron-right-icon>
      </router-link>
      <span v-else>Next <chevron-right-icon></chevron-right-icon></span>
    </nav>
  </div>
</template>

<script>
  import axios from 'axios';
  import { ChevronLeftIcon, ChevronRightIcon } from 'vue-feather-icons';

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

    components: {
      ChevronLeftIcon,
      ChevronRightIcon,
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
      transition: transform 100ms ease-out;

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  .pagination {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    
    & > * {
      display: flex;
      padding: 0.5rem;
    }

    & > span {
      opacity: 0.3;
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
