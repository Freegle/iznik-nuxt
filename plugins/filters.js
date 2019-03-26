import Vue from 'vue'
import moment from 'moment'
import sanitizeHtml from 'sanitize-html'

// These are various formatting utilities which we use in templates.
Vue.filter('dateonly', val => moment(val).format('Do MMMM, YYYY'))
Vue.filter('xss', val =>
  sanitizeHtml(val, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'p', 'a'])
  })
)
