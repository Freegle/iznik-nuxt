<template>
  <div v-if="member">
    <b-card bg-variant="white" no-body>
      <b-card-header class="d-flex justify-content-between flex-wrap">
        <div>
          <!-- eslint-disable-next-line -->
          <v-icon name="envelope" /> <ExternalLink :href="'mailto:' + email">{{ email }}</ExternalLink>
        </div>
        <div>
          <ProfileImage :image="member.profile.turl" class="ml-1 mb-1 inline" is-thumbnail size="sm" />
          {{ member.displayname }}
          <Supporter v-if="member.supporter" class="d-inline" />
        </div>
        <div v-if="member.joined">
          <v-icon name="calendar-alt" /> {{ datetimeshort(member.joined) }}
        </div>
        <div>
          <v-icon name="hashtag" />{{ member.userid }}
        </div>
      </b-card-header>
      <b-card-body>
        <div v-if="member.heldby">
          <NoticeMessage variant="warning" class="mb-2">
            <p v-if="me.id === member.heldby.id">
              You held this member.  Other people will see a warning to check with
              you before releasing them.
            </p>
            <p v-else>
              Held by <strong>{{ member.heldby.displayname }}</strong>.  Please check before releasing them.
            </p>
            <ModMemberButton
              v-if="member.heldby"
              :member="member"
              variant="warning"
              icon="play"
              release
              label="Release"
            />
          </NoticeMessage>
        </div>
        <ModComments :user="member" />
        <ModSpammer v-if="member.spammer" :user="member" />
        <NoticeMessage v-if="member.systemrole !== 'User'" variant="info">
          This freegler has role: {{ member.systemrole }}.
        </NoticeMessage>
        <NoticeMessage v-if="member.suspectreason" variant="danger" class="mb-2">
          This freegler is flagged: {{ member.suspectreason }}
        </NoticeMessage>
        <NoticeMessage v-if="member.activedistance > 50" variant="warning" class="mb-2">
          This freegler is active on groups {{ member.activedistance }} miles apart.
        </NoticeMessage>
        <ModBouncing v-if="member.bouncing" :user="member" />
        <NoticeMessage v-if="member.bandate">
          Banned <span :title="datetime(member.bandate)">{{ timeago(member.bandate) }}</span> <span v-if="member.bannedby">by #{{ member.bannedby }}</span> - check logs for info.
        </NoticeMessage>
        <div class="d-flex justify-content-between flex-wrap">
          <div>
            <ModMemberSummary :member="member" />
            <div v-if="member.lastaccess" :class="'mb-1 ' + (inactive ? 'text-danger': '')">
              Last active: {{ timeago(member.lastaccess) }}
              <span v-if="inactive">
                - won't send mails
              </span>
            </div>
            <div class="d-flex justify-content-between flex-wrap">
              <div v-if="member.info && member.info.publiclocation">
                Public location: {{ member.info.publiclocation.location }}
              </div>
              <div v-if="member.info && member.info.privateposition">
                Private location: {{ member.info.privateposition.loc }}
              </div>
            </div>
            <MessageMap v-if="member.info && member.info.privateposition" :position="member.info.privateposition" class="mt-2" />
            <ModMemberLogins :member="member" />
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
                  {{ member.emails.length }}
                </span>
                <span class="d-none d-sm-inline">
                  Show {{ member.emails.length | pluralize('email', { includeNumber: true }) }}
                </span>
              </span>
            </b-btn>
            <b-btn variant="link" @click="showHistory(null)">
              View posts
            </b-btn>
            <b-btn variant="link" @click="showLogs">
              View logs
            </b-btn>
            <b-btn variant="link" :to="'/profile/' + member.userid">
              View profile
            </b-btn>
            <div v-if="showEmails">
              <div v-for="e in member.emails" :key="e.id">
                {{ e.email }} <v-icon v-if="e.preferred" name="star" />
              </div>
            </div>
          </div>
        </div>
        <ModMemberReviewActions v-for="m in memberof" :key="'membership-' + m.membershipid" :membership="m" :member="member" class="p-1 mr-1" />
        <b-badge v-if="hiddenmemberofs" variant="info" class="clickme mb-1" @click="allmemberships = !allmemberships">
          +{{ hiddenmemberofs }} groups
        </b-badge>
      </b-card-body>
    </b-card>
    <ModPostingHistoryModal ref="history" :user="member" :type="type" />
    <ModLogsModal ref="logs" :userid="member.userid" />
  </div>
</template>
<script>
import MessageMap from '@/components/MessageMap'
import ModMemberReviewActions from '@/components/ModMemberReviewActions'
import NoticeMessage from './NoticeMessage'
import ProfileImage from './ProfileImage'
import ModPostingHistoryModal from './ModPostingHistoryModal'
import ModMemberSummary from './ModMemberSummary'
import ModSpammer from './ModSpammer'
import ModComments from './ModComments'
import ModLogsModal from './ModLogsModal'
import ModBouncing from './ModBouncing'
import ModMemberLogins from './ModMemberLogins'
import ModMemberButton from './ModMemberButton'
import Supporter from '~/components/Supporter'

const ExternalLink = () => import('~/components/ExternalLink')

const MEMBERSHIPS_SHOW = 3

export default {
  name: 'ModMember',
  components: {
    MessageMap,
    ModMemberButton,
    ModMemberLogins,
    ModBouncing,
    ModLogsModal,
    ModMemberSummary,
    ModComments,
    ModSpammer,
    ModPostingHistoryModal,
    ProfileImage,
    NoticeMessage,
    ExternalLink,
    Supporter,
    ModMemberReviewActions
  },

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
      allmemberships: false,
      showSpamModal: false
    }
  },
  computed: {
    reviewgroups() {
      let ms = null

      if (this.member && this.member.memberof) {
        ms = this.member.memberof
      } else if (this.user && this.user.memberof) {
        ms = this.user.memberof
      }

      if (!ms) {
        return null
      }

      return ms.filter(g => {
        return (
          this.amActiveModOn(g.id) &&
          ('reviewrequestedat' in g || g.collection === 'Spam')
        )
      })
    },
    allmemberof() {
      let ms = []

      if (this.member && this.member.memberof) {
        ms = this.member.memberof
      } else if (this.user && this.user.memberof) {
        ms = this.user.memberof
      }

      if (!ms) {
        return []
      }

      return ms
    },
    memberof() {
      if (this.allmemberships) {
        return this.sortedMemberOf
      } else {
        return this.sortedMemberOf.slice(0, MEMBERSHIPS_SHOW)
      }
    },
    sortedMemberOf() {
      const members = this.allmemberof

      return members.sort((a, b) => {
        const areview =
          this.amAModOn(a.id) &&
          a.reviewrequestedat &&
          (!a.reviewedat ||
            new Date(a.reviewrequestedat).getTime() >
              new Date(a.reviewedat).getTime())
        const breview =
          this.amAModOn(b.id) &&
          b.reviewrequestedat &&
          (!b.reviewedat ||
            new Date(b.reviewrequestedat).getTime() >
              new Date(b.reviewedat).getTime())

        if (areview && !breview) {
          return -1
        } else if (breview && !areview) {
          return 1
        } else {
          return b.added.localeCompare(a.added)
        }
      })
    },
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
    hiddenmemberofs() {
      return this.allmemberships
        ? 0
        : this.allmemberof.length > MEMBERSHIPS_SHOW
          ? this.allmemberof.length - MEMBERSHIPS_SHOW
          : 0
    },
    inactive() {
      // This code matches server code in sendOurMails.
      return (
        this.member &&
        this.member.lastaccess &&
        this.$dayjs().diff(this.$dayjs(this.member.lastaccess), 'days') >=
          365 / 2
      )
    },
    user() {
      return this.$store.getters['user/get'](this.member.userid)
    },
    reportUser() {
      return {
        // Due to inconsistencies about userid vs id in objects.
        userid: this.user.id,
        displayname: this.user.displayname
      }
    },
    settings() {
      if (this.user && this.user.settings && this.user.settings) {
        return this.user.settings
      } else {
        return {}
      }
    },
    notifications() {
      let ret = {}

      if (this.settings && this.settings.notifications) {
        ret = this.settings.notifications
      } else {
        ret = {
          email: true,
          emailmine: false,
          push: true,
          facebook: true,
          app: true
        }
      }

      return ret
    },
    relevantallowed: {
      get() {
        return this.user && Boolean(this.user.relevantallowed)
      },
      set(newval) {
        this.user.relevantallowed = newval
      }
    },
    newslettersallowed: {
      get() {
        return this.user && Boolean(this.user.newslettersallowed)
      },
      set(newval) {
        this.user.newslettersallowed = newval
      }
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
    async changeNotification(e, type) {
      const settings = this.settings
      const notifications = this.notifications
      notifications[type] = e.value
      settings.notifications = notifications

      await this.$store.dispatch('user/edit', {
        id: this.user.id,
        settings: settings
      })
    },
    async changeRelevant(e) {
      await this.$store.dispatch('user/edit', {
        id: this.user.id,
        relevantallowed: e.value
      })
    },
    async changeNotifChitchat(e) {
      const settings = this.user.settings
      settings.notificationmails = e.value
      await this.$store.dispatch('user/edit', {
        id: this.user.id,
        settings: settings
      })
    },
    async changeNewsletter(e) {
      await this.$store.dispatch('user/edit', {
        id: this.user.id,
        newslettersallowed: e.value
      })
    }
  }
}
</script>
