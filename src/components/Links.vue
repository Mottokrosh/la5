<template>
  <div>
    <h2>Links</h2>
    <span>Text Links</span> | <router-link to="/banner-links">Banner Links</router-link>
    <ul>
      <li v-for="(link, index) in links" :key="index">
        <a :href="link.url" target="_blank">{{ link.name }}</a> &mdash; {{ link.description }}
      </li>
    </ul>
  </div>
</template>

<script>
  import Store from '../store';

  export default {
    data() {
      return {
        store: Store,
        links: Store.state.links,
      };
    },

    created() {
      if (!this.links.length) {
        this.store.loadLinks()
          .then((links) => { this.links = links; });
      }
    },
  };
</script>