import Vue from 'vue'
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import App from './App.vue';

import Location from './store/modules/Location';
import Person from './store/modules/Person';
import Slot from './store/modules/Slot';

import LocationRoutes from './router/location';
import PersonRoutes from './router/person';
import SlotRoutes from './router/slot';

Vue.use(Vuex);
Vue.use(VueRouter);

const store = new Vuex.Store({
  modules: {
    Location,
    Person,
    Slot
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
