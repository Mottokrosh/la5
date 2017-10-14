<template>
  <div class="model-details">
    <header>
      <div class="title">
        <router-link to="/models" role="button" class="round">
          <chevron-left-icon></chevron-left-icon>
        </router-link>

        <h2>
          <span>{{ model.name }}</span>
          <small>Appears in {{ model.videosCount }} videos</small>
        </h2>
      </div>

      <div class="picture">
        <div :style="`background-position: -${model.picX}px -${model.picY + 156}px`"></div>
      </div>
    </header>

  </div>
</template>

<script>
  import { ChevronLeftIcon } from 'vue-feather-icons';
  import Store from '../store';

  export default {
    components: {
      ChevronLeftIcon,
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
  };
</script>