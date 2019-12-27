import Vue from 'vue'
import Icon from 'vue-awesome/components/Icon.vue'

// We don't list any icons in here, as that would increase the bundle size for the landing page.  They are imported
// in each component.

Vue.component('v-icon', Icon)
