<template>
  <div>
    <section class="grid">
      <div v-for="(video, index) in pageOfVideos" :key="video.title" :class="videoClasses(index, video)">
        <button class="transparent" @click="showVideo(video)">
          <img :src="video.cover['320']">
        </button>

        <video-details :video="video" @close="hideVideo(video)"></video-details>
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
  import { ChevronLeftIcon, ChevronRightIcon, CreditCardIcon, XIcon } from 'vue-feather-icons';
  import shuffleSeed from 'shuffle-seed';
  import VideoDetails from './VideoDetails';

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
      CreditCardIcon,
      VideoDetails,
      XIcon,
    },

    methods: {
      videoClasses(index, video) {
        return {
          video: true,
          [`item-${index}`]: true,
          active: video.active,
        };
      },
    },

    created() {
      const seed = (new Date()).toISOString().substring(0, 10);
      axios.get('/static/videos.json')
        .then((response) => {
          const filtered = response.data.filter(v => v.purchaseOptions.length > 0);
          this.videos = shuffleSeed.shuffle(filtered, seed);
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
