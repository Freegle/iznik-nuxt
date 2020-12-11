<template>
  <!--  <div>-->
  <!--    Alert {{ JSON.stringify(alert) }}-->
  <!--  </div>-->
  <b-row>
    <b-col cols="6" lg="2">
      {{ alert.created | datetimeshort }}
    </b-col>
    <b-col cols="6" lg="2">
      {{ alert.complete | datetimeshort }}
    </b-col>
    <b-col cols="6" lg="2">
      <div v-if="alert.group">
        {{ alert.group.nameshort }}
      </div>
    </b-col>
    <b-col cols="6" lg="4">
      {{ alert.subject }}
    </b-col>
    <b-col cols="6" lg="2">
      <b-btn variant="white" class="mr-1" @click="stats">
        Show Stats
      </b-btn>
      <b-btn variant="white" @click="details">
        Show Details
      </b-btn>
    </b-col>
    <ModAlertHistoryDetailsModal v-if="showDetails" :id="alert.id" ref="detailsModal" />
    <ModAlertHistoryStatsModal v-if="showStats" :id="alert.id" ref="statsModal" />
  </b-row>
</template>
<script>
import waitForRef from '@/mixins/waitForRef'
import ModAlertHistoryDetailsModal from './ModAlertHistoryDetailsModal'
import ModAlertHistoryStatsModal from './ModAlertHistoryStatsModal'

export default {
  components: { ModAlertHistoryStatsModal, ModAlertHistoryDetailsModal },
  mixins: [waitForRef],
  props: {
    alert: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      showDetails: false,
      showStats: false
    }
  },
  methods: {
    details() {
      this.showDetails = true

      this.waitForRef('detailsModal', () => {
        this.$refs.detailsModal.show()
      })
    },
    stats() {
      this.showStats = true

      this.waitForRef('statsModal', () => {
        this.$refs.statsModal.show()
      })
    }
  }
}
</script>
