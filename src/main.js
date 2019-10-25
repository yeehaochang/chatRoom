import Vue from 'vue';
// import { rtdbPlugin } from 'vuefire';
// import { vuexfireMutations } from 'vuexfire';
import Vuex from 'vuex';
import router from './router';
import store from './store';
import App from './App.vue';

Vue.use(Vuex);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
