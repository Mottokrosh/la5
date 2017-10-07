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
