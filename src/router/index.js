import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Links from '@/components/Links';
import Models from '@/components/Models';
import ModelDetails from '@/components/ModelDetails';
import BannerLinks from '@/components/BannerLinks';
import Warning from '@/components/Warning';

Vue.use(Router);

const router = new Router({
  mode: 'history',

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    return { x: 0, y: 0 };
  },

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

router.afterEach((to, from) => {
  setTimeout(() => {
    // eslint-disable-next-line no-useless-escape, prefer-template, max-len
    const warningDismissed = decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent('la5warning').replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;

    if (!warningDismissed) {
      window.showModal(Warning, {
        to,
        from,
        hideCloseButton: true,
      });
    }
  }, 0);
});

export default router;
