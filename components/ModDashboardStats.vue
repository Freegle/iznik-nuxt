<template>
  <ModDashboardSkeleton v-if="loading" />
  <div v-else class="mb-4">
    <ModDashboardImpact :groupid="groupid" :start="start" :end="end" class="mt-2" />
    <ActivityGraph :groupid="groupid" :start="start" :end="end" />
  </div>
</template>
<script>
import ModDashboardImpact from './ModDashboardImpact'
import ActivityGraph from './ActivityGraph'
import ModDashboardSkeleton from '@/components/ModDashboardSkeleton'

export default {
  components: { ActivityGraph, ModDashboardImpact, ModDashboardSkeleton },
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
      this.maybeFetch()
    },
    end() {
      this.maybeFetch()
    },
    groupid() {
      this.maybeFetch()
    }
  },
  mounted() {
    this.fetchStats()
  },
  methods: {
    async fetchStats() {
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
    },
    maybeFetch() {
      if (!this.loading) {
        this.loading = true

        this.$nextTick(() => {
          this.fetchStats()
        })
      }
    }
  }
}
</script>
