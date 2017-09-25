<template>
  <nav class="main-navigation">
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/contact">Contact</router-link></li>
      <li><router-link to="/links">Links</router-link></li>
    </ul>
  </nav>
</template>

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
    }

    & ul {
      list-style: none;
      margin: 1rem auto;
      padding: 0;
      display: flex;
      justify-content: space-around;
      max-width: var(--maxWidth);
    }
  }
</style>
