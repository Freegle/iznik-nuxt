<template>
  <div class="font-weight-bold">
    <div v-if="now" class="text-danger d-flex">
      <!-- eslint-disable-next-line-->
      <ExternalLink href="https://zoom.us/j/95789187203?pwd=VE9Va1M5YWJWY0M1dC9sc014L0xjQT09" :class="colorClass">ZoomStock happening now till 5pm! Join other volunteers for a natter - click here.</ExternalLink>
    </div>
    <div v-else-if="today" class="text-danger d-flex">
      <!-- eslint-disable-next-line-->
      <ExternalLink href="https://zoom.us/j/95789187203?pwd=VE9Va1M5YWJWY0M1dC9sc014L0xjQT09" :class="colorClass">ZoomStock Thursdays - join other volunteers for a natter.  Link will be here 2pm-5pm.</ExternalLink>
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
  props: {
    colorClass: {
      type: String,
      required: false,
      default: 'text-white'
    }
  },
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
<style scoped lang="scss">
/deep/ a,
a:visited,
a:hover,
a:active {
  color: inherit;
}
</style>
