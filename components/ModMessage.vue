<template>
  <div>
    <div ref="top" style="position:relative; top:-66px" />
    <b-card bg-variant="white" no-body>
      <b-card-header class="p-1 p-md-2">
        <div class="d-flex justify-content-between">
          <div class="flex-grow-1">
            <NoticeMessage v-if="editing && !message.lat && !message.lng" variant="danger" class="mb-2 mr-2">
              This message needs editing so that we know where it is.  Please put in a postcode
              (it doesn't have to be exactly right - do your best based on the subject).
              <b-input-group>
                <Postcode class="mt-2" value="" :find="false" @selected="postcodeSelect" />
              </b-input-group>
            </NoticeMessage>
            <div v-if="editing" class="d-flex flex-wrap">
              <GroupSelect
                v-model="editgroup"
                modonly
                class="mr-1"
                size="lg"
                :disabled-except-for="memberGroupIds"
                :disabled="message.fromuser.tnuserid"
              />
              <div v-if="message.item && message.location" class="d-flex justify-content-start">
                <b-select v-model="message.type" :options="typeOptions" class="type mr-1" size="lg" />
                <b-input v-model="message.item.name" size="lg" class="mr-1" />
              </div>
              <div v-if="message.item && message.location">
                <b-input-group>
                  <Postcode :value="message.location.name" :find="false" @selected="postcodeSelect" />
                </b-input-group>
              </div>
              <div v-else class="flex-grow-1 pl-0 pl-md-2 pr-0 pr-md-2 fullsubject">
                <label class="mr-2">Subject:</label>
                <b-input v-model="message.subject" size="lg" />
                <label class="mr-2">Post type:</label>
                <b-select v-model="message.type" :options="typeOptions" class="type mr-1" size="lg" />
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
              <span v-if="message.availableinitially && message.availableinitially > 1" class="small text-info">
                <b-badge v-if="message.availableinitially === message.availablenow" variant="info">
                  {{ message.availablenow }} available
                </b-badge>
                <b-badge v-else variant="info">
                  {{ message.availableinitially }} available initially, {{ message.availablenow ? message.availablenow : 0 }} now
                </b-badge>
              </span>
            </div>
            <div v-if="message.deadline" class="text-danger small">
              Deadline: end {{ dateonly(message.deadline) }}
            </div>
            <div v-if="message.deliverypossible" class="text-info small">
              Delivery possible
            </div>
            <MessageHistory :message="message" modinfo display-message-link />
            <div v-if="homegroup && message && message.groups && message.groups.length && homegroup !== message.groups[0].namedisplay" class="small text-danger">
              Possibly should be on {{ homegroup }}
              <span v-if="!homegroupontn">
                but group not on TN
              </span>
            </div>
            <ModMessageDuplicate v-for="(duplicate, index) in duplicates" :key="'duplicate-' + duplicate.id + '-' + index" :message="duplicate" />
            <ModMessageCrosspost v-for="crosspost in crossposts" :key="'crosspost-' + crosspost.id" :message="crosspost" />
            <div v-if="expanded">
              <ModMessageRelated v-for="related in message.related" :key="'related-' + related.id" :message="related" />
            </div>
          </div>
          <div class="d-flex">
            <div v-if="summary && message && message.fromuser" class="text-info font-weight-bold mr-2">
              {{ message.fromuser.displayname }}
            </div>
            <div v-if="expanded" class="d-flex">
              <div class="d-flex flex-column align-content-end">
                <b-btn v-if="!editing" variant="white" @click="startEdit">
                  <v-icon name="pen" /><span class="d-none d-sm-inline"> Edit</span>
                </b-btn>
                <b-btn v-if="message.source === 'Email'" variant="white" class="mt-2" @click="viewSource">
                  <v-icon name="book-open" /><span class="d-none d-sm-inline"> View Email Source</span>
                </b-btn>
                <SpinButton
                  v-if="message.groups[0].collection === 'Approved'"
                  class="mt-2"
                  variant="white"
                  :handler="backToPending"
                  name="reply"
                  label="Back to Pending"
                  confirm
                />
              </div>
              <div class="ml-2">
                <b-btn v-if="summary" variant="white" @click="expanded = !expanded">
                  <v-icon name="caret-up" />
                </b-btn>
              </div>
            </div>
            <div v-else>
              <b-btn variant="white" @click="expanded = !expanded">
                <v-icon name="caret-down" />
              </b-btn>
            </div>
          </div>
        </div>
      </b-card-header>
      <b-card-body v-if="expanded" class="p-1 p-md-2">
        <b-row>
          <b-col cols="12" lg="5">
            <NoticeMessage v-if="message.type === 'Other'" variant="danger" class="mb-2">
              This message needs editing so that we know what kind of post it is.
            </NoticeMessage>
            <div v-if="expanded">
              <NoticeMessage v-if="message.outcomes && message.outcomes.length" class="mb-1">
                {{ message.outcomes[0].outcome.toUpperCase() }}
                at
                {{ datetimeshort(message.outcomes[0].timestamp) }}
              </NoticeMessage>
              <div v-if="message.heldby">
                <NoticeMessage variant="warning" class="mb-2">
                  <p v-if="me.id === message.heldby.id">
                    You held this.  Other people will see a warning to check with
                    you before releasing it.  If you release it, it will stay in Pending.
                  </p>
                  <p v-else>
                    Held by <strong>{{ message.heldby.displayname }}</strong>.  Please check with them before releasing it.
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
                This freegler recently active on groups {{ message.fromuser.activedistance }} miles apart.
              </NoticeMessage>
            </div>
            <NoticeMessage v-if="outsideUK" variant="warning" class="mb-2">
              This message may be from outside the UK ({{ position.lat }}, {{ position.lng }}), which means it might be a scam.  Please check carefully.
            </NoticeMessage>
            <NoticeMessage v-if="message.spamreason" variant="warning" class="mb-2">
              {{ message.spamreason }}
            </NoticeMessage>
            <div v-if="message.microvolunteering && message.microvolunteering.length">
              <ModMessageMicroVolunteering v-for="m in message.microvolunteering" :key="'microvolunteering-' + m.id" :message="message" :microvolunteering="m" class="mb-1" />
              <b-btn v-if="pending" v-b-tooltip.html variant="white" size="sm" title="<p>We ask members to review messages as part of microvolunteering.  When members have proven that they are reliable at microvolunteering, they may be shown Pending messages, so you may see their views here.  This can also show for Pending messages for reposts. <p>You can control whether specific members can do microvolunteering - click on their user id.</p>">
                <v-icon name="info-circle" /> What's this?
              </b-btn>
              <b-btn v-else v-b-tooltip.html variant="white" size="sm" title="<p>We ask members to review messages as part of microvolunteering.  Messages will be sent for review if a couple of members think they shouldn't be on Freegle.</p><p>Consider whether you (or the original poster) can edit the message to improve it.</p><p>You can control whether specific members can do microvolunteering - click on their user id.</p>">
                <v-icon name="info-circle" /> What's this?
              </b-btn>
              <p class="text-muted small" />
            </div>
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
              <div v-if="attachments.length" class="w-100 d-flex flex-wrap">
                <div v-for="attachment in attachments" :key="'attachment-' + attachment.id" :class="{'d-inline':true, 'pr-1': true, addedImage: imageAdded(attachment.id), removeImage: imageRemoved(attachment.id)}">
                  <div class="addedMessage pl-2 font-weight-bold text-success">
                    Added
                  </div>
                  <div class="removedMessage pl-2 font-weight-bold text-warning">
                    Removed
                  </div>
                  <ModPhoto :message="message" :attachment="attachment" />
                </div>
              </div>
              <MessageReplyInfo v-if="!pending || message.replies && message.replies.length" :message="message" class="d-inline" />
            </div>
          </b-col>
          <b-col cols="12" lg="3">
            <MessageMap
              v-if="group && position"
              :centerat="{ lat: group.lat, lng: group.lng }"
              :position="{ lat: position.lat, lng: position.lng }"
              locked
              :boundary="group.polygon"
              :height="150"
            />
          </b-col>
          <b-col cols="12" lg="3">
            <div class="rounded border border-info p-2 d-flex justify-content-between flex-wrap">
              <MessageUserInfo v-if="message.fromuser && message.groups && message.groups.length" :message="message" :user="message.fromuser" modinfo :groupid="message.groups[0].groupid" />
              <div v-else>
                <NoticeMessage v-if="message.myrole === 'Non-member' || message.myrole === 'Member'" variant="danger">
                  Sender only available to mods.
                </NoticeMessage>
                <NoticeMessage v-else variant="danger">
                  Can't identify sender.  Could have been purged but perhaps a bug.
                </NoticeMessage>
              </div>
            </div>
            <div class="d-flex justify-content-between flex-wrap">
              <b-btn v-if="message.fromuser && !message.fromuser.ljuserid && !message.fromuser.tnuserid" variant="link" @click="toggleMail">
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
        <b-row v-if="uploading" class="bg-white">
          <b-col class="p-0">
            <OurFilePond
              imgtype="Message"
              imgflag="message"
              @photoProcessed="photoProcessed"
            />
          </b-col>
        </b-row>
      </b-card-body>
      <b-card-footer v-if="!noactions && expanded">
        <div v-if="message.heldby && message.heldby.id !== myid">
          This message is held by someone else.  The buttons are hidden so you don't click them by accident.  Please
          check with them before releasing the message.
        </div>
        <NoticeMessage v-else-if="!editing && !message.lat && !message.lng" variant="danger" class="mb-2">
          This message needs editing so that we know where it is.
        </NoticeMessage>
        <ModMessageButtons v-if="(!message.heldby || message.heldby && message.heldby.id === myid) && !editing" :message="message" :modconfig="modconfig" :editreview="editreview" :cantpost="membership && membership.ourpostingstatus === 'PROHIBITED'" />
        <b-btn v-if="editing" variant="secondary" class="mr-auto" @click="photoAdd">
          <v-icon name="camera" />&nbsp;Add photo
        </b-btn>
        <b-btn v-if="editing" variant="white" @click="cancelEdit">
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
    <div ref="bottom" />
  </div>
</template>
<script>
import keywords from '@/mixins/keywords.js'
import { SUBJECT_REGEX } from '@/utils/constants'
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
import ModMessageMicroVolunteering from './ModMessageMicroVolunteering'
import twem from '~/assets/js/twem'
import SpinButton from '~/components/SpinButton'
const Highlighter = () => import('vue-highlight-words')
const OurFilePond = () => import('~/components/OurFilePond')

export default {
  name: 'ModMessage',
  components: {
    OurFilePond,
    ModMessageMicroVolunteering,
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
    Highlighter,
    SpinButton
  },
  mixins: [keywords],
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
    },
    next: {
      type: Number,
      required: false,
      default: null
    },
    nextAfterRemoved: {
      type: Number,
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
      editgroup: null,
      uploading: false,
      attachments: [],
      homegroup: null,
      homegroupontn: false,
      historyGroups: {}
    }
  },
  computed: {
    messageGroup() {
      let ret = null

      if (this.message && this.message.groups && this.message.groups.length) {
        ret = this.message.groups[0].groupid
      }

      return ret
    },
    messageHistory() {
      return this.message &&
        this.message.fromuser &&
        this.message.fromuser.messagehistory
        ? this.message.fromuser.messagehistory
        : []
    },
    group() {
      let ret = null

      if (this.messageGroup) {
        ret = this.myGroups.find(g => parseInt(g.id) === this.messageGroup)
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
        (this.position.lng < -16 ||
          this.position.lat < 49 ||
          this.position.lng > 4 ||
          this.position.lat > 64)
      )
    },
    pending() {
      return this.hasCollection('Pending')
    },
    approved() {
      return this.hasCollection('Approved')
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
      let newest = this.message.textbody

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
        const group = this.myGroup(g.groupid)

        if (
          group &&
          (!group.settings ||
            !group.settings.duplicates ||
            group.settings.duplicates.check)
        ) {
          check = true
          const msgtype = this.message.type.toLowerCase()
          ret = Math.min(ret, group.settings.duplicates[msgtype])
        }
      })

      return check ? ret : null
    },
    crossposts() {
      return this.checkHistory(false)
    },
    duplicates() {
      return this.checkHistory(true)
    },
    memberGroupIds() {
      return this.message &&
        this.message.fromuser &&
        this.message.fromuser.memberof
        ? this.message.fromuser.memberof.map(g => g.id)
        : []
    }
  },
  watch: {
    summary(newVal) {
      if (newVal && this.expanded) {
        this.expanded = false
      } else if (!newVal && !this.expanded) {
        this.expanded = true
      }
    },
    nextAfterRemoved(newVal, oldVal) {
      if (newVal === this.message.id) {
        // This message is the one after one which has just been removed.  Make sure the top is visible.
        this.$refs.bottom.scrollIntoView()
        this.$refs.top.scrollIntoView(true)
      }
    },
    messageHistory: {
      immediate: true,
      handler: async function(newVal) {
        // We want to ensure that we have the groups for any message history, so that we can use them in canonSubj.
        const store = this.$store
        const self = this
        await newVal.forEach(async function(message) {
          if (!self.historyGroups[message.groupid]) {
            self.historyGroups[message.groupid] = await store.dispatch(
              'group/fetch',
              {
                id: message.groupid
              }
            )
          }
        })
      }
    }
  },
  mounted() {
    this.expanded = !this.summary
    this.attachments = this.message.attachments
    this.findHomeGroup()
  },
  beforeDestroy() {
    this.$emit('destroy', this.message.id, this.next)
  },
  methods: {
    imageAdded(id) {
      let ret = false

      if (this.editreview && this.message && this.message.edits) {
        this.message.edits.forEach(edit => {
          const n = edit.newimages ? JSON.parse(edit.newimages) : []
          const o = edit.oldimages ? JSON.parse(edit.oldimages) : []
          if (n.includes(id) && !o.includes(id)) {
            ret = true
          }
        })
      }

      return ret
    },
    imageRemoved(id) {
      let ret = false

      if (this.editreview && this.message && this.message.edits) {
        this.message.edits.forEach(edit => {
          const n = edit.newimages ? JSON.parse(edit.newimages) : []
          const o = edit.oldimages ? JSON.parse(edit.oldimages) : []
          if (!n.includes(id) && o.includes(id)) {
            ret = true
          }
        })
      }

      return ret
    },
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

      const attids = []

      for (const att of this.attachments) {
        attids.push(att.id)
      }

      if (this.message.item && this.message.location) {
        // Well-structured message
        await this.$store.dispatch('messages/patch', {
          id: this.message.id,
          msgtype: this.message.type,
          item: this.message.item.name,
          location: this.message.location.name,
          attachments: attids,
          textbody: this.message.textbody
        })
      } else {
        // Not
        await this.$store.dispatch('messages/patch', {
          id: this.message.id,
          msgtype: this.message.type,
          subject: this.message.subject,
          attachments: attids,
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
    canonSubj(message) {
      let subj = message.subject
      const group = this.historyGroups[message.groupid]

      if (group && group.settings && group.settings.keywords) {
        const keyword =
          message.type === 'Offer'
            ? group.settings.keywords.offer
            : group.settings.keywords.wanted
        if (keyword) {
          subj = subj.replace(keyword, message.type.toUpperCase())
        }
      }

      subj = subj.toLocaleLowerCase()

      // Remove any group tag
      subj = subj.replace(/^\[.*?\](.*)/, '$1')

      // Remove duplicate spaces
      subj = subj.replace(/\s+/g, ' ')

      subj = subj.trim()

      const matches = SUBJECT_REGEX.exec(subj)
      if (matches?.length > 2) {
        // Well-formed - remove the location.
        subj = matches[1] + ': ' + matches[2].toLowerCase().trim()
      }

      return subj
    },
    checkHistory(duplicateCheck) {
      const ret = []
      const subj = this.canonSubj(this.message)
      const dupids = []
      const crossids = []

      if (
        this.message &&
        this.message.fromuser &&
        this.message.fromuser.messagehistory
      ) {
        this.message.fromuser.messagehistory.forEach(message => {
          if (
            message.id !== this.message.id &&
            this.duplicateAge &&
            message.daysago <= this.duplicateAge
          ) {
            if (this.canonSubj(message) === subj) {
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
    },
    photoAdd() {
      // Flag that we're uploading.  This will trigger the render of the filepond instance and subsequently the
      // init callback below.
      this.uploading = true
    },
    photoProcessed(imageid, imagethumb, image) {
      // We have uploaded a photo.  Remove the filepond instance.
      this.uploading = false

      this.attachments.push({
        id: imageid,
        paththumb: imagethumb,
        path: image
      })

      this.$store.dispatch('messages/fetch', {
        id: this.message.id
      })
    },
    async findHomeGroup() {
      if (this.message && this.message.lat && this.message.lng) {
        const loc = await this.$store.dispatch('locations/fetch', {
          lat: this.message.lat,
          lng: this.message.lng
        })

        if (loc && loc.groupsnear && loc.groupsnear.length) {
          // The group might not be on TN.
          this.homegroup = loc.groupsnear[0].namedisplay
          this.homegroupontn = loc.groupsnear[0].ontn
        }
      }
    },
    cancelEdit() {
      this.editing = false

      // Fetch the message again to revert any changes.
      this.$store.dispatch('messages/fetch', {
        id: this.message.id
      })
    },
    backToPending() {
      this.$store.dispatch('messages/backToPending', {
        id: this.message.id
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';
@import 'color-vars';

.type {
  max-width: 150px;
}

.location {
  max-width: 250px;
}

.fullsubject {
  display: grid;
  grid-template-columns: 200px 1fr;

  grid-column: 2 / 3;

  label {
    grid-column: 1 / 2;
  }

  @include media-breakpoint-down(md) {
    grid-template-columns: 1fr;
  }
}

.addedMessage,
.removedMessage {
  display: none;
}

.addedImage {
  border: 1px solid $color-green--dark !important;

  .addedMessage {
    display: block !important;
  }
}

.removedImage {
  border: 1px solid $color-red--dark !important;

  .removedMessage {
    display: block !important;
  }
}
</style>
