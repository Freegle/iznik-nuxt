<template>
  <div class="font-weight-bold">
    <div v-if="happening" class="pulsate d-flex">
      <!-- eslint-disable-next-line-->
      <ExternalLink href="https://us02web.zoom.us/j/81013447754?pwd=cVYzeEl5dWx0MEd0TTdOWE9Yd0Z4QT09" class="text-white">ZoomStock happening now! Join other volunteers for a natter - click here.</ExternalLink>
    </div>
    <div v-else-if="today" class="pulsate d-flex">
      <!-- eslint-disable-next-line-->
      <ExternalLink href="https://us02web.zoom.us/j/81013447754?pwd=cVYzeEl5dWx0MEd0TTdOWE9Yd0Z4QT09" class="text-white">ZoomStock today - join other volunteers for a natter.  Click here at 2pm.</ExternalLink>
    </div>
    <div v-else class="d-flex">
      ZoomStock Tuesdays and Thursdays 1-5pm. Join other volunteers for a natter.  Link will be here.
    </div>
  </div>
</template>
<script>
import ExternalLink from '@/components/ExternalLink'

const DAY_OF_WEEK = [2, 4]
const HOUR_OF_DAY = 13
const DURATION = 240

export default {
  components: { ExternalLink },
  data: function() {
    return {
      nextOne: null
    }
  },
  computed: {
    now() {
      if (this.$store.getters['misc/time']) {
        return this.$dayjs()
      }

      return this.$dayjs
    },
    today() {
      const d = this.now
      return (
        this.$store.getters['misc/time'] &&
        DAY_OF_WEEK.indexOf(d.day()) !== -1 &&
        d.hour() < HOUR_OF_DAY
      )
    },
    happening() {
      const d = this.now

      if (DAY_OF_WEEK.indexOf(d.day()) === -1) {
        // Not today.
        return false
      }

      if (d.hour() < HOUR_OF_DAY) {
        // Not started
        return false
      }

      const end = this.now.hour(HOUR_OF_DAY).add(DURATION, 'minute')

      if (this.now.isBefore(end)) {
        return true
      }

      return false
    }
  }
}
</script>
