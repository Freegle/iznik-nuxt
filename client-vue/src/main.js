import Vue from 'vue'
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import App from './App.vue';

import location from './store/modules/Location';
import person from './store/modules/Person';
import slot from './store/modules/Slot';

import LocationRoutes from './router/location';
import PersonRoutes from './router/person';
import SlotRoutes from './router/slot';

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(BootstrapVue);

const store = new Vuex.Store({
  modules: {
    location,
    person,
    slot
  }
});

const router = new VueRouter({
  mode: 'history',
  routes: [
    ...LocationRoutes,
    ...PersonRoutes,
    ...SlotRoutes
  ]
});

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});
