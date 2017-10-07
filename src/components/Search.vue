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
  </div>
</template>

<script>
  import VideoDetails from './VideoDetails';

  export default {
    methods: {
      openModal(video) {
        window.showModal(VideoDetails, video);
      },

      closeModal() {
        window.hideModal();
      },
    },
  };
</script>
