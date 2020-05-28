import Vue from 'vue'
import dayjs from 'dayjs'

// These are various formatting utilities which we use in templates.
Vue.filter('dateonly', val => dayjs(val).format('Do MMMM, YYYY'))
Vue.filter('datetime', val => dayjs(val).format('Do MMMM, YYYY HH:mm:ss'))
Vue.filter('datetimeshort', val => dayjs(val).format('Do MMM, YYYY HH:mm'))
Vue.filter('dateshort', val => dayjs(val).format('MMM DD, YYYY'))

// dayjs pluralises wrongly in some cases - we've seen 1 hours ago.
const dePlural = new RegExp(/1 (.*)s/)

Vue.filter('timeago', val => {
  let f = dayjs(val).fromNow()
  f = f.replace(dePlural, '1 $1')
  return f
})
