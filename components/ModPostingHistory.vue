<template>
  <span class="border border-info rounded p-1">
    <b-badge variant="light" class="clickme" @click="showHistory('Offer')">
      <v-icon name="gift" class="fa-fw" /> {{ offers }}
    </b-badge>
    <b-badge variant="light" class="clickme" @click="showHistory('Wanted')">
      <v-icon name="search" class="fa-fw" /> {{ wanteds }}
    </b-badge>
    <b-badge :variant="user.modmails > 0 ? 'danger' : 'light'">
      <v-icon name="exclamation-triangle" class="fa-fw" /> {{ user.modmails }}
    </b-badge>
    <b-btn variant="link" size="sm" class="clickme" @click="showHistory()">
      View posts
    </b-btn>
    <b-btn variant="link" size="sm">
      <!--      TODO Show modal-->
      View logs
    </b-btn>
    <ModPostingHistoryModal ref="history" :user="user" :type="type" />
  </span>
</template>
<script>
import waitForRef from '../mixins/waitForRef'
import ModPostingHistoryModal from './ModPostingHistoryModal'

export default {
  components: { ModPostingHistoryModal },
  mixins: [waitForRef],
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      type: null
    }
  },
  computed: {
    offers() {
      return this.countType('Offer')
    },
    wanteds() {
      return this.countType('Wanted')
    }
  },
  methods: {
    countType(type) {
      let count = 0

      this.user.messagehistory.forEach(entry => {
        if (entry.type === type) {
          count++
        }
      })

      return count
    },
    showHistory(type = null) {
      this.type = type
      this.waitForRef('history', () => {
        this.$refs.history.show()
      })
    }
  }
}
</script>
