<template>
  <div>
    <b-card bg-variant="white" no-body>
      <b-card-header class="d-flex justify-content-between p-1 p-md-2">
        <div>
          <div v-if="editing">
            <div v-if="message.location" class="d-flex justify-content-start">
              <b-select v-model="message.type" :options="typeOptions" class="type mr-1" size="lg" />
              <b-input v-model="message.item.name" size="lg" class="mr-1" />
              <b-input-group>
                <Postcode :value="message.location.name" :find="false" @selected="postcodeSelect" />
              </b-input-group>
            </div>
            <div v-else>
              <b-input-group>
                <b-input v-model="message.subject" />
              </b-input-group>
            </div>
          </div>
          <Diff v-else-if="editreview" :old="oldSubject" :new="newSubject" class="font-weight-bold" />
          <div v-else :class="subjectClass + ' font-weight-bold'">
            {{ eSubject }}
          </div>
          <MessageHistory :message="message" modinfo display-message-link />
          <ModMessageDuplicate v-for="duplicate in duplicates" :key="'duplicate-' + duplicate.id" :message="duplicate" />
          <ModMessageCrosspost v-for="crosspost in crossposts" :key="'crosspost-' + crosspost.id" :message="crosspost" />
        </div>
        <div>
          <b-btn v-if="message.source === 'Email'" variant="white" @click="viewSource">
            <v-icon name="book-open" /><span class="d-none d-sm-inline"> View Email Source</span>
          </b-btn>
          <b-btn v-if="!editing" variant="white" @click="editing = true">
            <v-icon name="pen" /><span class="d-none d-sm-inline"> Edit</span>
          </b-btn>
        </div>
      </b-card-header>
      <b-card-body class="p-1 p-md-2">
        <b-row>
          <b-col cols="12" lg="8">
            <NoticeMessage v-if="message.outcomes && message.outcomes.length" class="mb-1">
              {{ message.outcomes[0].outcome.toUpperCase() }}
              at
              {{ message.outcomes[0].timestamp | datetimeshort }}
            </NoticeMessage>
            <div v-if="message.heldby">
              <NoticeMessage v-if="me.id === message.heldby.id" variant="warning" class="mb-2">
                You held this {{ message.heldby.timestamp | timeago }}.  Other people will see a warning to check with
                you before releasing it.
              </NoticeMessage>
              <NoticeMessage v-else variant="warning" class="mb-2">
                Held by <b>{{ message.heldby.displayname }}</b>
                {{ message.heldby.timestamp | timeago }}.  Please check with them before releasing it.
              </NoticeMessage>
            </div>
            <ModComments :user="message.fromuser" />
            <ModSpammer v-if="message.fromuser.spammer" :user="message.fromuser" />
            <NoticeMessage v-if="message.fromuser && message.fromuser.activedistance > 50" variant="warning" class="mb-2">
              This freegler is active on groups {{ message.fromuser.activedistance }} miles apart.
            </NoticeMessage>
            <NoticeMessage v-if="message.spamreason" variant="warning" class="mb-2">
              {{ message.spamreason }}
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
            <Diff v-else-if="editreview" class="mb-3 rounded border p-2 prewrap forcebreak font-weight-bold" :old="oldBody" :new="newBody" />
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
              <MessageUserInfo v-if="message.fromuser" :message="message" :user="message.fromuser" modinfo :groupid="message.groups[0].groupid" />
              <NoticeMessage v-else variant="danger">
                Can't identify sender.  Probably a bug.
              </NoticeMessage>
            </div>
            <div class="d-flex justify-content-between flex-wrap">
              <b-btn variant="link" @click="toggleMail">
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
              <b-btn v-if="message.fromuser && message.fromuser.emails && message.fromuser.emails.length" variant="link" @click="showEmails = !showEmails">
                <span v-if="showEmails">
                  <span class="d-inline d-sm-none">
                    Hide
                  </span>
                  <span class="d-none d-sm-inline">
                    Hide {{ message.fromuser.emails.length | pluralize('email', { includeNumber: true }) }}
                  </span>
                </span>
                <span v-else>
                  <span class="d-inline d-sm-none">
                    <v-icon name="envelope" /> {{ message.fromuser.emails.length | pluralize('email', { includeNumber: true }) }}
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
                    Hide actions
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
            <SettingsGroup
              v-if="showMailSettings"
              :groupid="message.groups[0].groupid"
              :emailfrequency="membership.emailfrequency"
              :volunteeringallowed="Boolean(membership.volunteeringallowed)"
              :eventsallowed="Boolean(membership.eventsallowed)"
              class="border border-info mt-2 p-1"
              :userid="message.fromuser.id"
              @change="settingsChange"
            />
            <div v-if="showEmails">
              <div v-for="email in message.fromuser.emails" :key="email.id">
                {{ email.email }} <v-icon v-if="email.preferred" name="start" />
              </div>
            </div>
            <ModMemberActions v-if="showActions" :userid="message.fromuser.id" :groupid="message.groups[0].groupid" />
          </b-col>
        </b-row>
      </b-card-body>
      <b-card-footer v-if="!noactions">
        <ModMessageButtons v-if="!editing" :message="message" :modconfig="modconfig" :editreview="editreview" />
        <b-btn v-if="editing" variant="white" @click="editing = false">
          <v-icon name="times" /> Cancel
        </b-btn>
        <b-button v-if="editing" variant="success" @click="save">
          <v-icon v-if="saving" name="sync" class="text-success fa-spin" />
          <v-icon v-else-if="saved" name="check" class="text-success" />
          <v-icon v-else name="save" />
          Save
        </b-button>
      </b-card-footer>
    </b-card>
    <ModMessageEmailModal v-if="message.source === 'Email'" :id="message.id" ref="original" />
  </div>
</template>
<script>
import MessageHistory from './MessageHistory'
import MessageUserInfo from './MessageUserInfo'
import MessageReplyInfo from './MessageReplyInfo'
import SettingsGroup from './SettingsGroup'
import ModPhoto from './ModPhoto'
import NoticeMessage from './NoticeMessage'
import ModMessageButtons from './ModMessageButtons'
import ModMessageWorry from './ModMessageWorry'
import Postcode from './Postcode'
import ModMemberActions from './ModMemberActions'
import Diff from './Diff'
import ModSpammer from './ModSpammer'
import ModComments from './ModComments'
import ModMessageEmailModal from './ModMessageEmailModal'
import ModMessageDuplicate from './ModMessageDuplicate'
import ModMessageCrosspost from './ModMessageCrosspost'
import twem from '~/assets/js/twem'
import waitForRef from '@/mixins/waitForRef'

export default {
  name: 'ModMessage',
  components: {
    ModMessageCrosspost,
    ModMessageDuplicate,
    ModMessageEmailModal,
    ModComments,
    ModSpammer,
    Diff,
    ModMemberActions,
    Postcode,
    ModMessageWorry,
    ModMessageButtons,
    NoticeMessage,
    ModPhoto,
    SettingsGroup,
    MessageReplyInfo,
    MessageUserInfo,
    MessageHistory
  },
  mixins: [waitForRef],
  props: {
    message: {
      type: Object,
      required: true
    },
    editreview: {
      type: Boolean,
      required: false,
      default: false
    },
    noactions: {
      type: Boolean,
      required: false,
      default: false
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
      return [
        {
          value: 'Offer',
          text:
            this.group && this.group.settings && this.group.settings.keywords
              ? this.group.settings.keywords.offer
              : 'OFFER'
        },
        {
          value:
            this.group && this.group.settings && this.group.settings.keywords
              ? this.group.settings.keywords.wanted
              : 'Wanted',
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
    group() {
      return this.groupid
        ? this.$store.getters['auth/groupById'](this.groupid)
        : null
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

      if (this.modconfig && this.modconfig.coloursubj) {
        ret = this.message.subject.match(this.modconfig.subjreg)
          ? 'text-success'
          : 'text-danger'
      }

      return ret
    },
    oldSubject() {
      if (!this.editreview || !this.message || !this.message.edits) {
        return null
      }

      // Edits are in descending time order.
      let oldest = null

      this.message.edits.forEach(edit => {
        if (edit.reviewrequired && edit.oldsubject) {
          oldest = edit.oldsubject
        }
      })

      return oldest
    },
    newSubject() {
      if (!this.editreview || !this.message || !this.message.edits) {
        return null
      }

      // Find the newest and oldest texts; intermediates are just confusing.
      // Edits are in descending time order.
      let newest = null

      this.message.edits.forEach(edit => {
        if (edit.reviewrequired) {
          if (edit.newsubject && !newest) {
            newest = edit.newsubject
          }
        }
      })

      return newest
    },
    oldBody() {
      if (!this.editreview || !this.message || !this.message.edits) {
        return null
      }

      // Edits are in descending time order.
      let oldest = null

      this.message.edits.forEach(edit => {
        if (edit.reviewrequired && edit.oldtext) {
          oldest = edit.oldtext
        }
      })

      return oldest
    },
    newBody() {
      if (!this.editreview || !this.message || !this.message.edits) {
        return null
      }

      // Find the newest and oldest texts; intermediates are just confusing.
      // Edits are in descending time order.
      let newest = null

      this.message.edits.forEach(edit => {
        if (edit.reviewrequired) {
          if (edit.newtext && !newest) {
            newest = edit.newtext
          }
        }
      })

      return newest
    },
    duplicateAge() {
      let ret = 31
      let check = false

      this.message.groups.forEach(g => {
        const group = this.$store.getters['group/get'](g.groupid)

        if (
          !group.settings ||
          !group.settings.duplicates ||
          group.settings.duplicates.check
        ) {
          check = true
          const msgtype = this.message.type.toLowerCase()
          ret = Math.min(ret, group.settings.duplicates[msgtype])
        }
      })

      return check ? ret : ret
    },
    crossposts() {
      return this.checkHistory(false)
    },
    duplicates() {
      return this.checkHistory(true)
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
    },
    postcodeSelect(pc) {
      console.log('Selected', pc)
      this.message.location = pc
    },
    async save() {
      this.saving = true

      if (this.message.location) {
        // Well-structured message
        await this.$store.dispatch('messages/patch', {
          id: this.message.id,
          msgtype: this.message.type,
          item: this.message.item.name,
          location: this.message.location.name,
          textbody: this.message.textbody
        })
      } else {
        // Not
        await this.$store.dispatch('messages/patch', {
          id: this.message.id,
          subject: this.message.subject,
          textbody: this.message.textbody
        })
      }

      this.saving = false
      this.editing = false
    },
    settingsChange(e) {
      const params = {
        userid: this.message.fromuser.id,
        groupid: this.groupid
      }
      params[e.param] = e.val
      this.$store.dispatch('members/updateById', params)
    },
    async toggleMail() {
      this.showMailSettings = !this.showMailSettings

      if (this.showMailSettings) {
        // Get the user into the store for SettingsGroup.
        await this.$store.dispatch('user/fetch', {
          id: this.message.fromuser.id
        })
      }
    },
    viewSource() {
      console.log('View source')
      this.waitForRef('original', () => {
        console.log('Now')
        this.$refs.original.show()
      })
    },
    canonSubj(subj) {
      subj = subj.toLocaleLowerCase()

      // Remove any group tag
      subj = subj.replace(/^\[.*?\](.*)/, '$1')

      // Remove duplicate spaces
      subj = subj.replace(/\s+/g, ' ')

      subj = subj.trim()

      return subj
    },
    checkHistory(duplicateCheck) {
      const ret = []
      const subj = this.canonSubj(this.message.subject)

      if (
        this.message &&
        this.message.fromuser &&
        this.message.fromuser.messagehistory
      ) {
        this.message.fromuser.messagehistory.forEach(message => {
          if (message.daysago < 60) {
            if (this.canonSubj(message.subject) === subj) {
              // No point displaying any group tag in the duplicate.
              message.subject = message.subject.replace(/\[.*\](.*)/, '$1')

              // Check whether there are groups in common.
              const groupsInCommon = this.message.groups
                .map(g => g.groupid)
                .filter(g => g === message.groupid).length

              if (duplicateCheck && groupsInCommon) {
                // Same group - so this is a duplicate
                ret.push(message)
              } else if (!duplicateCheck && !groupsInCommon) {
                // Different group - so this is a crosspost.
                ret.push(message)
              }
            }
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
