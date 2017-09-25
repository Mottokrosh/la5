<template>
  <div id="app">
    <la-header></la-header>
    <router-view></router-view>
    <navigation></navigation>
  </div>
</template>

<script>
  import LaHeader from '@/components/Header';
  import Navigation from '@/components/Navigation';

  export default {
    name: 'app',

    components: {
      LaHeader,
      Navigation,
    },
  };
</script>
