<template>
  <div>
    <b-modal
      :id="'alertModal-' + alert.id"
      v-model="showModal"
      size="lg"
      no-stacking
    >
      <template slot="modal-title" class="w-100">
        {{ alert.subject }}
      </template>
      <template slot="default">
        <div v-if="alert">
          <p v-if="!alert.complete">
            This hasn't finished sending yet.
          </p>
          <div v-else>
            <p>
              If we think a group or volunteer has been reached, then we're confident about it. If we think they haven't,
              then we could be wrong. But this gives a pretty good idea.
            </p>
            <h2>Group Stats</h2>
            <p>
              Sent to {{ alert.stats.responses.groups.length | pluralize('group', { includeNumber: true }) }}.
            </p>
            <GChart
              type="PieChart"
              :data="groupData"
              :options="chartOptions"
            />
            <h2>Volunteer Stats</h2>
            <p>
              Sent to {{ alert.stats.sent.mods | pluralize('volunteer', { includeNumber: true }) }}
              via {{ alert.stats.sent.modemails | pluralize(['email address', 'email addresses'], { includeNumber: true }) }}.
            </p>
            <GChart
              type="PieChart"
              :data="volunteerData"
              :options="chartOptions"
            />
          </div>
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="white" @click="cancel">
          Close
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import { GChart } from 'vue-google-charts'

export default {
  components: {
    GChart
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      showModal: false,
      chartOptions: {
        chartArea: { width: '80%', height: '80%' },
        slices: {
          0: { color: 'green' },
          1: { color: 'orange' }
        }
      }
    }
  },
  computed: {
    alert() {
      return this.$store.getters['alert/get'](this.id)
    },
    groupData() {
      if (this.alert) {
        let reached = 0
        let total = 0
        this.alert.stats.responses.groups.forEach(group => {
          total++
          group.summary.forEach(result => {
            if (result.rsp === 'Reached') {
              reached++
            }
          })
        })

        return [
          ['Result', 'Count'],
          ['Responded', reached],
          ['No Response', total - reached]
        ]
      } else {
        return null
      }
    },
    volunteerData() {
      if (this.alert) {
        return [
          ['Result', 'Count'],
          ['Responded', this.alert.stats.responses.mods.reached],
          ['No Response', this.alert.stats.responses.mods.none]
        ]
      } else {
        return null
      }
    }
  },
  methods: {
    async show() {
      await this.$store.dispatch('alert/fetch', {
        id: this.id
      })

      this.showModal = true
    },
    hide() {
      this.showModal = false
    }
  }
}
</script>
<style scoped>
label {
  font-weight: bold;
}
</style>
