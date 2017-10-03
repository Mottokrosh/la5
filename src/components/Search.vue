<template>
  <div class="search">
    <h2>Search</h2>

    <ais-index
      app-id="QYZAN29OEY"
      api-key="8f1503e6b39a8aed111ee486794ef4de"
      index-name="videos"
    >
      <ais-search-box></ais-search-box>
      <ais-results>
        <template scope="{ result }">
          <button class="transparent result" @click="openModal(result)">
            <div class="cover">
              <img :src="result.cover['320']">
            </div>
            <div class="text">
              <h4>
                <ais-highlight :result="result" attribute-name="title"></ais-highlight>
              </h4>
              <p>{{ formatModels(result.models) }}</p>
            </div>
          </button>
        </template>
      </ais-results>
      <ais-pagination></ais-pagination>
    </ais-index>

    <modal
      :comp="videoDetailsComponent"
      :show="show"
      @close="closeModal"
    ></modal>
  </div>
</template>

<script>
  import Modal from './Modal';
  import VideoDetails from './VideoDetails';

  export default {
    components: {
      Modal,
      VideoDetails,
    },

    data() {
      return {
        show: null,
        videoDetailsComponent: VideoDetails,
      };
    },

    methods: {
      openModal(video) {
        this.show = video;
      },

      closeModal() {
        this.show = null;
      },
    },
  };
</script>


<style lang="postcss">
  @import "../assets/css/global.css";

  .search {
    & form {
      display: flex;
      align-items: stretch;
      margin-bottom: 1rem;

      & input {
        flex: 1;
      }

      & button {
        margin-left: 0.5rem;

        & svg {
          fill: var(--white);
        }
      }
    }

    & .ais-pagination {
      list-style: none;
      padding: 0;
      display: flex;
      justify-content: center;

      & li {
        padding: 0.25rem;
      }
    }
  }

  .result {
    display: flex;
    text-align: left;
    font-size: 0.8rem;
    background-color: color(var(--main) alpha(-80%)) !important;
    margin: 0 0 0.25rem 0 !important;
    width: 100%;

    & .cover {
      width: 120px;
      min-width: 120px;
    }

    & img {
      max-width: 100%;
      display: block;
    }

    & h4 {
      margin: 0;
    }

    & .text {
      margin: 0 0 0 1rem;

      & p {
        margin: 0;
      }
    }
  }
</style>
