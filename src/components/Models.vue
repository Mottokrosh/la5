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
  export default {
    data() {
      return {
        pictureWidth: 156,
        pictureHeight: 156,
        models: [
          {
            name: 'Eve',
            picX: 0,
            picY: 0,
          },
          {
            name: 'Kittysocks',
            picX: 156,
            picY: 0,
          },
          {
            name: 'Alais Peach',
            picX: 312,
            picY: 0,
          },
          {
            name: 'Anastasia',
            picX: 468,
            picY: 0,
          },
          {
            name: 'Freya',
            picX: 624,
            picY: 0,
          },
          {
            name: 'Jewell Marceau',
            picX: 780,
            picY: 0,
          },
          {
            name: 'Fayth on Fire',
            picX: 936,
            picY: 0,
          },
          {
            name: 'AltSiren',
            picX: 1092,
            picY: 0,
          },
          {
            name: 'Ammalia',
            picX: 1248,
            picY: 0,
          },
          {
            name: 'Caroline Pierce',
            picX: 1404,
            picY: 0,
          },
          {
            name: 'Fay',
            picX: 0,
            picY: 312,
          },
          {
            name: 'Trisha',
            picX: 156,
            picY: 312,
          },
          {
            name: '',
            picX: 0,
            picY: 0,
          },
          {
            name: '',
            picX: 0,
            picY: 0,
          },
          {
            name: '',
            picX: 0,
            picY: 0,
          },
          {
            name: '',
            picX: 0,
            picY: 0,
          },
          {
            name: '',
            picX: 0,
            picY: 0,
          },
          {
            name: '',
            picX: 0,
            picY: 0,
          },
          {
            name: '',
            picX: 0,
            picY: 0,
          },
        ],
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