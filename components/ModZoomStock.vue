<template>
  <div class="font-weight-bold">
    <div v-if="today" class="pulsate d-flex">
      <!-- eslint-disable-next-line-->
      <ExternalLink href="https://zoom.us/j/97817491680?pwd=VVh2eW1LL2JhbnB5MllQbHoyRUJ6UT09" class="text-white">ZoomStock Thursdays - join other volunteers for a natter.  Click here at 2pm.</ExternalLink>
    </div>
    <div v-else-if="now" class="pulsate d-flex">
      <!-- eslint-disable-next-line-->
      <ExternalLink href="https://zoom.us/j/97817491680?pwd=VVh2eW1LL2JhbnB5MllQbHoyRUJ6UT09" class="text-white">ZoomStock happening now! Join other volunteers for a natter - click here.</ExternalLink>
    </div>
    <div v-else class="d-flex">
      ZoomStock Thursdays @ 2pm, next {{ fromNow }}. Join other volunteers for a natter.  Link will be here.
    </div>
  </div>
</template>
<script>
import ExternalLink from '@/components/ExternalLink'

const DAY_OF_WEEK = 4
const HOUR_OF_DAY = 10
const MINUTE_START = 0
const MINUTE_END = 40

export default {
  components: { ExternalLink },
  data: function() {
    return {
      nextOne: null
    }
  },
  computed: {
    fromNow() {
      return this.nextOne ? this.nextOne.fromNow() : null
    },
    today() {
      const d = this.$dayjs()
      return d.day() === DAY_OF_WEEK && d.hour() < HOUR_OF_DAY
    },
    now() {
      const d = this.$dayjs()
      return (
        d.day() === DAY_OF_WEEK &&
        d.hour() === HOUR_OF_DAY &&
        d.minute() >= MINUTE_START &&
        d.minute() <= MINUTE_END
      )
    }
  },
  mounted() {
    let d = this.$dayjs()

    if (d.day() < DAY_OF_WEEK) {
      d = d.day(DAY_OF_WEEK)
    } else {
      d = d.add(1, 'week').day(DAY_OF_WEEK)
    }

    this.nextOne = d
  }
}
</script>
