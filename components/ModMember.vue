<template>
  <div v-if="member">
    <b-card bg-variant="white" no-body>
      <b-card-header class="d-flex justify-content-between flex-wrap">
        <div>
          <div v-if="isLJ">
            LoveJunk user #{{ user.ljuserid }}
          </div>
          <div v-else>
            <!-- eslint-disable-next-line -->
            <v-icon name="envelope" /> <ExternalLink :href="'mailto:' + email">{{ email }}</ExternalLink>
          </div>
        </div>
        <div>
          <ProfileImage :image="member.profile.turl" class="ml-1 mb-1 inline" is-thumbnail size="sm" />
          {{ member.displayname }}
        </div>
        <div v-if="member.joined">
          <v-icon name="calendar-alt" /> {{ datetimeshort(member.joined) }}
        </div>
        <div>
          <v-icon name="hashtag" />{{ member.userid }}
        </div>
      </b-card-header>
      <b-card-body>
        <NoticeMessage v-if="unsubscribed">
          This freegler has been unsubscribed.
        </NoticeMessage>
        <ModDeletedOrForgotten v-if="user" :user="user" />
        <NoticeMessage v-if="banned" variant="danger" class="mb-2">
          This freegler is banned from this group.
        </NoticeMessage>
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
        <ModComments :user="member" :expand-comments="expandComments" />
        <ModSpammer v-if="member.spammer" :user="member" :sameip="sameip" />
        <NoticeMessage v-if="member.suspectreason" variant="danger" class="mb-2">
          This freegler is flagged: {{ member.suspectreason }}
        </NoticeMessage>
        <NoticeMessage v-if="member.activedistance > 50" variant="warning" class="mb-2">
          This freegler recently active on groups {{ member.activedistance }} miles apart.
        </NoticeMessage>
        <ModBouncing v-if="member.bouncing" :user="member" />
        <NoticeMessage v-if="member.bandate">
          Banned <span :title="datetime(member.bandate)">{{ timeago(member.bandate) }}</span> <span v-if="member.bannedby">by #{{ member.bannedby }}</span> - check logs for info.
          <b-btn variant="link" size="sm" @click="confirmUnban">
            Unban
          </b-btn>
          <ConfirmModal ref="unbanConfirm" :title="'Unban #' + member.userid" @confirm="unban" />
        </NoticeMessage>
        <div class="d-flex justify-content-between flex-wrap">
          <SettingsGroup
            v-if="groupid && member.ourpostingstatus"
            :groupid="groupid"
            :emailfrequency="member.emailfrequency"
            :volunteeringallowed="Boolean(member.volunteeringallowed)"
            :eventsallowed="Boolean(member.eventsallowed)"
            :moderation="member.ourpostingstatus"
            :userid="member.userid"
            class="border border-info p-1 flex-grow-1 mr-1"
            @change="settingsChange"
          />
          <div>
            <ModMemberSummary :member="member" />
            <ModMemberEngagement :member="member" />
            <div v-if="member.info && member.info.publiclocation">
              Public location: {{ member.info.publiclocation.location }}
            </div>
            <ModMemberActions v-if="!footeractions" :userid="member.userid" :groupid="groupid" :banned="(Boolean)(member.bandate)" />
            <ModMemberships :user="member" />
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
        <div v-if="user && user.id && !isTN && !isLJ">
          <hr>
          <div class="d-flex justify-content-between flex-wrap">
            <OurToggle
              v-model="notifications.email"
              :height="30"
              :width="200"
              :font-size="14"
              :sync="true"
              :labels="{checked: 'Chat On', unchecked: 'Chat Off'}"
              color="#61AE24"
              @change="changeNotification($event, 'email')"
            />
            <OurToggle
              v-model="notifications.emailmine"
              :height="30"
              :width="200"
              :font-size="14"
              :sync="true"
              :labels="{checked: 'Own Chats On', unchecked: 'Own Chats Off'}"
              color="#61AE24"
              @change="changeNotification($event, 'emailmine')"
            />
            <OurToggle
              v-model="settings.notificationmails"
              :height="30"
              :width="200"
              :font-size="14"
              :sync="true"
              :labels="{checked: 'Notification/ChitChat On', unchecked: 'Notification/ChitChat On'}"
              color="#61AE24"
              @change="changeNotifChitchat"
            />
            <OurToggle
              v-model="relevantallowed"
              :height="30"
              :width="200"
              :font-size="14"
              :sync="true"
              :labels="{checked: 'Suggestions On', unchecked: 'Suggestions Off'}"
              color="#61AE24"
              @change="changeRelevant"
            />
            <OurToggle
              v-model="newslettersallowed"
              :height="30"
              :width="200"
              :font-size="14"
              :sync="true"
              :labels="{checked: 'Newsletters On', unchecked: 'Newsletters Off'}"
              color="#61AE24"
              @change="changeNewsletter"
            />
            <OurToggle
              v-model="autorepost"
              :height="30"
              :width="200"
              :font-size="14"
              :sync="true"
              :labels="{checked: 'Autorepost On', unchecked: 'Autorepost Off'}"
              color="#61AE24"
            />
          </div>
        </div>
      </b-card-body>
      <b-card-footer class="d-flex justify-content-between flex-wrap">
        <ModMemberButtons :member="member" :modconfig="modconfig" :actions="footeractions" />
        <div class="d-flex justify-content-between justify-content-md-end flex-grow-1">
          <ModRole v-if="groupid && member.role" :userid="member.userid" :groupid="groupid" :role="member.role" />
          <ChatButton
            :userid="member.userid"
            :groupid="member.groupid"
            title="Chat"
            variant="white"
            class="ml-1"
          />
        </div>
      </b-card-footer>
    </b-card>
    <ModPostingHistoryModal ref="history" :user="member" :type="type" />
    <ModLogsModal v-if="showLogsModal" ref="logs" :userid="member.userid" />
  </div>
</template>
<script>
import ModDeletedOrForgotten from '@/components/ModDeletedOrForgotten'
import SettingsGroup from './SettingsGroup'
import NoticeMessage from './NoticeMessage'
import ProfileImage from './ProfileImage'
import ModPostingHistoryModal from './ModPostingHistoryModal'
import ModMemberActions from './ModMemberActions'
import ModMemberSummary from './ModMemberSummary'
import ModSpammer from './ModSpammer'
import ModComments from './ModComments'
import ModMemberButtons from './ModMemberButtons'
import ModMemberships from './ModMemberships'
import ModBouncing from './ModBouncing'
import ModMemberLogins from './ModMemberLogins'
import ModRole from './ModRole'
import ChatButton from './ChatButton'
import ModMemberButton from './ModMemberButton'
import ModMemberEngagement from '~/components/ModMemberEngagement'
import ConfirmModal from '~/components/ConfirmModal'
const OurToggle = () => import('~/components/OurToggle')
const ExternalLink = () => import('~/components/ExternalLink')
const ModLogsModal = () => import('~/components/ModLogsModal')

export default {
  name: 'ModMember',
  components: {
    ModDeletedOrForgotten,
    ModMemberEngagement,
    ConfirmModal,
    ModMemberButton,
    ChatButton,
    OurToggle,
    ModRole,
    ModMemberLogins,
    ModBouncing,
    ModMemberships,
    ModLogsModal,
    ModMemberButtons,
    ModMemberSummary,
    ModComments,
    ModSpammer,
    ModMemberActions,
    ModPostingHistoryModal,
    ProfileImage,
    // ModMessageButtons,
    NoticeMessage,
    SettingsGroup,
    ExternalLink
  },

  props: {
    member: {
      type: Object,
      required: true
    },
    spammerlist: {
      type: Boolean,
      required: false,
      default: false
    },
    footeractions: {
      type: Boolean,
      required: false,
      default: true
    },
    expandComments: {
      type: Boolean,
      required: false,
      default: false
    },
    sameip: {
      type: Array,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      saving: false,
      saved: false,
      showEmails: false,
      type: null,
      allmemberships: false,
      showLogsModal: false,
      banned: false,
      unsubscribed: false
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
    groupid() {
      return this.member.groupid
    },
    group() {
      return this.myGroup(this.groupid)
    },
    modconfig() {
      let ret = null
      let configid = null

      this.myGroups.forEach(group => {
        if (group.id === this.groupid) {
          configid = group.configid
        }
      })

      const configs = this.$store.getters['modconfigs/configs']
      ret = configs.find(config => config.id === configid)

      return ret
    },
    user() {
      return this.$store.getters['user/get'](this.member.userid)
    },
    isTN() {
      let ret = false
      if (this.user) {
        if (this.user.emails) {
          this.user.emails.forEach(e => {
            if (e.email && e.email.indexOf('@user.trashnothing.com') !== -1) {
              ret = true
            }
          })
        }
      }

      return ret
    },
    isLJ() {
      return this.user && this.user.ljuserid
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
    },
    autorepost: {
      get() {
        return (
          this.member && !this.isTN && Boolean(!this.member.autorepostsdisable)
        )
      },
      setnewval() {}
    }
  },
  mounted() {
    if (this.member.banned) {
      this.banned = true
    }

    if (!this.user) {
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
      this.showLogsModal = true

      this.waitForRef('logs', () => {
        this.$refs.logs.show()
      })
    },
    settingsChange(e) {
      const params = {
        userid: this.member.userid,
        groupid: e.groupid
      }
      params[e.param] = e.val
      this.$store.dispatch('members/update', params)
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
    confirmUnban() {
      this.waitForRef('unbanConfirm', () => {
        this.$refs.unbanConfirm.show()
      })
    },
    async unban() {
      await this.$store.dispatch('members/unban', {
        userid: this.user.id,
        groupid: this.groupid
      })
    }
  }
}
</script>
