import Vue from 'vue'
import dayjs from 'dayjs'

// These are various formatting utilities which we use in templates.
Vue.filter('dateonly', val => dayjs(val).format('Do MMMM, YYYY'))
Vue.filter('datetime', val => dayjs(val).format('Do MMMM, YYYY HH:MM:ss'))

// dayjs pluralises wrongly in some cases - we've seen 1 hours ago.
Vue.filter('timeago', val =>
  dayjs(val)
    .fromNow()
    .replace('/1 (.*)s/', '1 $1')
)
