<template>
  <div class="font-weight-bold">
    <div v-if="now" class="pulsate d-flex">
      <!-- eslint-disable-next-line-->
      <ExternalLink href="https://us02web.zoom.us/j/81013447754?pwd=cVYzeEl5dWx0MEd0TTdOWE9Yd0Z4QT09" class="text-white">ZoomStock happening now till 5pm! Join other volunteers for a natter - click here.</ExternalLink>
    </div>
    <div v-else-if="today" class="pulsate d-flex">
      <!-- eslint-disable-next-line-->
      <ExternalLink href="https://us02web.zoom.us/j/81013447754?pwd=cVYzeEl5dWx0MEd0TTdOWE9Yd0Z4QT09" class="text-white">ZoomStock Thursdays - join other volunteers for a natter.  Link will be here 2pm-5pm.</ExternalLink>
    </div>
    <div v-else class="d-flex">
      ZoomStock Thursdays @ 2pm-5pm, next {{ timeago(fromNow) }}. Join other volunteers for a natter.  Link will be here.
    </div>
  </div>
</template>
<script>
import ExternalLink from '@/components/ExternalLink'

const DAY_OF_WEEK = 4
const START = '1400'
const END = '1700'

export default {
  components: { ExternalLink },
  data: function() {
    return {
      nextOne: null
    }
  },
  computed: {
    timeNow() {
      return this.$store.getters['misc/time']
        ? this.$dayjs().format('HHmm')
        : ''
    },
    fromNow() {
      return this.$store.getters['misc/time'] && this.nextOne
        ? this.nextOne
        : null
    },
    today() {
      const d = this.$dayjs()
      return d.day() === DAY_OF_WEEK && this.timeNow < START
    },
    now() {
      console.log('Now?', this.timeNow, START, END)
      return (
        this.$dayjs().day() === DAY_OF_WEEK &&
        this.timeNow >= START &&
        this.timeNow <= END
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
