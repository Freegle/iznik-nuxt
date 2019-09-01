import Vue from 'vue'
import dayjs from 'dayjs'

// These are various formatting utilities which we use in templates.
Vue.filter('dateonly', val => dayjs(val).format('Do MMMM, YYYY'))
Vue.filter('timeago', val => dayjs(val).fromNow())
