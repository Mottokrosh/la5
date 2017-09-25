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
  import axios from 'axios';

  export default {
    data() {
      return {
        links: [],
      };
    },

    created() {
      axios.get('/static/links.json')
        .then((response) => {
          this.links = response.data;
        });
    },
  };
</script>