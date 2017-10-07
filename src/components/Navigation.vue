<template>
  <nav class="main-navigation">
    <ul>
      <li><router-link to="/home"><home-icon></home-icon> Home</router-link></li>
      <li><router-link to="/search"><search-icon></search-icon> Search</router-link></li>
      <li><router-link to="/about"><info-icon></info-icon> About</router-link></li>
      <li><router-link to="/contact"><mail-icon></mail-icon> Contact</router-link></li>
      <li><router-link to="/links"><link-icon></link-icon> Links</router-link></li>
    </ul>
  </nav>
</template>

<script>
  import { HomeIcon, InfoIcon, LinkIcon, MailIcon, SearchIcon } from 'vue-feather-icons';

  export default {
    components: {
      HomeIcon,
      InfoIcon,
      LinkIcon,
      MailIcon,
      SearchIcon,
    },
  };
</script>
