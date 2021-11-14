// Vue v3 doesn't support filters, so we have a global mixin which defines methods to achieve the same goal.
import Vue from 'vue'
import dayjs from 'dayjs'
import pluralize from 'pluralize'

Vue.mixin({
  methods: {
    timeago(val) {
      // dayjs pluralises wrongly in some cases - we've seen 1 hours ago.
      const dePlural = new RegExp(/^1 (.*)s/)

      let f = dayjs(val).fromNow()
      f = f.replace(dePlural, '1 $1')

      return f
    },
    timeadapt(val) {
      const t = dayjs(val)

      if (t.isToday()) {
        // For today, just show the time.
        return t.format('HH:mm')
      } else {
        return t.format('DD MMM YYYY HH:mm')
      }
    },
    dateonly(val) {
      return dayjs(val).format('Do MMMM, YYYY')
    },
    datetime(val) {
      return dayjs(val).format('Do MMMM, YYYY HH:mm:ss')
    },
    datetimeshort(val) {
      return dayjs(val).format('Do MMM, YYYY HH:mm')
    },
    dateshort(val) {
      return dayjs(val).format('MMM DD, YYYY')
    },
    pluralize(word, number, includeNumber) {
      return pluralize(word, number, includeNumber)
    }
  }
})
