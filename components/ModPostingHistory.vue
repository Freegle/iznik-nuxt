<template>
  <span class="border border-info rounded p-1">
    <b-badge variant="light" class="clickme" title="Recent OFFERs" @click="showHistory('Offer')">
      <v-icon name="gift" class="fa-fw" /> {{ offers }}
    </b-badge>
    <b-badge variant="light" class="clickme" title="Recent WANTEDs" @click="showHistory('Wanted')">
      <v-icon name="search" class="fa-fw" /> {{ wanteds }}
    </b-badge>
    <b-badge :variant="user.modmails > 0 ? 'danger' : 'light'" class="clickme" title="ModMails" @click="showModmails">
      <v-icon name="exclamation-triangle" class="fa-fw" /> {{ user.modmails }}
    </b-badge>
    <b-badge v-if="userinfo" :variant="userinfo.replies > 0 ? 'success' : 'light'" title="Recent replies to OFFERs">
      <v-icon name="gift" class="fa-fw" /><v-icon name="reply" class="fa-fw" /> {{ userinfo.repliesoffer }}
    </b-badge>
    <b-badge v-if="userinfo" :variant="userinfo.replies > 0 ? 'success' : 'light'" title="Recent replies to WANTEDs">
      <v-icon name="search" class="fa-fw" /><v-icon name="reply" class="fa-fw" /> {{ userinfo.replieswanted }}
    </b-badge>
    <b-badge v-if="userinfo" :variant="userinfo.expectedreplies > 0 ? 'danger' : 'light'" title="Recent outstanding replies requested">
      <v-icon name="clock" class="fa-fw" /> {{ userinfo.expectedreplies || 0 }}
    </b-badge>
    <b-btn variant="link" size="sm" class="clickme" @click="showHistory(null)">
      Posts
    </b-btn>
    <b-btn variant="link" size="sm" @click="showLogs">
      Logs
    </b-btn>
    <ModPostingHistoryModal ref="history" :user="user" :type="type" />
    <ModLogsModal ref="logs" :userid="user.id" :modmailsonly="modmailsonly" />
  </span>
</template>
<script>
import ModPostingHistoryModal from './ModPostingHistoryModal'
import ModLogsModal from './ModLogsModal'

export default {
  components: { ModLogsModal, ModPostingHistoryModal },

  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      type: null,
      modmailsonly: false
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
      if (this.user.info) {
        return this.user.info
      }

      const user = this.$store.getters['user/get'](this.user.id)

      if (user && user.info) {
        return user.info
      }

      return null
    }
  },
  mounted() {
    if (!this.user.info) {
      // Fetch with info so that we can display more.
      this.$store.dispatch('user/fetch', {
        id: this.user.id,
        info: true
      })
    }
  },
  methods: {
    countType(type) {
      let count = 0

      if (this.user && this.user.messagehistory) {
        this.user.messagehistory.forEach(entry => {
          if (entry.type === type) {
            count++
          }
        })
      }

      return count
    },
    showHistory(type = null) {
      this.type = type
      this.waitForRef('history', () => {
        this.$refs.history.show()
      })
    },
    showLogs() {
      this.modmailsonly = false

      this.waitForRef('logs', () => {
        this.$refs.logs.show()
      })
    },
    showModmails() {
      this.modmailsonly = true

      this.waitForRef('logs', () => {
        this.$refs.logs.show()
      })
    }
  }
}
</script>
