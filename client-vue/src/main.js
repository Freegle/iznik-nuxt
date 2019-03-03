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

import { faCoffee, faChild, faCircle, faArchive, faEdit } from '@fortawesome/free-solid-svg-icons'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'

library.add(
  faCoffee,
  faChild,
  faCircle,
  faArchive,
  faEdit
)

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(BootstrapVue);

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)

Vue.config.productionTip = false

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
