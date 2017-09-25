<template>
  <div :class="classes">
    <div class="details">
      <button class="transparent close" @click="close">
        <x-icon></x-icon>
      </button>

      <video :poster="video.cover['1280']" controls>
        <source :src="video.trailer.url" type="video/mp4">
      </video>

      <div>
        <h3>{{ video.title }}</h3>
        <p class="models">Starring {{ formatModels(video.models) }}</p>
        <p v-html="video.description" class="description"></p>
        <div class="flex-container specs">
          <p class="dimensions">Dimensions: <span>{{ video.video.width }}&times;{{ video.video.height }}</span></p>
          <p class="duration">Duration: <span>{{ video.video.duration }}</span></p>
          <p class="filesize">Filesize: <span>{{ video.video.filesize | filesize }}</span></p>
        </div>
        <div class="purchase-options">
          <a role="button" href="#"><credit-card-icon></credit-card-icon> <span>Buy at Clips4Sale for $6.95</span></a>
          <a v-for="(po, index) in video.purchaseOptions" :key="index" role="button" :href="po.url">
            <credit-card-icon></credit-card-icon>
            <span>Buy at {{ po.name }} for {{ po.currency }}{{ po.price }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { CreditCardIcon, XIcon } from 'vue-feather-icons';

  export default {
    props: {
      video: Object,
    },

    components: {
      CreditCardIcon,
      XIcon,
    },

    computed: {
      classes() {
        return {
          video: true,
          // [`item-${index}`]: true,
          active: this.video.active,
        };
      },
    },

    methods: {
      close() {
        this.$emit('close');
      },
    },
  };
</script>
