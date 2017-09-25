<template>
  <div>
    <section class="grid">
      <div v-for="(video, index) in pageOfVideos" :key="video.title" :class="videoClasses(index, video)">
        <button class="transparent" @click="showVideo(video)">
          <img :src="video.cover['320']">
        </button>

        <div class="details">
          <button class="transparent close" @click="hideVideo(video)">
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
    </section>

    <nav class="pagination">
      <router-link
        v-if="page > 1"
        :to="{ name: 'HomePaginated', params: { page: page - 1 }}">
          <chevron-left-icon></chevron-left-icon> Previous
      </router-link>
      <span v-else><chevron-left-icon></chevron-left-icon> Previous</span>

      <router-link
        v-if="page < totalPages"
        :to="{ name: 'HomePaginated', params: { page: page + 1 }}">
          Next <chevron-right-icon></chevron-right-icon>
      </router-link>
      <span v-else>Next <chevron-right-icon></chevron-right-icon></span>
    </nav>
  </div>
</template>

<script>
  import axios from 'axios';
  import { ChevronLeftIcon, ChevronRightIcon, CreditCardIcon, XIcon } from 'vue-feather-icons';

  export default {
    data() {
      return {
        page: 1,
        perPage: 20,
        videos: [],
      };
    },

    computed: {
      offset() {
        return (this.page * this.perPage) - this.perPage;
      },

      totalPages() {
        return Math.ceil(this.videos.length / this.perPage);
      },

      pageOfVideos() {
        return this.videos.slice(this.offset, this.page * this.perPage);
      },
    },

    components: {
      ChevronLeftIcon,
      ChevronRightIcon,
      CreditCardIcon,
      XIcon,
    },

    methods: {
      videoClasses(index, video) {
        return {
          video: true,
          [`item-${index}`]: true,
          active: video.active,
        };
      },

      showVideo(video) {
        this.$set(video, 'active', true);
        document.body.classList.add('frozen');
        document.onkeydown = (evt) => {
          const event = evt || window.event;
          if (event.keyCode === 27) {
            this.hideVideo(video);
          }
        };
      },

      hideVideo(video) {
        this.$set(video, 'active', false);
        document.body.classList.remove('frozen');
        document.onkeydown = null;
      },

      formatModels(models) {
        let formatted = [];
        models.forEach((m) => {
          let f = m;
          f = f.replace('-', ' ');
          f = f.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1));
          formatted.push(f);
        });
        formatted = formatted.join(', ');
        formatted = formatted.replace(/,([^,]*)$/, ' & $1');
        return formatted;
      },
    },

    created() {
      axios.get('/static/videos.json')
        .then((response) => {
          this.videos = response.data;
        });
    },

    watch: {
      $route(to) {
        this.page = to.params.page || 1;
      },
    },
  };
</script>

<style>
  @import "../assets/css/global.css";

  .frozen {
    overflow: hidden;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 1rem;

    & img {
      max-width: 100%;
      display: block;
      transition: transform 100ms ease-out;

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  .video {
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);

    & .details {
      display: none;
      max-width: var(--maxWidth);
      margin: 0 auto;

      & > div {
        padding: 2rem;
      }
    }

    &.active {
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

      & > button {
        display: none;
      }

      & .details {
        display: block;
      }

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

      & video {
        width: 100%;
        display: flex;
      }
    }

    & .models {
      color: var(--whiteDarker);
    }

    & .specs {
      justify-content: space-between;
      font-size: 0.8rem;

      & span {
        color: var(--mainLighter);
      }
    }

    & .purchase-options {
      margin-top: 2rem;
      text-align: center;
    }
  }

  .pagination {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    
    & > * {
      display: flex;
      padding: 0.5rem;
    }

    & > span {
      opacity: 0.3;
    }
  }

  @media screen and (max-width: 640px) {
    .grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media screen and (max-width: 480px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
