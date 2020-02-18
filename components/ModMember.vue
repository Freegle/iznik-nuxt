<template>
  <div>
    <b-card bg-variant="white" no-body>
      <b-card-header class="d-flex justify-content-between flex-wrap">
        <div>
          <v-icon name="envelope" /> {{ member.email }}
        </div>
        <div>
          <profile-image :image="member.profile.turl" class="ml-1 mb-1 inline" is-thumbnail size="sm" />
          {{ member.displayname }}
        </div>
        <div>
          <v-icon name="calendar-alt" /> {{ member.joined | datetimeshort }}
        </div>
        <div>
          <v-icon name="hashtag" />{{ member.id }}
        </div>
      </b-card-header>
      <b-card-body>
        <NoticeMessage v-if="member.activedistance > 50" variant="warning" class="mb-2">
          This freegler is active on groups {{ member.activedistance }} miles apart.
        </NoticeMessage>
        <div class="d-flex justify-content-between flex-wrap">
          <!--          TODO Bind to event and handle changes-->
          <SettingsGroup
            :groupid="groupid"
            :emailfrequency="member.emailfrequency"
            :volunteeringallowed="Boolean(member.volunteeringallowed)"
            :eventsallowed="Boolean(member.eventsallowed)"
            class="border border-info p-1 flex-grow-1 mr-1"
          />
          <div>
            <h4>
              <b-badge :variant="offers > 0 ? 'success' : 'light'" @click="showHistory('Offer')">
                <v-icon name="gift" class="fa-fw" /> {{ offers | pluralize([ 'OFFER', 'OFFERs' ], { includeNumber: true }) }}
              </b-badge>
              <b-badge :variant="wanteds > 0 ? 'success' : 'light'" @click="showHistory('Wanted')">
                <v-icon name="search" class="fa-fw" /> {{ wanteds | pluralize([ 'WANTED', 'WANTEDs' ], { includeNumber: true }) }}
              </b-badge>
              <b-badge :variant="member.modmails > 0 ? 'danger' : 'light'">
                <v-icon name="exclamation-triangle" class="fa-fw" /> {{ member.modmails | pluralize([ 'Modmail', 'Modmails' ], { includeNumber: true }) }}
              </b-badge>
            </h4>
            <div>
              <!--              TODO Actions-->
              <b-btn variant="white" disabled>
                <v-icon name="times" /> Remove
              </b-btn>
              <b-btn variant="white" disabled>
                <v-icon name="trash-alt" /> Ban
              </b-btn>
              <b-btn variant="white" disabled>
                <v-icon name="ban" /> Scammer
              </b-btn>
              <b-btn variant="white" disabled>
                <v-icon name="check" /> Whitelist
              </b-btn>
              <b-btn variant="white" disabled>
                <v-icon name="tag" /> Add note
              </b-btn>
              <b-btn variant="white" disabled>
                <v-icon name="trash-alt" /> Purge
              </b-btn>
            </div>
            <b-btn v-if="member.emails && member.emails.length" variant="link" @click="showEmails = !showEmails">
              <v-icon name="envelope" />
              <span v-if="showEmails">
                <span class="d-inline d-sm-none">
                  Hide
                </span>
                <span class="d-none d-sm-inline">
                  Show {{ member.emails.length | pluralize('email', { includeNumber: true }) }}
                </span>
              </span>
              <span v-else>
                <span class="d-inline d-sm-none">
                  <v-icon name="envelope" /> {{ member.emails.length }}
                </span>
                <span class="d-none d-sm-inline">
                  Show {{ member.emails.length | pluralize('email', { includeNumber: true }) }}
                </span>
              </span>
            </b-btn>
            <b-btn variant="link" @click="showHistory()">
              View posts
            </b-btn>
            <b-btn variant="link">
              <!--      TODO Show modal-->
              View logs
            </b-btn>
            <!-- TODO             Group list-->
            <!-- TODO             Applied list-->

            <div v-if="showEmails">
              <div v-for="email in member.emails" :key="email.id">
                {{ email.email }} <v-icon v-if="email.preferred" name="start" />
              </div>
            </div>
          </div>
        </div>
      </b-card-body>
      <b-card-footer>
        <!--        <ModMessageButtons :message="message" :modconfig="modconfig" />-->
      </b-card-footer>
    </b-card>
    <ModPostingHistoryModal ref="history" :user="member" :type="type" />
  </div>
</template>
<script>
// TODO Validation
// - item length
import waitForRef from '../mixins/waitForRef'
import SettingsGroup from './SettingsGroup'
import NoticeMessage from './NoticeMessage'
import ProfileImage from './ProfileImage'
import ModPostingHistoryModal from './ModPostingHistoryModal'

export default {
  name: 'ModMember',
  components: {
    ModPostingHistoryModal,
    ProfileImage,
    // ModMessageButtons,
    NoticeMessage,
    SettingsGroup
  },
  mixins: [waitForRef],
  props: {
    member: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      saving: false,
      saved: false,
      showEmails: false,
      type: null
    }
  },
  computed: {
    pending() {
      return this.member.collection === 'Pending'
    },
    groupid() {
      return this.member.groupid
    },
    offers() {
      return this.countType('Offer')
    },
    wanteds() {
      return this.countType('Wanted')
    },
    modconfig() {
      const groups = this.$store.getters['auth/groups']
      let ret = null
      let configid = null

      if (groups) {
        groups.forEach(group => {
          if (group.id === this.groupid) {
            configid = group.configid
          }
        })

        const configs = this.$store.getters['modconfigs/configs']
        ret = configs.find(config => config.id === configid)
      }

      return ret
    }
  },
  methods: {
    countType(type) {
      let count = 0

      this.member.messagehistory.forEach(entry => {
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
