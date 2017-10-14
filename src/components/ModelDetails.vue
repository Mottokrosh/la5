<template>
  <div class="model-details">
    <header>
      <div class="title">
        <router-link to="/models" role="button" class="round">
          <arrow-left-icon></arrow-left-icon>
        </router-link>

        <h2>
          <span>{{ model.name }}</span>
          <small>Appears in {{ model.videosCount }} video{{ model.videosCount === 1 ? '': 's' }}</small>
        </h2>
      </div>

      <div class="picture">
        <div :style="`background-position: -${model.picX}px -${model.picY + 156}px`"></div>
      </div>
    </header>

    <section class="grid">
      <div v-for="(video, index) in videos" :key="video.title" :class="videoClasses(index)">
        <button class="transparent" @click="openModal(video)">
          <img :src="video.cover['320']">
        </button>
      </div>
    </section>
  </div>
</template>

<script>
  import { ArrowLeftIcon } from 'vue-feather-icons';
  import Store from '../store';
  import VideoDetails from './VideoDetails';

  export default {
    components: {
      ArrowLeftIcon,
    },

    data() {
      return {
        models: Store.state.models,
        modelSlug: this.$route.params.slug,
      };
    },

    computed: {
      model() {
        return this.models.find(m => m.slug === this.modelSlug);
      },

      videos() {
        return Store.state.videos.filter(video => video.models.indexOf(this.model.slug) !== -1);
      },
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
    },
  };
</script>