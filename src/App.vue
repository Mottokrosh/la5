<template>
  <div id="app">
    <the-header></the-header>
    <router-view class="view"></router-view>
    <the-footer></the-footer>
    <navigation></navigation>
    <modal></modal>
  </div>
</template>

<script>
  import Modal from '@/components/Modal';
  import TheHeader from '@/components/TheHeader';
  import TheFooter from '@/components/TheFooter';
  import Navigation from '@/components/Navigation';

  export default {
    name: 'app',

    components: {
      Modal,
      TheHeader,
      TheFooter,
      Navigation,
    },
  };
</script>

<style src="./assets/css/app.css" lang="postcss"></style>