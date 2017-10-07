<template>
  <div class="modal" v-if="show">
    <button class="transparent close" @click="close">
      <x-icon></x-icon>
    </button>
    <component :is="component" :component-data="componentData"></component>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { XIcon } from 'vue-feather-icons';

  export default {
    data() {
      return {
        component: null,
        componentData: null,
        show: false,
      };
    },

    components: {
      XIcon,
    },

    methods: {
      open(comp, compData) {
        this.component = comp;
        this.componentData = compData;
        this.show = true;
      },

      close() {
        this.show = false;
        this.component = null;
        this.componentData = null;
      },
    },

    created() {
      if (!window.modalEvents) {
        window.modalEvents = new Vue();

        window.showModal = (comp, compData) => {
          window.modalEvents.$emit('showModal', comp, compData);
        };

        window.hideModal = () => {
          window.modalEvents.$emit('hideModal');
        };
      }

      window.modalEvents.$on('showModal', (comp, compData) => {
        this.open(comp, compData);
      });

      window.modalEvents.$on('hideModal', () => {
        this.close();
      });
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
