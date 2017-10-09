<template>
  <nav class="main-navigation">
    <ul>
      <li><router-link to="/home"><home-icon></home-icon> Home</router-link></li>
      <li><router-link to="/about"><info-icon></info-icon> About</router-link></li>
      <li><router-link to="/models"><users-icon></users-icon> Models</router-link></li>
      <li>
        <a href="#"><more-vertical-icon></more-vertical-icon> More</a>
        <div class="popover">
          <a href="http://blog.limitedaudience.com" target="_blank"><file-text-icon></file-text-icon> Blog</a>
          <router-link to="/contact"><mail-icon></mail-icon> Contact</router-link>
          <router-link to="/links"><link-icon></link-icon> Links</router-link>
        </div>
      </li>
    </ul>
  </nav>
</template>

<script>
  import { FileTextIcon, HomeIcon, InfoIcon, LinkIcon, MailIcon, MoreVerticalIcon, UsersIcon } from 'vue-feather-icons';

  export default {
    components: {
      FileTextIcon,
      HomeIcon,
      InfoIcon,
      LinkIcon,
      MailIcon,
      MoreVerticalIcon,
      UsersIcon,
    },
  };
</script>
