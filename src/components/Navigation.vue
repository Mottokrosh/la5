<template>
  <nav class="main-navigation">
    <ul>
      <li><router-link to="/"><home-icon></home-icon> Home</router-link></li>
      <li><router-link to="/about"><info-icon></info-icon> About</router-link></li>
      <li><router-link to="/contact"><mail-icon></mail-icon> Contact</router-link></li>
      <li><router-link to="/links"><link-icon></link-icon> Links</router-link></li>
    </ul>
  </nav>
</template>

<script>
  import { HomeIcon, InfoIcon, LinkIcon, MailIcon } from 'vue-feather-icons';

  export default {
    components: {
      HomeIcon,
      InfoIcon,
      LinkIcon,
      MailIcon,
    },
  };
</script>

<style>
  @import "../assets/css/global.css";

  .main-navigation {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--main);
    color: var(--white);

    & a {
      color: var(--white);
      text-decoration: none;
    }

    & ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: stretch;
      max-width: var(--maxWidth);
    }

    & li {
      flex: 1 1 auto;
    }

    & a {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;

      &:hover {
        background-color: var(--mainLighter);
        color: var(--whiteDarker);
      }

      &.router-link-active {
        background-color: var(--mainLighter);
      }
    }
  }
</style>
