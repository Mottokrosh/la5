<template>
  <header>
    <h1>
      <router-link to="/">LimitedAudience</router-link>
      <small>Fashionable Bondage</small>
    </h1>
  </header>
</template>

<style>
  @import "../assets/css/global.css";

  header {
    background-image: url(/static/ballgag.png);
    background-repeat: no-repeat;
    background-position: left center;
    background-size: contain;
    height: 80px;
    display: flex;
    align-items: center;
    padding-left: 70px;
    margin-bottom: 2rem;

    & h1 {
      margin: 0;
    }
  }
</style>