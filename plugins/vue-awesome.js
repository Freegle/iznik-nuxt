import Vue from 'vue'
import Icon from 'vue-awesome/components/Icon.vue'

// We list the icons we use explicitly because this reduces our bundle size.  But the ones we list here are only the
// ones which we use in lots of places.  Rarely used ones we import in the relevant component.  This reduces our
// bundle size for the landing page very significantly.
require('vue-awesome/icons/angle-double-right')
require('vue-awesome/icons/calendar-alt')
require('vue-awesome/icons/camera')
require('vue-awesome/icons/cog')
require('vue-awesome/icons/comments')
require('vue-awesome/icons/envelope')
require('vue-awesome/icons/exclamation-triangle')
require('vue-awesome/icons/gift')
require('vue-awesome/icons/globe-europe')
require('vue-awesome/icons/hand-holding-heart')
require('vue-awesome/icons/lock')
require('vue-awesome/icons/map-marker-alt')
require('vue-awesome/icons/pen')
require('vue-awesome/icons/plus')
require('vue-awesome/icons/question-circle')
require('vue-awesome/icons/reply')
require('vue-awesome/icons/save')
require('vue-awesome/icons/search')
require('vue-awesome/icons/sync')
require('vue-awesome/icons/trash-alt')
require('vue-awesome/icons/user')

Vue.component('v-icon', Icon)
