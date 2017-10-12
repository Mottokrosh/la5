<template>
  <div class="models">
    <ul>
      <li v-for="model in models" :key="model.name" v-if="model.name">
        <a href="#"
          class="avatar"
          :style="style(model)"
          @mouseover="hoverStyle(model, $event)"
          @mouseout="normalStyle(model, $event)"
          @click.prevent="showModelDetails(model)"
        ></a>
        <a href="#" class="name" @click.prevent="showModelDetails(model)">
          <span>{{ model.name }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  import Store from '../store';

  export default {
    data() {
      return {
        videos: Store.state.videos,
        models: Store.state.models,
        pictureWidth: 156,
        pictureHeight: 156,
        divider: 1,
      };
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
          this.pictureWidth = 88;
          this.pictureHeight = 88;
          this.divider = 2;
        } else {
          this.pictureWidth = 156;
          this.pictureHeight = 156;
          this.divider = 1;
        }
      },

      showModelDetails(model) {
        // eslint-disable-next-line
        console.log(model);
      },
    },

    mounted() {
      const mq = window.matchMedia('(max-width: 400px)');
      mq.addListener(this.onWidthChange);
      this.onWidthChange(mq);
    },
  };
</script>