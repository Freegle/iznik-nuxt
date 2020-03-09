<template>
  <div v-if="member">
    <b-card bg-variant="white" no-body>
      <b-card-header class="d-flex justify-content-between flex-wrap">
        <div>
          <v-icon name="envelope" /> {{ email }}
        </div>
        <div>
          <ProfileImage :image="member.profile.turl" class="ml-1 mb-1 inline" is-thumbnail size="sm" />
          {{ member.displayname }}
        </div>
        <div>
          <v-icon name="calendar-alt" /> {{ member.joined | datetimeshort }}
        </div>
        <div>
          <v-icon name="hashtag" />{{ member.userid }}
        </div>
      </b-card-header>
      <b-card-body>
        <ModComments :user="member" />
        <ModSpammer v-if="member.spammer" :user="member" />
        <NoticeMessage v-if="member.activedistance > 50" variant="warning" class="mb-2">
          This freegler is active on groups {{ member.activedistance }} miles apart.
        </NoticeMessage>
        <div class="d-flex justify-content-between flex-wrap">
          <!--          TODO Bind to event and handle changes-->
          <SettingsGroup
            v-if="groupid"
            :groupid="groupid"
            :emailfrequency="member.emailfrequency"
            :volunteeringallowed="Boolean(member.volunteeringallowed)"
            :eventsallowed="Boolean(member.eventsallowed)"
            class="border border-info p-1 flex-grow-1 mr-1"
          />
          <div>
            <h4>
              <b-badge :variant="offers > 0 ? 'success' : 'light'" title="Recent OFFERs" @click="showHistory('Offer')">
                <v-icon name="gift" class="fa-fw" /> {{ offers | pluralize([ 'OFFER', 'OFFERs' ], { includeNumber: true }) }}
              </b-badge>
              <b-badge :variant="wanteds > 0 ? 'success' : 'light'" title="Recent WANTEDs" @click="showHistory('Wanted')">
                <v-icon name="search" class="fa-fw" /> {{ wanteds | pluralize([ 'WANTED', 'WANTEDs' ], { includeNumber: true }) }}
              </b-badge>
              <b-badge :variant="member.modmails > 0 ? 'danger' : 'light'" title="Recent ModMails">
                <v-icon name="exclamation-triangle" class="fa-fw" /> {{ member.modmails | pluralize([ 'Modmail', 'Modmails' ], { includeNumber: true }) }}
              </b-badge>
              <b-badge v-if="userinfo" :variant="userinfo.replies > 0 ? 'success' : 'light'" title="Recent replies to posts">
                <v-icon name="reply" class="fa-fw" /> {{ userinfo.replies | pluralize([ 'reply', 'replies' ], { includeNumber: true }) }}
              </b-badge>
              <b-badge v-if="userinfo" :variant="userinfo.expectedreplies > 0 ? 'danger' : 'light'" title="Recent outstanding replies requested">
                <v-icon name="clock" class="fa-fw" /> {{ (userinfo.expectedreplies || 0) | pluralize('RSVP', { includeNumber: true }) }}
              </b-badge>
            </h4>
            <div v-if="member.lastaccess" :class="'mb-1 ' + (inactive ? 'text-danger': '')">
              Last active: {{ member.lastaccess | timeago }}
              <span v-if="inactive">
                - won't send mails
              </span>
            </div>
            <ModMemberActions :userid="member.userid" :groupid="groupid" />
            <div v-if="memberof && memberof.length" class="mt-2">
              <div class="small">
                <v-icon name="users" />
                <span v-for="m in memberof" :key="'membership-' + m.membershipid" class="border border-info rounded p-1 mr-1">
                  {{ m.namedisplay.length > 23 ? (m.namedisplay.substring(0, 20) + '...') : m.namedisplay }} <span class="text-muted small">{{ m.added | timeago }}</span>
                </span>
              </div>
              <b-badge v-if="hiddenmemberofs" variant="info" class="clickme" @click="allmemberships = !allmemberships">
                +{{ hiddenmemberofs }} groups
              </b-badge>
            </div>
            <div v-if="member.logins && member.logins.length" class="mt-2">
              <v-icon name="lock" />
              <b-badge v-for="l in member.logins" :key="'login-' + l.id" variant="info" class="border border-info rounded p-1 mr-1">
                {{ loginType(l.type) }} login {{ l.lastaccess | timeago }}
              </b-badge>
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
            <b-btn variant="link" @click="showHistory">
              View osts
            </b-btn>
            <b-btn variant="link">
              <!--      TODO Show modal-->
              View logs
            </b-btn>
            <!-- TODO             Applied list-->
            <div v-if="showEmails">
              <div v-for="e in member.emails" :key="e.id">
                {{ e.email }} <v-icon v-if="e.preferred" name="start" />
              </div>
            </div>
          </div>
        </div>
      </b-card-body>
      <b-card-footer>
        <ModMemberButtons :member="member" :modconfig="modconfig" />
      </b-card-footer>
    </b-card>
    <ModPostingHistoryModal ref="history" :user="member" :type="type" />
  </div>
</template>
<script>
// TODO View Profile modal
import waitForRef from '../mixins/waitForRef'
import SettingsGroup from './SettingsGroup'
import NoticeMessage from './NoticeMessage'
import ProfileImage from './ProfileImage'
import ModPostingHistoryModal from './ModPostingHistoryModal'
import ModMemberActions from './ModMemberActions'
import ModSpammer from './ModSpammer'
import ModComments from './ModComments'
import ModMemberButtons from './ModMemberButtons'

const MEMBERSHIPS_SHOW = 3

export default {
  name: 'ModMember',
  components: {
    ModMemberButtons,
    ModComments,
    ModSpammer,
    ModMemberActions,
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
      type: null,
      allmemberships: false
    }
  },
  computed: {
    email() {
      // Depending on which context we're used it, we might or might not have an email returned.
      let ret = this.member.email

      if (!this.member.email && this.member.emails) {
        this.member.emails.forEach(e => {
          if (!e.ourdomain && (!ret || e.preferred)) {
            ret = e.email
          }
        })
      }

      return ret
    },
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
    },
    memberof() {
      if (!this.member || !this.member.memberof) {
        return null
      }

      const ms = this.member.memberof

      ms.sort(function(a, b) {
        return new Date(b.added).getTime() - new Date(a.added).getTime()
      })

      if (this.allmemberships) {
        return ms
      } else {
        return ms.slice(0, MEMBERSHIPS_SHOW)
      }
    },
    hiddenmemberofs() {
      return this.allmemberships
        ? 0
        : this.member && this.member.memberof.length > MEMBERSHIPS_SHOW
          ? this.member.memberof.length - MEMBERSHIPS_SHOW
          : 0
    },
    inactive() {
      // This code matches server code in sendOurMails.
      return (
        this.member &&
        this.member.lastaccess &&
        this.$dayjs().diff(this.$dayjs(this.member.lastaccess), 'days') >=
          (365 * 24 * 60 * 60) / 2
      )
    },
    userinfo() {
      const user = this.$store.getters['user/get'](this.member.userid)

      if (user && user.info) {
        return user.info
      }

      return null
    }
  },
  mounted() {
    if (!this.member.info) {
      // Fetch with info so that we can display more.
      this.$store.dispatch('user/fetch', {
        id: this.member.userid,
        info: true
      })
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
    },
    loginType(type) {
      let ret = type

      switch (type) {
        case 'Native': {
          ret = 'Email/Password'
          break
        }
        case 'Facebook': {
          ret = 'Facebook'
          break
        }
        case 'Yahoo': {
          ret = 'Yahoo'
          break
        }
        case 'Google': {
          ret = 'Google'
          break
        }
      }

      return ret
    }
  }
}
</script>
