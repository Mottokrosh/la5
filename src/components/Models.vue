<template>
  <div class="models">
    <ul>
      <li v-for="model in models" :key="model.name" v-if="model.name">
        <router-link
          :to="{ name: 'ModelDetails', params: { slug: model.slug } }"
          class="avatar"
          :style="style(model)"
          @mouseover.native="hoverStyle(model, $event)"
          @mouseout.native="normalStyle(model, $event)"
        ></router-link>
        <router-link
          :to="{ name: 'ModelDetails', params: { slug: model.slug } }"
          class="name"
        >
          <span>{{ model.name }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import Store from '../store';

  export default {
    data() {
      return {
        allModels: Store.state.models,
        pictureWidth: 156,
        pictureHeight: 156,
        divider: 1,
      };
    },

    computed: {
      models() {
        const models = this.allModels.filter(m => m.videosCount > 0);
        models.sort((a, b) => {
          if (a.videosCount < b.videosCount) {
            return 1;
          }
          if (a.videosCount > b.videosCount) {
            return -1;
          }
          return 0;
        });
        return models;
      },
    },

    methods: {
      style(model) {
        return `background-position: -${model.picX / this.divider}px -${model.picY / this.divider}px`;
      },

      hoverStyle(model, $event) {
        const el = $event.target;
        const y = (model.picY / this.divider) + this.pictureHeight;
        el.style = `background-position: -${model.picX / this.divider}px -${y}px`;
      },

      normalStyle(model, $event) {
        const el = $event.target;
        el.style = `background-position: -${model.picX / this.divider}px -${model.picY / this.divider}px`;
      },

      onWidthChange(mq) {
        if (mq.matches) {
          this.pictureWidth = 78;
          this.pictureHeight = 78;
          this.divider = 2;
        } else {
          this.pictureWidth = 156;
          this.pictureHeight = 156;
          this.divider = 1;
        }
      },
    },

    mounted() {
      const mq = window.matchMedia('(max-width: 400px)');
      mq.addListener(this.onWidthChange);
      this.onWidthChange(mq);
    },
  };
</script>