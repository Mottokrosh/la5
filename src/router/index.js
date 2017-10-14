import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Links from '@/components/Links';
import Models from '@/components/Models';
import ModelDetails from '@/components/ModelDetails';
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
      path: '/home/page/:page',
      name: 'HomePaginated',
      component: Home,
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
      path: '/models',
      name: 'Models',
      component: Models,
    },
    {
      path: '/models/:slug',
      name: 'ModelDetails',
      component: ModelDetails,
    },
    {
      path: '/',
      redirect: { name: 'Home' },
    },
  ],
});
