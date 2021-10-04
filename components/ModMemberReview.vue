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
          <v-icon name="calendar-alt" /> {{ member.joined | datetimeshort }}
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
          Banned <span :title="member.bandate | datetime">{{ member.bandate | timeago }}</span> <span v-if="member.bannedby">by #{{ member.bannedby }}</span> - check logs for info.
        </NoticeMessage>
        <div class="d-flex justify-content-between flex-wrap">
          <div>
            <ModMemberSummary :member="member" />
            <div v-if="member.lastaccess" :class="'mb-1 ' + (inactive ? 'text-danger': '')">
              Last active: {{ member.lastaccess | timeago }}
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
        <div v-for="m in memberof" :key="'membership-' + m.membershipid" class="p-1 mr-1">
          <strong>{{ m.namedisplay.length > 32 ? (m.namedisplay.substring(0, 32) + '...') : m.namedisplay }}</strong>
          <span :class="'small ' + (daysago(m.added) < 31 ? 'text-danger font-weight-bold' : 'text-muted')">joined {{ m.added | timeago }}</span>
          <span v-if="m.reviewreason" class="text-danger ml-1 mr-1">{{ m.reviewreason }}</span>
          <b-btn v-if="amAModOn(m.id)" :to="'/modtools/members/approved/search/' + m.id + '/' + member.userid" variant="link" class="p-0 border-0 align-top">
            Go to membership
          </b-btn>
        </div>
        <b-badge v-if="hiddenmemberofs" variant="info" class="clickme mb-1" @click="allmemberships = !allmemberships">
          +{{ hiddenmemberofs }} groups
        </b-badge>
      </b-card-body>
      <b-card-footer class="d-flex justify-content-start flex-wrap">
        <SpinButton
          variant="danger"
          name="ban"
          label="Report Spammer"
          class="mr-1 mt-1"
          :handler="spamReport"
        />
        <SpinButton
          v-for="group in reviewgroups"
          :key="'reviewgroup-' + group.id"
          :member="member"
          variant="primary"
          name="check"
          :label="'Ignore on ' + group.namedisplay"
          :handler="spamIgnore"
          :handler-data="{ groupid: group.id }"
          class="mr-1 mt-1"
        />
      </b-card-footer>
    </b-card>
    <ModPostingHistoryModal ref="history" :user="member" :type="type" />
    <ModLogsModal ref="logs" :userid="member.userid" />
    <ModSpammerReport v-if="showSpamModal" ref="spamConfirm" :user="reportUser" :whitelist="whitelist" />
  </div>
</template>
<script>
import MessageMap from '@/components/MessageMap'
import waitForRef from '../mixins/waitForRef'
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
import ModSpammerReport from './ModSpammerReport'
import SpinButton from './SpinButton'
import Supporter from '~/components/Supporter'

const ExternalLink = () => import('~/components/ExternalLink')

const MEMBERSHIPS_SHOW = 3

export default {
  name: 'ModMember',
  components: {
    MessageMap,
    SpinButton,
    ModSpammerReport,
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
    Supporter
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
      allmemberships: false,
      showSpamModal: false,
      ignored: []
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
          ('reviewrequestedat' in g || g.collection === 'Spam') &&
          !this.ignored[g.id]
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

      ms.sort(function(a, b) {
        if (a.reviewreason && !b.reviewreason) {
          return -1
        } else if (b.reviewreason && !a.reviewreason) {
          return 1
        } else {
          return new Date(b.added).getTime() - new Date(a.added).getTime()
        }
      })

      return ms
    },
    memberof() {
      if (this.allmemberships) {
        return this.allmemberof
      } else {
        return this.allmemberof.slice(0, MEMBERSHIPS_SHOW)
      }
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
    },
    async spamReport() {
      if (!this.user) {
        await this.$store.dispatch('user/fetch', {
          id: this.member.userid,
          info: true
        })
      }

      this.whitelist = false
      this.showSpamModal = true

      this.waitForRef('spamConfirm', () => {
        this.$refs.spamConfirm.show()
      })
    },
    async spamIgnore(data) {
      const groupid = data.groupid

      await this.$store.dispatch('members/spamignore', {
        userid: this.member.userid,
        groupid: groupid
      })

      this.ignored[groupid] = true
    },
    daysago(d) {
      return this.$dayjs().diff(this.$dayjs(d), 'days')
    }
  }
}
</script>
