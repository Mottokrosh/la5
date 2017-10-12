<template>
  <div class="models">
    <ul>
      <li v-for="model in models" :key="model.name" v-if="model.name">
        <a href="#"
          class="avatar"
          :style="style(model)"
          @mouseover="hoverStyle(model, $event)"
          @mouseout="normalStyle(model, $event)"
        ></a>
        <a href="#" class="name"><span>{{ model.name }}</span></a>
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
      };
    },

    methods: {
      style(model) {
        return `background-position: -${model.picX}px -${model.picY}px`;
      },

      hoverStyle(model, $event) {
        const el = $event.target;
        const y = model.picY + this.pictureHeight;
        el.style = `background-position: -${model.picX}px -${y}px`;
      },

      normalStyle(model, $event) {
        const el = $event.target;
        el.style = `background-position: -${model.picX}px -${model.picY}px`;
      },
    },
  };
</script>