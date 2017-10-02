import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Search from '@/components/Search';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Links from '@/components/Links';
import BannerLinks from '@/components/BannerLinks';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home,
    },
    {
      path: '/page/:page',
      name: 'HomePaginated',
      component: Home,
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
    },
    {
      path: '/about',
      name: 'About',
      component: About,
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact,
    },
    {
      path: '/links',
      name: 'Links',
      component: Links,
    },
    {
      path: '/banner-links',
      name: 'BannerLinks',
      component: BannerLinks,
    },
    {
      path: '/',
      redirect: { name: 'Home' },
    },
  ],
});
