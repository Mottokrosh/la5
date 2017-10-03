<template>
  <div class="modal" v-if="show">
    <button class="transparent close" @click="close">
      <x-icon></x-icon>
    </button>
    <component :is="comp" :video="show"></component>
  </div>
</template>

<script>
  import { XIcon } from 'vue-feather-icons';

  export default {
    props: {
      comp: Object,
      show: Object,
    },

    components: {
      XIcon,
    },

    methods: {
      close() {
        this.$emit('close');
      },
    },

    watch: {
      show(val) {
        if (val) {
          document.body.classList.add('frozen');
          document.onkeydown = (evt) => {
            const event = evt || window.event;
            if (event.keyCode === 27) {
              this.close();
            }
          };
        } else {
          document.body.classList.remove('frozen');
          document.onkeydown = null;
          this.close();
        }
      },
    },
  };
</script>

<style lang="postcss">
  @import "../assets/css/global.css";

  .modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 2;
    overflow: auto;
    overflow-scrolling: touch;
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);

    & .close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      z-index: 3;
      background-color: var(--main);
      border-radius: 50%;
      display: flex;
      padding: 0.5rem;
    }
  }
</style>