<template>
  <div class="search">
    <ais-index
      index-name="videos"
      :search-store="searchStore"
    >
      <ais-search-box placeholder="Search..."></ais-search-box>

      <ais-results v-if="hasSearchQuery">
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

      <ais-pagination v-if="hasSearchQuery">
        <chevrons-left-icon slot="first"></chevrons-left-icon>
        <chevron-left-icon slot="previous"></chevron-left-icon>
        <chevron-right-icon slot="next"></chevron-right-icon>
        <chevrons-right-icon slot="last"></chevrons-right-icon>
      </ais-pagination>
    </ais-index>
  </div>
</template>

<script>
  import { createFromAlgoliaCredentials } from 'vue-instantsearch';
  import { ChevronLeftIcon, ChevronsLeftIcon, ChevronRightIcon, ChevronsRightIcon } from 'vue-feather-icons';
  import VideoDetails from './VideoDetails';

  const searchStore = createFromAlgoliaCredentials('QYZAN29OEY', '8f1503e6b39a8aed111ee486794ef4de');

  export default {
    data() {
      return {
        searchStore,
      };
    },

    computed: {
      hasSearchQuery() {
        return this.searchStore.query.length > 0;
      },
    },

    components: {
      ChevronLeftIcon,
      ChevronsLeftIcon,
      ChevronRightIcon,
      ChevronsRightIcon,
    },

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
