import Vue from 'vue'
import moment from 'moment'

// These are various formatting utilities which we use in templates.
Vue.filter('dateonly', val => moment(val).format('Do MMMM, YYYY'))
Vue.filter('timeago', val => moment(val).fromNow())
