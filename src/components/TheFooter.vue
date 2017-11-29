<template>
  <footer role="contentinfo" class="site-footer">
    <div>
      <div>The content of this website is copyright &copy; 2000&ndash;{{ year }} Frank Reding. All rights reserved.</div>

      <nav>
        <ul>
          <li><router-link :to="{ name: 'Home' }">Home</router-link> &middot;</li>
          <li><router-link :to="{ name: 'About' }">About</router-link> &middot;</li>
          <li><router-link :to="{ name: 'Models' }">Models</router-link> &middot;</li>
          <li><a href="http://blog.limitedaudience.com" target="_blank">Blog</a> &middot;</li>
          <li><router-link :to="{ name: 'Contact' }">Contact</router-link> &middot;</li>
          <li><router-link :to="{ name: 'Links' }">Links</router-link> &middot;</li>
          <li><router-link :to="{ name: 'Usc2257' }">USC 2257</router-link> &middot;</li>
          <li><router-link :to="{ name: 'PrivacyPolicy' }">Privacy Policy</router-link></li>
        </ul>
      </nav>

      <div class="social-media">
        <a href="https://twitter.com/LimitedAudience?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false">Follow @LimitedAudience</a>
      </div>

      <a href="http://www.bondagefederation.com/" target="_blank" class="bf-link">
        <img src="/static/bondage_federation_120x120.png" alt="Bondage Federation">
      </a>
    </div>
  </footer>
</template>

<script>
  export default {
    computed: {
      year() {
        return (new Date()).getFullYear();
      },
    },
  };
</script>