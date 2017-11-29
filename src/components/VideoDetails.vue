<template>
  <div class="video-details">
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
        <div v-for="(po, index) in video.purchaseOptions" :key="index">
          <a role="button" :href="po.url" target="_blank">
            <credit-card-icon></credit-card-icon>
            <span>Buy at {{ po.storeName }} for {{ po.currency }}{{ po.price }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { CreditCardIcon } from 'vue-feather-icons';

  export default {
    props: {
      componentData: Object,
    },

    data() {
      return {
        video: this.componentData,
      };
    },

    components: {
      CreditCardIcon,
    },
  };
</script>
