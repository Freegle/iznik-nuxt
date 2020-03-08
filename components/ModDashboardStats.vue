<template>
  <div>
    <b-img v-if="loading" src="~/static/loader.gif" alt="Loading" />
    <div v-else>
      <ModDashboardImpact :groupid="groupid" :start="start" :end="end" class="mt-2" />
    </div>
  </div>
</template>
<script>
import ModDashboardImpact from './ModDashboardImpact'

export default {
  components: { ModDashboardImpact },
  props: {
    groupid: {
      type: Number,
      required: false,
      default: null
    },
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  data: function() {
    return {
      loading: true
    }
  },
  watch: {
    start() {
      this.$nextTick(() => {
        this.fetchStats()
      })
    },
    end() {
      this.$nextTick(() => {
        this.fetchStats()
      })
    },
    groupid() {
      this.$nextTick(() => {
        this.fetchStats()
      })
    }
  },
  mounted() {
    this.fetchStats()
  },
  methods: {
    async fetchStats() {
      this.loading = true

      console.log(
        'Load stats for ',
        this.start.toString(),
        this.end.toString(),
        this.groupid
      )

      await this.$store.dispatch('stats/clear')

      if (this.start) {
        await this.$store.dispatch('stats/fetch', {
          group: this.groupid,
          grouptype: 'Freegle',
          systemwide: this.groupid === null,
          start: this.start.toISOString(),
          end: this.end.toISOString(),
          force: true,
          wibble: true
        })
      }

      console.log('Got stats')

      this.loading = false
    }
  }
}
</script>
