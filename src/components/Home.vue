<template>
  <div class="home">
    <search></search>

    <section class="grid">
      <div v-for="(video, index) in pageOfVideos" :key="video.title" :class="videoClasses(index)">
        <button class="transparent" @click="openModal(video)">
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
  import { ChevronLeftIcon, ChevronRightIcon } from 'vue-feather-icons';
  import Store from '../store';
  import Search from './Search';
  import VideoDetails from './VideoDetails';

  export default {
    data() {
      return {
        page: 1,
        perPage: 24,
        videos: Store.state.videos,
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
      Search,
    },

    methods: {
      videoClasses(index) {
        return {
          video: true,
          [`item-${index}`]: true,
        };
      },

      openModal(video) {
        window.showModal(VideoDetails, video);
      },

      closeModal() {
        window.hideModal();
      },
    },

    watch: {
      $route(to) {
        this.page = to.params.page || 1;
      },
    },
  };
</script>
