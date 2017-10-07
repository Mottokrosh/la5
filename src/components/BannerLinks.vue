<template>
  <div class="banner-links">
    <h2>Links</h2>
    <router-link to="/links">Text Links</router-link> | <span>Banner Links</span>
    <ul>
      <li v-for="(link, index) in links" :key="index">
        <a :href="link.url" target="_blank"><img :src="link.banner"></a><br>
        <a :href="link.url" target="_blank">{{ link.name }}</a>
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
