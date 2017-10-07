<template>
  <div id="app">
    <the-header></the-header>
    <router-view></router-view>
    <navigation></navigation>
  </div>
</template>

<script>
  import TheHeader from '@/components/TheHeader';
  import Navigation from '@/components/Navigation';

  export default {
    name: 'app',

    components: {
      TheHeader,
      Navigation,
    },
  };
</script>

<style src="./assets/css/app.css" lang="postcss"></style>