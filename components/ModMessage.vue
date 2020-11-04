<template>
  <div>
    <b-card bg-variant="white" no-body>
      <b-card-header class="p-1 p-md-2">
        <div class="d-flex justify-content-between">
          <div class="flex-grow-1">
            <div v-if="editing" class="d-flex flex-wrap">
              <GroupSelect v-model="editgroup" modonly class="mt-1 mr-1" />
              <div v-if="message.item && message.location" class="d-flex justify-content-start">
                <b-select v-model="message.type" :options="typeOptions" class="type mr-1" size="lg" />
                <b-input v-model="message.item.name" size="lg" class="mr-1" />
              </div>
              <div v-if="message.item && message.location">
                <b-input-group>
                  <Postcode :value="message.location.name" :find="false" @selected="postcodeSelect" />
                </b-input-group>
              </div>
              <div v-else class="d-flex flex-grow-1">
                <b-input-group class="flex-grow-1 mr-1 mt-1">
                  <b-input v-model="message.subject" />
                </b-input-group>
              </div>
            </div>
            <Diff v-else-if="editreview && oldSubject && newSubject" :old="oldSubject" :new="newSubject" class="font-weight-bold" />
            <div v-else :class="subjectClass + ' font-weight-bold'">
              <Highlighter
                v-if="message.matchedon"
                :search-words="[message.matchedon.word]"
                :text-to-highlight="eSubject"
                highlight-class-name="highlight"
                auto-escape
              />
              <span v-else>
                {{ eSubject }}
              </span>
              <span v-if="message.location" class="text-muted small">{{ message.location.name }}</span>
            </div>
            <MessageHistory :message="message" modinfo display-message-link />
            <ModMessageDuplicate v-for="(duplicate, index) in duplicates" :key="'duplicate-' + duplicate.id + '-' + index" :message="duplicate" />
            <ModMessageCrosspost v-for="crosspost in crossposts" :key="'crosspost-' + crosspost.id" :message="crosspost" />
            <div v-if="expanded">
              <ModMessageRelated v-for="related in message.related" :key="'related-' + related.id" :message="related" />
            </div>
          </div>
          <div>
            <div v-if="expanded">
              <b-btn v-if="message.source === 'Email'" variant="white" @click="viewSource">
                <v-icon name="book-open" /><span class="d-none d-sm-inline"> View Email Source</span>
              </b-btn>
              <b-btn v-if="!editing" variant="white" @click="startEdit">
                <v-icon name="pen" /><span class="d-none d-sm-inline"> Edit</span>
              </b-btn>
              <b-btn v-if="summary" variant="white" @click="expanded = !expanded">
                <v-icon name="caret-up" />
              </b-btn>
            </div>
            <b-btn v-else variant="white" @click="expanded = !expanded">
              <v-icon name="caret-down" />
            </b-btn>
          </div>
        </div>
      </b-card-header>
      <b-card-body v-if="expanded" class="p-1 p-md-2">
        <b-row>
          <b-col cols="12" lg="5">
            <div v-if="expanded">
              <NoticeMessage v-if="message.outcomes && message.outcomes.length" class="mb-1">
                {{ message.outcomes[0].outcome.toUpperCase() }}
                at
                {{ message.outcomes[0].timestamp | datetimeshort }}
              </NoticeMessage>
              <div v-if="message.heldby">
                <NoticeMessage variant="warning" class="mb-2">
                  <p v-if="me.id === message.heldby.id">
                    You held this.  Other people will see a warning to check with
                    you before releasing it.  If you release it, it will stay in Pending.
                  </p>
                  <p v-else>
                    Held by <b>{{ message.heldby.displayname }}</b>.  Please check with them before releasing it.
                  </p>
                  <ModMessageButton
                    :message="message"
                    variant="warning"
                    icon="play"
                    release
                    label="Release"
                  />
                </NoticeMessage>
              </div>
            </div>
            <div v-if="message.fromuser">
              <ModComments :user="message.fromuser" />
              <ModSpammer v-if="message.fromuser.spammer" :user="message.fromuser" />
              <NoticeMessage v-if="message.fromuser && message.fromuser.activedistance > 50" variant="warning" class="mb-2">
                This freegler is active on groups {{ message.fromuser.activedistance }} miles apart.
              </NoticeMessage>
            </div>
            <NoticeMessage v-if="outsideUK" variant="warning" class="mb-2">
              This message may be from outside the UK ({{ position.lat }}, {{ position.lng }}), which means it might be a scam.  Please check carefully.
            </NoticeMessage>
            <NoticeMessage v-if="message.spamreason" variant="warning" class="mb-2">
              {{ message.spamreason }}
            </NoticeMessage>
            <NoticeMessage v-else-if="spam" variant="warning" class="mb-2">
              We think this message might be spam.
            </NoticeMessage>
            <ModMessageWorry v-if="message.worry" :message="message" />
            <div v-if="expanded">
              <b-form-textarea
                v-if="editing"
                v-model="message.textbody"
                rows="8"
                class="mb-3"
              />
              <!-- eslint-disable-next-line -->
              <div v-else-if="editreview">
                <h4>Differences:</h4>
                <Diff class="mb-3 rounded border border-warning p-2 preline forcebreak font-weight-bold" :old="oldBody" :new="newBody" />
                <h4>New version:</h4>
                <!-- eslint-disable-next-line -->
                <div class="mb-3 rounded border border-success p-2 preline forcebreak font-weight-bold">{{ newBody }}</div>
              </div>
              <!-- eslint-disable-next-line -->
              <div v-else-if="!eBody" class="mb-3 rounded border p-2 preline forcebreak font-weight-bold"><em>This message is blank.</em></div>
              <!-- eslint-disable-next-line -->
              <div v-else class="mb-3 rounded border p-2 preline forcebreak font-weight-bold">
                <Highlighter
                  v-if="message.matchedon"
                  :search-words="[message.matchedon.word]"
                  :text-to-highlight="eBody"
                  highlight-class-name="highlight"
                  auto-escape
                />
                <span v-else>
                  {{ eBody }}
                </span>
              </div>
              <div v-if="message.attachments && message.attachments.length" class="d-flex flex-wrap">
                <ModPhoto v-for="attachment in message.attachments" :key="'attachment-' + attachment.id" :message="message" :attachment="attachment" class="d-inline pr-1" />
              </div>
              <MessageReplyInfo v-if="!pending || message.replies && message.replies.length" :message="message" class="d-inline" />
            </div>
          </b-col>
          <b-col cols="12" lg="3">
            <MessageMap v-if="group && position" :centerat="{ lat: group.lat, lng: group.lng }" :position="{ lat: position.lat, lng: position.lng }" wales locked />
          </b-col>
          <b-col cols="12" lg="3">
            <div class="rounded border border-info p-2 d-flex justify-content-between flex-wrap">
              <MessageUserInfo v-if="message.fromuser && message.groups && message.groups.length" :message="message" :user="message.fromuser" modinfo :groupid="message.groups[0].groupid" />
              <div v-else>
                <NoticeMessage v-if="message.myrole === 'Non-member' || message.myrole === 'Member'" variant="danger">
                  Sender only available to mods.
                </NoticeMessage>
                <NoticeMessage v-else variant="danger">
                  Can't identify sender.  Could have been purged but probably a bug.
                </NoticeMessage>
              </div>
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
              v-if="showMailSettings && membership && message.groups && message.groups.length"
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
                {{ email.email }} <v-icon v-if="email.preferred" name="star" />
              </div>
            </div>
            <ModMemberActions v-if="showActions && message.groups && message.groups.length" :userid="message.fromuser.id" :groupid="message.groups[0].groupid" />
          </b-col>
        </b-row>
        <div v-if="review && message.groups && message.groups.length" class="mt-1">
          <b-alert v-if="message.groups[0].collection === 'Pending'" variant="info" show>
            <v-icon name="info-circle" /> Post now in <em>Pending</em>.
          </b-alert>
          <b-alert v-if="message.groups[0].collection === 'Approved'" variant="info" show>
            <v-icon name="info-circle" /> Post now in <em>Approved</em>.
          </b-alert>
        </div>
      </b-card-body>
      <b-card-footer v-if="!noactions && expanded">
        <ModMessageButtons v-if="!editing" :message="message" :modconfig="modconfig" :editreview="editreview" :cantpost="membership && membership.ourpostingstatus === 'PROHIBITED'" />
        <b-btn v-if="editing" variant="white" @click="editing = false">
          <v-icon name="times" /> Cancel
        </b-btn>
        <b-button v-if="editing" variant="primary" @click="save">
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
import ModMessageRelated from './ModMessageRelated'
import ModMessageButton from './ModMessageButton'
import GroupSelect from './GroupSelect'
import MessageMap from './MessageMap'
import twem from '~/assets/js/twem'
import waitForRef from '@/mixins/waitForRef'
import keywords from '@/mixins/keywords.js'
const Highlighter = () => import('vue-highlight-words')

export default {
  name: 'ModMessage',
  components: {
    MessageMap,
    GroupSelect,
    ModMessageButton,
    ModMessageRelated,
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
    MessageHistory,
    Highlighter
  },
  mixins: [waitForRef, keywords],
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
    },
    summary: {
      type: Boolean,
      required: false,
      default: false
    },
    review: {
      type: Boolean,
      required: false,
      default: false
    },
    search: {
      type: String,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      saving: false,
      saved: false,
      showMailSettings: false,
      showActions: false,
      showEmails: false,
      editing: false,
      expanded: false,
      editgroup: null
    }
  },
  computed: {
    group() {
      let ret = null

      if (this.message && this.message.groups && this.message.groups.length) {
        const groupid = this.message.groups[0].groupid
        const groups = this.$store.getters['auth/groups']
        ret = groups.find(g => parseInt(g.id) === groupid)
      }

      return ret
    },
    position() {
      let ret = null

      if (this.message) {
        if (this.message.location) {
          // This is what we put in for message submitted on FD.
          ret = this.message.location
        } else if (this.message.lat || this.message.lng) {
          // This happens for TN messages
          ret = {
            lat: this.message.lat,
            lng: this.message.lng
          }
        }
      }

      return ret
    },
    outsideUK() {
      return (
        this.position &&
        (this.position.lng < -7.57216793459 ||
          this.position.lat < 49.959999905 ||
          this.position.lng > 1.68153079591 ||
          this.position.lat > 58.6350001085)
      )
    },
    pending() {
      return this.hasCollection('Pending')
    },
    approved() {
      return this.hasCollection('Approved')
    },
    spam() {
      return this.hasCollection('Spam')
    },
    eSubject() {
      return twem.twem(this.$twemoji, this.message.subject)
    },
    eBody() {
      return twem.twem(this.$twemoji, this.message.textbody)
    },
    membership() {
      let ret = null

      if (this.groupid) {
        ret =
          this.message.fromuser &&
          this.message.fromuser.memberof &&
          this.message.fromuser.memberof.find(g => g.id === this.groupid)
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
  watch: {
    summary(newVal) {
      if (newVal && this.expanded) {
        this.expanded = false
      } else if (!newVal && !this.expanded) {
        this.expanded = true
      }
    }
  },
  mounted() {
    this.expanded = !this.summary
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
      this.message.location = pc
    },
    startEdit() {
      this.editing = true
      this.message.groups.forEach(group => {
        this.editgroup = group.groupid
      })
    },
    async save() {
      this.saving = true

      if (this.message.item && this.message.location) {
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

      let alreadyon = false

      this.message.groups.forEach(g => {
        if (g.groupid === this.editgroup) {
          alreadyon = true
        }
      })

      if (!alreadyon) {
        console.log('Need to move to group', this.editgroup)
        await this.$store.dispatch('messages/move', {
          id: this.message.id,
          groupid: this.editgroup
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
      this.$store.dispatch('members/update', params)
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
      this.waitForRef('original', () => {
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
      const dupids = []
      const crossids = []

      if (
        this.message &&
        this.message.fromuser &&
        this.message.fromuser.messagehistory
      ) {
        this.message.fromuser.messagehistory.forEach(message => {
          if (message.id !== this.message.id && message.daysago < 60) {
            if (this.canonSubj(message.subject) === subj) {
              // No point displaying any group tag in the duplicate.
              message.subject = message.subject.replace(/\[.*\](.*)/, '$1')

              // Check whether there are groups in common.
              const groupsInCommon = this.message.groups
                .map(g => g.groupid)
                .filter(g => g === message.groupid).length

              const key = message.id + '-' + message.arrival

              if (duplicateCheck && groupsInCommon) {
                // Same group - so this is a duplicate
                if (!dupids[key]) {
                  dupids[key] = true
                  ret.push(message)
                }
              } else if (!duplicateCheck && !groupsInCommon) {
                // Different group - so this is a crosspost.
                if (!crossids[key]) {
                  crossids[key] = true
                  ret.push(message)
                }
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
