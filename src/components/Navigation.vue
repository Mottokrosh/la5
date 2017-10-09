<template>
  <nav class="main-navigation">
    <ul>
      <li><router-link to="/home"><home-icon></home-icon>Home</router-link></li>
      <li><router-link to="/about"><info-icon></info-icon>About</router-link></li>
      <li><router-link to="/models"><users-icon></users-icon>Models</router-link></li>
      <li>
        <a href="#" @click.prevent="togglePopover"><more-vertical-icon></more-vertical-icon> More</a>
        <div :class="popoverClasses" @click="popoverClick">
          <a href="http://blog.limitedaudience.com" target="_blank">Blog<file-text-icon></file-text-icon></a>
          <router-link to="/contact">Contact<mail-icon></mail-icon></router-link>
          <router-link to="/links">Links<link-icon></link-icon></router-link>
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

    data() {
      return {
        popoverActive: false,
      };
    },

    methods: {
      togglePopover() {
        this.popoverActive = !this.popoverActive;
      },

      popoverClick() {
        this.togglePopover();
      },
    },

    computed: {
      popoverClasses() {
        return {
          popover: true,
          active: this.popoverActive,
        };
      },
    },
  };
</script>
