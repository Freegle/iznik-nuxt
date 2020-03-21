<template>
  <b-card v-if="covid" no-body class="p-0">
    <b-card-header class="clickme p-1" @click="expandit">
      <b-row>
        <b-col cols="9" sm="3" class="order-1 truncate">
          <span :title="email">{{ email }}</span>
          <v-icon v-if="covid.dispatched" name="check" title="Suggestions sent" />
          <v-icon v-if="covid.viewedown" name="eye" title="Suggestions viewed" />
        </b-col>
        <b-col cols="1" class="order-2">
          <v-icon v-if="covid.phone" name="mobile-alt" title="Phone number provided" class="ml-2 mr-2" />
          <v-icon v-if="covid.intro" name="book-open" title="Intro provided" class="ml-2 mr-2" />
          <v-icon v-if="info.other" name="comment" title="Comments to volunteers" class="ml-2 mr-2" />
        </b-col>
        <b-col cols="2" sm="1" class="order-3 order-sm-8">
          <span class="d-block d-sm-none float-right">
            <v-icon v-if="!expanded" name="caret-down" />
            <v-icon v-else name="caret-up" />
          </span>
          <b-btn variant="white" size="sm" class="d-none d-sm-block float-right">
            <v-icon v-if="!expanded" name="caret-down" />
            <v-icon v-else name="caret-up" />
          </b-btn>
        </b-col>
        <b-col cols="12" sm="3" class="order-4 truncate">
          <v-icon name="user" /> {{ covid.user.displayname }}
        </b-col>
        <b-col cols="5" sm="2" class="order-5">
          <v-icon name="hashtag" scale="0.75" class="text-muted" />{{ covid.userid }}
        </b-col>
        <b-col cols="7" sm="2" class="order-6 text-right">
          {{ covid.lastaccess | timeago }}
        </b-col>
      </b-row>
    </b-card-header>
    <b-card-body v-if="expanded && covid.user" class="p-1">
      <NoticeMessage v-if="covid.viewedown" variant="success">
        Suggestions sent to this person have been viewed.  There's probably no need to send more.
      </NoticeMessage>
      <NoticeMessage v-else-if="covid.dispatched" variant="info">
        Suggestions have been sent to this person.  You can select more and send them if you want.
      </NoticeMessage>
      <NoticeMessage variant="info" class="mb-2">
        <b-textarea v-model="covid.comments" placeholder="You can save comments about them here.  They are only visible to mods but are covered by GDPR.  Be nice.">
          {{ covid.comments }}
        </b-textarea>
        <b-btn variant="white" class="mt-1" @click="saveInfo">
          <v-icon name="save" /> Save
        </b-btn>
      </NoticeMessage>
      <ModSpammer v-if="covid.spammer" class="mb-2" :user="user" />
      <div class="d-flex flex-wrap">
        <b-btn variant="white" class="mr-2 mb-1" @click="logs">
          <v-icon name="book-open" /> Logs
        </b-btn>
        <b-btn variant="white" class="mr-2 mb-1" @click="profile">
          <v-icon name="user" /> Profile
        </b-btn>
        <Ratings v-if="expanded" :id="covid.id" class="mr-2" />
        <b-btn variant="info" class="mr-2 mb-1" @click="closed">
          <v-icon name="times" /> Close - No Action Required
        </b-btn>
      </div>
      <h3 class="mt-2">
        <span v-if="covid.type === 'NeedHelp'">
          What they need help with
        </span>
        <span v-else>
          How they can help
        </span>
      </h3>
      <ModCovidInfo :covid="covid" />
      <h3 class="mt-2">
        Location
      </h3>
      <b-row>
        <b-col cols="12" md="6">
          <div class="d-flex justify-content-between">
            <div>
              <v-icon class="text-muted" name="globe-europe" /> Public location on ChitChat
            </div>
            <div v-if="covid.user.publiclocation">
              {{ covid.user.publiclocation.display }}
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
              <v-icon class="text-muted" name="lock" /> Rough actual location
            </div>
            <div v-if="covid.user.privateposition && covid.user.privateposition.length">
              {{ covid.user.privateposition[0] }}, {{ covid.user.privateposition[1] }}
              <a :href="'https://www.google.com/maps/place/' + covid.user.privateposition[0] + ',' + covid.user.privateposition[1] + '/@' + covid.user.privateposition[0] + ',' + covid.user.privateposition[1] + ',14z'" target="_blank" rel="noopener">Show on map</a>
            </div>
            <div v-else class="text-danger">
              Not known - can't suggest anyone yet
            </div>
          </div>
        </b-col>
      </b-row>
      <div v-if="covid.type === 'NeedHelp'">
        <h3 class="mt2">
          Possible Helpers
        </h3>
        <p>
          Choose around 3 people if possible - ideally the closest plus a couple who are close with good
          thumbs up/down and kudos (calculated Freegle "reputation" based on their activity).  Click name to view
          profile.
        </p>
        <div v-if="sortedHelpers && sortedHelpers.length">
          <b-table-simple>
            <b-tbody>
              <b-tr>
                <b-th>
                  Name
                </b-th>
                <b-th>
                  Miles away
                </b-th>
                <b-th>
                  Info
                </b-th>
                <b-th>
                  Their Response
                </b-th>
                <b-th>
                  Ratings
                </b-th>
                <b-th>
                  Kudos
                </b-th>
                <b-th>
                  Select
                </b-th>
              </b-tr>
              <ModCovidHelper v-for="helper in sortedHelpers" :key="'helper-' + helper.id" :helpee="covid.user.id" :helper="helper" />
            </b-tbody>
          </b-table-simple>
          <b-btn class="mt-2" size="lg" variant="success" @click="dispatch">
            <v-icon v-if="dispatching" name="sync" class="fa-spin" />
            <v-icon v-else-if="dispatched" name="check" />
            <v-icon v-else name="envelope" />
            Send suggestions
          </b-btn>
          <b-btn class="mt-2 ml-2" size="lg" variant="white" @click="preview">
            Preview suggestions
          </b-btn>
        </div>
        <p v-else>
          No helpers found yet.
        </p>
      </div>
      <h3 class="mt-2">
        Chat as Mod
      </h3>
      <div v-if="memberships && memberships.length" class="mt-2">
        <div v-for="membership in memberships" :key="'membership-' + membership.id">
          <ChatButton
            :userid="covid.user.id"
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
    <ModLogsModal ref="logs" :userid="covid.user.id" />
    <CovidSuggestionsModal :id="covid.id" ref="preview" />
  </b-card>
</template>
<script>
import Vue from 'vue'
import { TablePlugin } from 'bootstrap-vue'
import waitForRef from '../mixins/waitForRef'
import ModSpammer from './ModSpammer'
import ModLogsModal from './ModLogsModal'
import ChatButton from './ChatButton'
import NoticeMessage from './NoticeMessage'
import Ratings from './Ratings'
import ModCovidHelper from './ModCovidHelper'
import ModCovidInfo from './ModCovidInfo'
import CovidSuggestionsModal from './CovidSuggestionsModal'

Vue.use(TablePlugin)

const SHOW = 3

export default {
  components: {
    CovidSuggestionsModal,
    ModCovidInfo,
    ModCovidHelper,
    Ratings,
    NoticeMessage,
    ChatButton,
    ModLogsModal,
    ModSpammer
  },
  mixins: [waitForRef],
  props: {
    covidid: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      expanded: false,
      showAllMemberships: false,
      showAllMessageHistories: false,
      dispatching: false,
      dispatched: false
    }
  },
  computed: {
    covid() {
      return this.$store.getters['covid/get'](this.covidid)
    },
    email() {
      // Depending on which context we're used it, we might or might not have an email returned.
      let ret = this.covid.user.email

      if (!this.covid.user.email && this.covid.user.emails) {
        this.covid.user.emails.forEach(e => {
          if (!e.ourdomain && (!ret || e.preferred)) {
            ret = e.email
          }
        })
      }

      return ret
    },
    freegleMemberships() {
      return this.covid.user && this.covid.user.memberof
        ? this.covid.user.memberof
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
      return this.covid.user.emails.filter(e => {
        return e.email !== this.covid.user.email && !e.ourdomain
      })
    },
    messageHistoriesShown() {
      return this.showAllMessageHistories
        ? this.covid.user.messagehistory
        : this.covid.user.messagehistory.slice(0, SHOW)
    },
    messageHistoriesUnshown() {
      const ret =
        this.covid.user.messagehistory.length > SHOW
          ? this.covid.user.messagehistory.length - SHOW
          : 0
      return ret
    },
    info() {
      if (this.covid && this.covid.info) {
        if (this.covid.info === '[]') {
          return {}
        } else {
          return JSON.parse(this.covid.info)
        }
      } else {
        return {}
      }
    },
    helpers() {
      return this.covid.helpers ? Object.values(this.covid.helpers) : []
    },
    sortedHelpers() {
      const ret = this.helpers

      if (ret) {
        let mindist = 1000

        ret.forEach(a => {
          mindist = Math.min(a.distance, mindist)
        })

        if (ret) {
          // Sort to put the closest at the top, then the ones with highest kudos.
          ret.sort((a, b) => {
            if (a.distance === mindist) {
              return -1
            } else if (b.distance === mindist) {
              return 1
            } else if (a.kudos && !b.kudos) {
              return -1
            } else if (!a.kudos && b.kudos) {
              return 1
            } else {
              return parseInt(b.kudos) - parseInt(a.kudos)
            }
          })
        }
      }

      return ret
    }
  },
  methods: {
    async fetchUser() {
      await this.$store.dispatch('user/fetch', {
        id: this.covid.userid,
        info: true
      })
    },
    async fetch() {
      await this.$store.dispatch('covid/fetch', {
        id: this.covid.id
      })
    },
    async profile() {
      await this.fetchUser()
      this.waitForRef('profile', () => {
        this.$refs.profile.show()
      })
    },
    logs() {
      this.waitForRef('logs', () => {
        this.$refs.logs.show()
      })
    },
    contacted() {
      this.$store.dispatch('covid/edit', {
        id: this.covid.id,
        contacted: new Date().toISOString()
      })
    },
    closed() {
      this.$store.dispatch('covid/edit', {
        id: this.covid.id,
        closed: new Date().toISOString()
      })
    },
    expandit() {
      this.expanded = !this.expanded

      if (this.covid.type === 'NeedHelp') {
        this.fetch()
      }
    },
    saveInfo() {
      this.$store.dispatch('covid/edit', {
        id: this.covid.id,
        comments: this.covid.comments
      })
    },
    async dispatch() {
      this.dispatching = true

      await this.$store.dispatch('covid/dispatch', {
        id: this.covid.id
      })

      this.dispatching = false
      this.dispatched = true

      setTimeout(() => {
        this.dispatched = false
      }, 5000)
    },
    preview() {
      this.waitForRef('preview', () => {
        this.$refs.preview.show()
      })
    }
  }
}
</script>
