<template>
  <div>
    <h4>
      <b-badge :variant="offers > 0 ? 'success' : 'light'" title="Recent OFFERs" @click="showHistory('Offer')">
        <v-icon name="gift" class="fa-fw" /> {{ offers | pluralize([ 'OFFER', 'OFFERs' ], { includeNumber: true }) }}
      </b-badge>
      <b-badge :variant="wanteds > 0 ? 'success' : 'light'" title="Recent WANTEDs" @click="showHistory('Wanted')">
        <v-icon name="search" class="fa-fw" /> {{ wanteds | pluralize([ 'WANTED', 'WANTEDs' ], { includeNumber: true }) }}
      </b-badge>
      <b-badge :variant="(member.modmails && member.modmails) > 0 ? 'danger' : 'light'" title="Recent ModMails" @click="showModmails">
        <v-icon name="exclamation-triangle" class="fa-fw" /> {{ (member.modmails ? member.modmails : 0) | pluralize([ 'Modmail', 'Modmails' ], { includeNumber: true }) }}
      </b-badge>
      <b-badge v-if="userinfo" :variant="userinfo.replies > 0 ? 'success' : 'light'" title="Recent replies to posts">
        <v-icon name="reply" class="fa-fw" /> {{ userinfo.replies | pluralize([ 'reply', 'replies' ], { includeNumber: true }) }}
      </b-badge>
      <b-badge v-if="userinfo" :variant="userinfo.expectedreplies > 0 ? 'danger' : 'light'" title="Recent outstanding replies requested">
        <v-icon name="clock" class="fa-fw" /> {{ (userinfo.expectedreplies || 0) | pluralize('RSVP', { includeNumber: true }) }}
      </b-badge>
    </h4>
    <ModPostingHistoryModal ref="history" :user="member" :type="type" />
    <ModLogsModal ref="logs" :userid="member.id" modmailsonly />
  </div>
</template>
<script>
import waitForRef from '../mixins/waitForRef'
import ModPostingHistoryModal from './ModPostingHistoryModal'
import ModLogsModal from './ModLogsModal'

export default {
  components: { ModLogsModal, ModPostingHistoryModal },
  mixins: [waitForRef],
  props: {
    member: {
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
    },
    userinfo() {
      const user = this.$store.getters['user/get'](this.member.userid)

      if (user && user.info) {
        return user.info
      }

      return null
    }
  },
  methods: {
    countType(type) {
      let count = 0

      this.member.messagehistory.forEach(entry => {
        if (entry.type === type && entry.daysago < 31 && !entry.deleted) {
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
    },
    showModmails() {
      console.log('Show mod mails')
      this.modmailsonly = true

      this.waitForRef('logs', () => {
        this.$refs.logs.show()
      })
    }
  }
}
</script>
