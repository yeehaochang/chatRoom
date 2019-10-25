import Vue from 'vue';
import VueRouter from 'vue-router';
import login from './components/login.vue';
import room from './components/Room.vue';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '*',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: login,
    },
    {
      path: '/room',
      name: 'room',
      component: room,
    },
  ],
});
