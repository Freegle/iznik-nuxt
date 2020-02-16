<template>
  <div>
    <b-card bg-variant="white" no-body>
      <b-card-header class="d-flex justify-content-between">
        <!--        TODO Edits-->
        <div>
          <div v-if="!editing" :class="subjectClass + ' font-weight-bold'">
            {{ eSubject }}
          </div>
          <div v-else>
            <div v-if="message.location">
              <b-input-group>
                <b-select v-model="message.type" :options="typeOptions" class="type" />
                <b-input v-model="message.item.name" />
                <b-input v-model="message.location.name" class="location" />
              </b-input-group>
            </div>
            <div v-else>
              <b-input-group>
                <b-input v-model="message.subject" />
              </b-input-group>
            </div>
          </div>
          <MessageHistory :message="message" modinfo display-message-link />
        </div>
        <div>
          <b-btn v-if="!editing" variant="white" @click="editing = true">
            <v-icon name="pen" /><span class="d-none d-sm-inline"> Edit</span>
          </b-btn>
          <b-btn v-if="editing" variant="white" @click="editing = false">
            <v-icon name="" /> Cancel
          </b-btn>
          <b-button v-if="editing" variant="white" disabled @click="save">
            <v-icon v-if="saving" name="sync" class="text-success fa-spin" />
            <v-icon v-else-if="saved" name="check" class="text-success" />
            <v-icon v-else name="save" />
            Save
          </b-button>
        </div>
        <!--        TODO Duplicates, related-->
        <!--        Worry Words-->
        <!--        Outcomes-->
        <!--        View Source-->
      </b-card-header>
      <b-card-body>
        <!--        Held by-->
        <b-row>
          <b-col cols="12" lg="8">
            <NoticeMessage v-if="message.fromuser.activedistance > 50" variant="warning" class="mb-2">
              This freegler is active on groups {{ message.fromuser.activedistance }} miles apart.
            </NoticeMessage>
            <NoticeMessage v-if="message.spamreason" variant="warning" class="mb-2">
              {{ spamreason }}
            </NoticeMessage>
            <NoticeMessage v-else-if="spam" variant="warning" class="mb-2">
              We think this message might be spam.
            </NoticeMessage>
            <ModMessageWorry v-if="message.worry" :message="message" />
            <b-form-textarea
              v-if="editing"
              v-model="message.textbody"
              rows="8"
              class="mb-3"
            />
            <!-- eslint-disable-next-line -->
            <div v-else-if="!eBody" class="mb-3 rounded border p-2 prewrap forcebreak font-weight-bold"><em>This message is blank.</em></div>
            <!-- eslint-disable-next-line -->
            <div v-else class="mb-3 rounded border p-2 prewrap forcebreak font-weight-bold">{{ eBody }}</div>
            <div v-if="message.attachments && message.attachments.length" class="d-flex">
              <ModPhoto v-for="attachment in message.attachments" :key="'attachment-' + attachment.id" :message="message" :attachment="attachment" class="d-inline pr-1" />
            </div>
            <MessageReplyInfo v-if="!pending || message.replies && message.replies.length" :message="message" class="d-inline" />
          </b-col>
          <b-col cols="12" lg="4">
            <div class="rounded border border-info p-2 d-flex justify-content-between flex-wrap">
              <MessageUserInfo :message="message" :user="message.fromuser" modinfo :groupid="message.groups[0].groupid" />
              <!-- TODO             Group list-->
              <!-- TODO             Applied list-->
            </div>
            <div class="d-flex justify-content-between flex-wrap">
              <b-btn variant="link" @click="showMailSettings = !showMailSettings">
                <span v-if="showMailSettings">
                  <v-icon name="cog" />
                  <span class="d-inline d-sm-none">
                    Hide
                  </span>
                  <span class="d-none d-sm-inline">
                    Hide mail settings
                  </span>
                </span>
                <span v-else>
                  <v-icon name="cog" />
                  <span class="d-inline d-sm-none">
                    Settings
                  </span>
                  <span class="d-none d-sm-inline">
                    Show mail settings
                  </span>
                </span>
              </b-btn>
              <b-btn v-if="message.fromuser.emails && message.fromuser.emails.length" variant="link" @click="showEmails = !showEmails">
                <v-icon name="envelope" />
                <span v-if="showEmails">
                  <span class="d-inline d-sm-none">
                    Hide
                  </span>
                  <span class="d-none d-sm-inline">
                    Show {{ message.fromuser.emails.length | pluralize('email', { includeNumber: true }) }}
                  </span>
                </span>
                <span v-else>
                  <span class="d-inline d-sm-none">
                    <v-icon name="envelope" /> {{ message.fromuser.emails.length }}
                  </span>
                  <span class="d-none d-sm-inline">
                    Show {{ message.fromuser.emails.length | pluralize('email', { includeNumber: true }) }}
                  </span>
                </span>
              </b-btn>
              <b-btn variant="link" @click="showActions = !showActions">
                <v-icon name="hammer" />
                <span v-if="showActions">
                  <span class="d-inline d-sm-none">
                    Hide
                  </span>
                  <span class="d-none d-sm-inline">
                    Show actions
                  </span>
                </span>
                <span v-else>
                  <span class="d-inline d-sm-none">
                    Actions
                  </span>
                  <span class="d-none d-sm-inline">
                    Show actions
                  </span>
                </span>
              </b-btn>
            </div>
            <!--          TODO Bind to event and handle changes-->
            <SettingsGroup
              v-if="showMailSettings"
              :groupid="message.groups[0].groupid"
              :emailfrequency="membership.emailfrequency"
              :volunteeringallowed="Boolean(membership.volunteeringallowed)"
              :eventsallowed="Boolean(membership.eventsallowed)"
              class="border border-info mt-2 p-1"
            />
            <div v-if="showEmails">
              <div v-for="email in message.fromuser.emails" :key="email.id">
                {{ email.email }} <v-icon v-if="email.preferred" name="start" />
              </div>
            </div>
            <div v-if="showActions">
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
          </b-col>
        </b-row>
      </b-card-body>
      <b-card-footer>
        <ModMessageButtons :message="message" :modconfig="modconfig" />
      </b-card-footer>
    </b-card>
  </div>
</template>
<script>
// TODO Validation
// - item length
import MessageHistory from './MessageHistory'
import MessageUserInfo from './MessageUserInfo'
import MessageReplyInfo from './MessageReplyInfo'
import SettingsGroup from './SettingsGroup'
import ModPhoto from './ModPhoto'
import NoticeMessage from './NoticeMessage'
import ModMessageButtons from './ModMessageButtons'
import ModMessageWorry from './ModMessageWorry'
import twem from '~/assets/js/twem'

export default {
  name: 'ModMessage',
  components: {
    ModMessageWorry,
    ModMessageButtons,
    NoticeMessage,
    ModPhoto,
    SettingsGroup,
    MessageReplyInfo,
    MessageUserInfo,
    MessageHistory
  },
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      saving: false,
      saved: false,
      showMailSettings: false,
      showActions: false,
      showEmails: false,
      editing: false
    }
  },
  computed: {
    pending() {
      return this.hasCollection('Pending')
    },
    approved() {
      return this.hasCollection('Approved')
    },
    spam() {
      return this.hasCollection('Spam')
    },

    typeOptions() {
      // TODO Per group keywords
      return [
        {
          value: 'Offer',
          text: 'OFFER'
        },
        {
          value: 'Wanted',
          text: 'WANTED'
        }
      ]
    },
    eSubject() {
      return twem.twem(this.$twemoji, this.message.subject)
    },
    eBody() {
      return twem.twem(this.$twemoji, this.message.textbody)
    },
    groupid() {
      return this.message.groups && this.message.groups.length > 0
        ? this.message.groups[0].groupid
        : null
    },
    membership() {
      let ret = null

      if (this.groupid) {
        ret = this.message.fromuser.memberof.find(g => g.id === this.groupid)
      }

      return ret
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
    subjectClass() {
      let ret = 'text-success'

      if (this.modconfig.coloursubj) {
        ret = this.message.subject.match(this.modconfig.subjreg)
          ? 'text-success'
          : 'text-danger'
      }

      return ret
    }
  },
  methods: {
    hasCollection(coll) {
      let ret = false

      if (this.message.groups) {
        this.message.groups.forEach(group => {
          if (group.collection === coll) {
            ret = true
          }
        })
      }

      return ret
    }
  }
}
</script>
<style scoped>
.type {
  max-width: 150px;
}
.location {
  max-width: 250px;
}
</style>
