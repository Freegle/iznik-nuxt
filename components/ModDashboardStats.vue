<template>
  <div>
    <ModDashboardImpact :groupid="groupid" :start="start" :end="end" class="mt-2" />
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

      this.loading = false
    }
  }
}
</script>
