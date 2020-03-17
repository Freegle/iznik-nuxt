<template>
  <b-card v-if="user" no-body class="p-0">
    <b-card-header class="clickme p-1" @click="expanded = !expanded">
      <b-row>
        <b-col cols="10" sm="4" class="order-1 truncate" :title="email">
          <v-icon name="envelope" />&nbsp;{{ email }}
        </b-col>
        <b-col cols="2" sm="1" class="order-2 order-sm-7">
          <span class="d-block d-sm-none float-right">
            <v-icon v-if="!expanded" name="caret-down" />
            <v-icon v-else name="caret-up" />
          </span>
          <b-btn variant="white" size="sm" class="d-none d-sm-block float-right">
            <v-icon v-if="!expanded" name="caret-down" />
            <v-icon v-else name="caret-up" />
          </b-btn>
        </b-col>
        <b-col cols="12" sm="3" class="order-3 truncate">
          <v-icon name="user" /> {{ user.displayname }}
        </b-col>
        <b-col cols="5" sm="2" class="order-4">
          <v-icon name="hashtag" scale="0.75" class="text-muted" />{{ user.id }}
        </b-col>
        <b-col cols="7" sm="2" class="order-5 text-right">
          {{ user.lastaccess | timeago }}
        </b-col>
      </b-row>
    </b-card-header>
    <b-card-body v-if="expanded" class="p-1">
      <NoticeMessage v-if="user.covid.comments" variant="info" class="mb-2">
        {{ user.covid.comments }}
      </NoticeMessage>
      <p v-if="user.covid.contacted">
        Contacted {{ user.covid.contacted | timeago }}
      </p>
      <p v-else>
        Not contacted yet.
      </p>
      <ModSpammer v-if="user.spammer" class="mb-2" :user="user" />
      <div class="d-flex flex-wrap">
        <b-btn variant="white" class="mr-2 mb-1" @click="logs">
          <v-icon name="book-open" /> Logs
        </b-btn>
        <b-btn variant="white" class="mr-2 mb-1" @click="profile">
          <v-icon name="user" /> Profile
        </b-btn>
      </div>
      <h3 class="mt-2">
        Location
      </h3>
      <b-row>
        <b-col cols="12" md="6">
          <div class="d-flex justify-content-between">
            <div>
              <v-icon class="text-muted" name="globe-europe" /> Location on ChitChat
            </div>
            <div v-if="user.publiclocation">
              {{ user.publiclocation.display }}
            </div>
            <div v-else>
              Unknown
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12" md="6">
          <div class="d-flex justify-content-between">
            <div>
              <v-icon class="text-muted" name="lock" /> Best guess lat/lng
            </div>
            <div v-if="user.privateposition">
              {{ Math.round(user.privateposition.lat * 100) / 100 }}, {{ Math.round(user.privateposition.lng * 100) / 100 }}
              <a :href="'https://www.google.com/maps?q=' + user.privateposition.lat + ',' + user.privateposition.lng" target="_blank" rel="noopener">Show on map</a>
            </div>
            <div v-else>
              Not known
            </div>
          </div>
        </b-col>
      </b-row>
      <div v-if="memberships && memberships.length" class="mt-2">
        <div v-for="membership in memberships" :key="'membership-' + membership.id">
          <ChatButton
            :userid="user.id"
            :groupid="membership.id"
            :title="'Chat from ' + membership.nameshort + ' Mods'"
            variant="white"
            class="mr-2 mb-1"
          />
        </div>
        <b-btn v-if="!showAllMemberships && membershipsUnshown" variant="white" class="mt-1" @click="showAllMemberships = true">
          Show +{{ membershipsUnshown }}
        </b-btn>
      </div>
      <p v-else>
        No memberships.
      </p>
      <h3 class="mt-2">
        Other Known Emails
      </h3>
      <div v-if="otherEmails && otherEmails.length">
        <div v-for="otheremail in otherEmails" :key="'otheremail-' + otheremail.id">
          {{ otheremail.email }}
          <span class="text-muted" :title="otheremail.toLocaleString()">
            added {{ otheremail.added | timeago }}
          </span>
        </div>
      </div>
      <p v-else>
        No other emails.
      </p>
      <h3 class="mt-2">
        Posting History
      </h3>
      <div v-if="messageHistoriesShown.length">
        <b-row v-for="message in messageHistoriesShown" :key="'messagehistory-' + message.arrival + '-' + message.id" class="pl-3">
          <b-col cols="4" md="2" class="order-1 p-1 small">
            {{ message.arrival | datetimeshort }}
          </b-col>
          <b-col cols="4" md="2" class="order-3 order-md-2 p-1 small">
            <a target="_blank" :href="'https://www.ilovefreegle.org/message/' + message.id" rel="noopener noreferrer">
              <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ message.id }}
            </a>
          </b-col>
          <b-col cols="8" md="6" class="order-2 order-md-3 p-1">
            {{ message.subject }}
          </b-col>
          <b-col cols="6" md="2" class="small order-4 p-1">
            {{ message.fromaddr }}
          </b-col>
        </b-row>
        <b-btn v-if="!showAllMessageHistories && messageHistoriesUnshown" variant="white" class="mt-1" @click="showAllMessageHistories = true">
          Show +{{ messageHistoriesUnshown }}
        </b-btn>
      </div>
      <p v-else>
        No posting history.
      </p>
    </b-card-body>
    <ModLogsModal ref="logs" :userid="user.id" />
  </b-card>
</template>
<script>
import waitForRef from '../mixins/waitForRef'
import ModSpammer from './ModSpammer'
import ModLogsModal from './ModLogsModal'
import ChatButton from './ChatButton'
import NoticeMessage from './NoticeMessage'

const SHOW = 3

export default {
  components: {
    NoticeMessage,
    ChatButton,
    ModLogsModal,
    ModSpammer
  },
  mixins: [waitForRef],
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      expanded: false,
      showAllMemberships: false,
      showAllMessageHistories: false
    }
  },
  computed: {
    email() {
      // Depending on which context we're used it, we might or might not have an email returned.
      let ret = this.user.email

      if (!this.user.email && this.user.emails) {
        this.user.emails.forEach(e => {
          if (!e.ourdomain && (!ret || e.preferred)) {
            ret = e.email
          }
        })
      }

      return ret
    },
    freegleMemberships() {
      return this.user && this.user.memberof
        ? this.user.memberof
            .filter(m => m.type === 'Freegle')
            .sort(function(a, b) {
              return a.nameshort
                .toLowerCase()
                .localeCompare(b.nameshort.toLowerCase())
            })
        : []
    },
    memberships() {
      return this.showAllMemberships
        ? this.freegleMemberships
        : this.freegleMemberships.slice(0, SHOW)
    },
    membershipsUnshown() {
      const ret =
        this.freegleMemberships.length > SHOW
          ? this.freegleMemberships.length - SHOW
          : 0
      return ret
    },
    otherEmails() {
      return this.user.emails.filter(e => {
        return e.email !== this.user.email && !e.ourdomain
      })
    },
    messageHistoriesShown() {
      return this.showAllMessageHistories
        ? this.user.messagehistory
        : this.user.messagehistory.slice(0, SHOW)
    },
    messageHistoriesUnshown() {
      const ret =
        this.user.messagehistory.length > SHOW
          ? this.user.messagehistory.length - SHOW
          : 0
      return ret
    }
  },
  methods: {
    async profile() {
      await this.$store.dispatch('user/fetch', {
        id: this.id,
        info: true
      })

      this.$refs.profile.show()
    },
    logs() {
      this.$refs.logs.show()
    }
  }
}
</script>
