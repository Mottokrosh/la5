<template>
  <div id="app">
    <the-header></the-header>
    <router-view></router-view>
    <navigation></navigation>
    <modal></modal>
  </div>
</template>

<script>
  import Modal from '@/components/Modal';
  import TheHeader from '@/components/TheHeader';
  import Navigation from '@/components/Navigation';

  export default {
    name: 'app',

    components: {
      Modal,
      TheHeader,
      Navigation,
    },
  };
</script>

<style src="./assets/css/app.css" lang="postcss"></style>