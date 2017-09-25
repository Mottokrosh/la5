import Vue from 'vue';
import InstantSearch from 'vue-instantsearch';
import App from './App';
import router from './router';

Vue.use(InstantSearch);

Vue.config.productionTip = false;

/* eslint-disable no-new, prefer-template */
Vue.filter('filesize', (val) => {
  const mb = val / 1024 / 1024;
  return Math.round(mb) + 'MB';
});

new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
