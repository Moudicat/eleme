import Vue from 'vue';
import App from './App';
import Router from 'vue-router';
import VueResource from 'vue-resource';
import goods from './components/goods/goods';
import ratings from './components/ratings/ratings';
import seller from './components/seller/seller';
import './common/style/index.scss';

Vue.config.productionTip = false;

Vue.use(Router);
Vue.use(VueResource);

const routes = [
  {
    path: '/goods',
    component: goods
  },
  {
    path: '/ratings',
    component: ratings
  },
  {
    path: '/seller',
    component: seller
  }
];

const router = new Router({
  routes,
  linkActiveClass: 'active'
});

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

// 默认跳转到goods标签
router.push('goods');
