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
