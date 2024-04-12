<template>
  <div class="cont bg-white">
    <div v-if="uploading" class="bg-white">
      <OurFilePond
        imgtype="ChatMessage"
        imgflag="chatmessage"
        @photoProcessed="photoProcessed"
      />
    </div>
    <div>
      <div v-if="showNotices && noticesToShow" class="d-flex">
        <div class="flex-grow-1">
          <notice-message v-if="badratings" variant="warning" class="clickme" @click.native="showInfo">
            <p>
              <v-icon name="exclamation-triangle" />&nbsp;This freegler has a lot of thumbs down ratings.
              That might not be their fault, but please make very clear arrangements.  If you have a good
              experience with them, give them a thumbs up.
            </p>
            <Ratings v-if="otheruser" :id="otheruserid" :key="'otheruser-' + otheruserid" />
          </notice-message>
          <notice-message v-else-if="expectedreply" variant="warning" class="clickme" @click.native="showInfo">
            <v-icon name="exclamation-triangle" />&nbsp;{{ expectedreply | pluralize(['freegler is', 'freeglers are'], { includeNumber: true }) }} still waiting for them to reply on here.
          </notice-message>
          <notice-message v-if="spammer && spammer.collection !== 'Whitelisted'" variant="danger">
            This person has been reported as a spammer or scammer.  Please do not talk to them and under no circumstances
            send them any money.  Do not arrange anything by courier.
          </notice-message>
          <ModComments v-if="mod && chat && chat.chattype === 'User2Mod' && otheruser" :user="otheruser" class="mt-1" />
        </div>
        <div class="float-right ml-2 mr-2 mt-2 clickme" title="Hide warnings" @click="showNotices = false">
          <v-icon name="times-circle" scale="1.5" />
        </div>
      </div>
      <b-alert
        v-if="otheruser && showHandoverPrompt"
        variant="info"
        :show="30"
        class="m-0"
        dismissible
        @dismissed="notHandover"
      >
        Looks like you might be agreeing a handover with <strong>{{ otheruser.displayname }}</strong>?
        <div class="d-flex mt-2">
          <b-btn v-b-tooltip.hover.top size="lg" variant="primary" title="Yes, I'm agreeing a handover" @click="promise(discussedDate)">
            Yes, I am
          </b-btn>
          <b-btn
            v-b-tooltip.hover.top
            size="lg"
            variant="secondary"
            title="No, I'm not agreeing a handover"
            class="ml-4"
            @click="notHandover"
          >
            Not now
          </b-btn>
        </div>
        <p class="mt-1">
          Tip: if you're not agreeing it just yet, click <em>Not Now</em> to continue chatting and then click <em>Promise</em> later.
        </p>
      </b-alert>
      <div v-else>
        <label for="chatmessage" class="sr-only">Chat message</label>
        <b-form-textarea
          v-if="enterNewLine && !spammer"
          id="chatmessage"
          ref="chatarea"
          v-model="sendmessage"
          placeholder="Type here..."
          rows="3"
          max-rows="8"
          enterkeyhint="enter"
          @focus="markRead"
        />
        <b-form-textarea
          v-else-if="!spammer"
          id="chatmessage"
          ref="chatarea"
          v-model="sendmessage"
          placeholder="Type here..."
          enterkeyhint="send"
          rows="3"
          max-rows="8"
          autocapitalize="none"
          @keydown.enter.exact.prevent
          @keyup.enter.exact="send"
          @keydown.enter.shift.exact.prevent="newline"
          @keydown.alt.shift.exact.prevent="newline"
          @focus="markRead"
        />
      </div>
    </div>
    <div v-if="!spammer && !showHandoverPrompt" class="bg-white pt-1 pb-1">
      <div class="d-none d-lg-block">
        <span v-if="chat && chat.chattype === 'User2User' && otheruser">
          <b-btn v-b-tooltip.hover.top variant="secondary" title="Promise an item to this person" @click="promise(null)">
            <v-icon name="handshake" class="fa-fw" />&nbsp;Promise
          </b-btn>
          <b-btn v-if="!simple" v-b-tooltip.hover.top variant="secondary" title="Send your address" @click="addressBook">
            <v-icon name="address-book" class="fa-fw" />&nbsp;Address
          </b-btn>
          <b-btn v-if="!simple && !tooSoonToNudge" v-b-tooltip.hover.top variant="secondary" title="Waiting for a reply?  Nudge this freegler." @click="nudge">
            <v-icon name="bell" class="fa-fw" />&nbsp;Nudge
          </b-btn>
          <div
            v-if="!simple && tooSoonToNudge"
            class="d-inline"
            @click="nudgeTooSoon"
          >
            <b-btn
              v-b-tooltip.hover.top
              variant="secondary"
              title="It's too soon to nudge"
            >
              <v-icon name="bell" class="fa-fw" />&nbsp;Nudge
            </b-btn>
          </div>
        </span>
        <span v-if="chat && chat.chattype === 'User2Mod'">
          <b-btn v-if="mod" variant="secondary" @click="spamReport">
            <v-icon name="ban" /> Spammer
          </b-btn>
          <external-link v-if="chat && chat.chattype === 'User2Mod' && mod" href="https://discourse.ilovefreegle.org/c/central" class="nocolor btn btn-secondary">
            <v-icon name="question-circle" /> Central
          </external-link>
          <b-btn
            v-if="chat && chat.chattype === 'User2Mod' && mod"
            v-b-tooltip.hover.top
            title="Ask Support for help"
            variant="secondary"
            @click="confirmReferToSupport"
          >
            <v-icon name="question-circle" /> Refer to Support
          </b-btn>
          <b-btn
            v-if="chat && chat.chattype === 'User2Mod' && mod"
            v-b-tooltip.hover.top
            title="Ask Support for help"
            variant="secondary"
            @click="addAComment"
          >
            <v-icon name="tag" /> Add note
          </b-btn>
        </span>
        <b-btn variant="primary" class="float-right ml-1" @click="send">
          Send&nbsp;
          <v-icon v-if="sending" name="sync" class="fa-spin" title="Sending..." />
          <v-icon v-else name="angle-double-right" title="Send" />
        </b-btn>
        <b-btn variant="secondary" class="float-right" @click="photoAdd">
          <v-icon name="camera" />
        </b-btn>
      </div>
      <div class="d-flex d-lg-none justify-content-between align-middle">
        <div v-if="chat && chat.chattype === 'User2User' && otheruser" v-b-tooltip.hover.top title="Promise an item to this person" class="ml-1 mr-2" @click="promise(null)">
          <v-icon scale="2" name="handshake" class="fa-mob" />
          <div class="mobtext text--smallest">
            Promise
          </div>
        </div>
        <div
          v-if="chat && chat.chattype === 'User2User' && otheruser && !simple"
          v-b-tooltip.hover.top
          title="Send your address"
          disabled
          class="mr-2"
          @click="addressBook"
        >
          <v-icon scale="2" name="address-book" class="fa-mob" />
          <div class="mobtext text--smallest">
            Address
          </div>
        </div>
        <div v-if="chat && chat.chattype === 'User2Mod' && mod" v-b-tooltip.hover.top title="Report as spammer" class="mr-2" @click="spamReport">
          <v-icon scale="2" name="ban" class="fa-mob" />
          <div class="mobtext text--smallest">
            Spammer
          </div>
        </div>
        <div v-if="chat && chat.chattype === 'User2Mod' && mod" v-b-tooltip.hover.top title="Ask on Central for help" class="mr-2">
          <external-link href="https://discourse.ilovefreegle.org/c/central" class="nocolor">
            <v-icon scale="2" name="question-circle" class="fa-mob" />
          </external-link>
          <div class="mobtext text--smallest">
            Central
          </div>
        </div>
        <div v-if="chat && chat.chattype === 'User2Mod' && mod" v-b-tooltip.hover.top title="Ask Support for help" class="mr-2" @click="confirmReferToSupport">
          <v-icon scale="2" name="question-circle" class="fa-mob" />
          <div class="mobtext text--smallest">
            Support
          </div>
        </div>
        <div
          v-if="chat && chat.chattype === 'User2Mod' && mod"
          v-b-tooltip.hover.top
          title="Ask Support for help"
          variant="secondary"
          class="mr-2"
          @click="addAComment"
        >
          <v-icon scale="2" name="tag" class="fa-mob" />
          <div class="mobtext text--smallest">
            Note
          </div>
        </div>
        <div v-if="chat && chat.chattype === 'User2User' && otheruser && !tooSoonToNudge && !simple" v-b-tooltip.hover.top title="Waiting for a reply?  Nudge this freegler." class="mr-2" @click="nudge">
          <v-icon scale="2" name="bell" class="fa-mob" />
          <div class="mobtext text--smallest">
            Nudge
          </div>
        </div>
        <div
          v-if="chat && chat.chattype === 'User2User' && otheruser && tooSoonToNudge && !simple"
          v-b-tooltip.hover.top
          title="It's too soon to nudge."
          class="mr-2"
          @click="nudgeTooSoon"
        >
          <v-icon scale="2" name="bell" class="fa-mob" />
          <div class="mobtext text--smallest">
            Nudge
          </div>
        </div>
        <div class="" @click="photoAdd">
          <v-icon scale="2" name="camera" class="fa-mob" />
          <div class="mobtext text--smallest">
            Photo
          </div>
        </div>
        <b-btn variant="primary" @click="send">
          Send
          <v-icon v-if="sending" name="sync" class="fa-spin" title="Sending..." />
          <v-icon v-else name="angle-double-right" title="Send" />
        </b-btn>
      </div>
    </div>
    <PromiseModal ref="promise" :messages="ouroffers" :selected-message="likelymsg ? likelymsg : 0" :users="otheruser ? [ otheruser ] : []" :selected-user="otheruser ? otheruser.id : null" />
    <ProfileModal v-if="otheruser" :id="otheruser ? otheruser.id : null" ref="profile" />
    <AddressModal ref="addressModal" :choose="true" @chosen="sendAddress" />
    <ChatRSVPModal v-if="RSVP" :id="id" ref="rsvp" :user="otheruser" />
    <NudgeTooSoonWarningModal ref="nudgetoosoonwarning" @confirm="doNudge" />
    <NudgeWarningModal ref="nudgewarning" @confirm="doNudge" />
    <MicroVolunteering v-if="showMicrovolunteering" />
    <ConfirmModal ref="referConfirm" title="Refer this chat to Support?" message="The Support volunteers will have a look at the chat and get back to you by email." @confirm="referToSupport" />
    <ModSpammerReport v-if="showSpamModal" ref="spamConfirm" :user="otheruser" />
    <ModCommentAddModal v-if="addComment" ref="addComment" :user="otheruser" :groupid="chat.groupid" />
  </div>
</template>
<script>
import { TooltipPlugin } from 'bootstrap-vue'
import Vue from 'vue'
import chat from '@/mixins/chat.js'
import chatCollate from '@/mixins/chatCollate.js'
import ExternalLink from './ExternalLink'
import ModComments from './ModComments'
import ConfirmModal from '~/components/ConfirmModal'

// Don't use dynamic imports because it stops us being able to scroll to the bottom after render.
Vue.use(TooltipPlugin)
const OurFilePond = () => import('~/components/OurFilePond')
const Ratings = () => import('~/components/Ratings')
const PromiseModal = () => import('~/components/PromiseModal')
const ProfileModal = () => import('~/components/ProfileModal')
const NoticeMessage = () => import('~/components/NoticeMessage')
const AddressModal = () => import('~/components/AddressModal')
const ModSpammerReport = () => import('~/components/ModSpammerReport')
const ChatRSVPModal = () => import('~/components/ChatRSVPModal')
const NudgeWarningModal = () => import('~/components/NudgeWarningModal')
const NudgeTooSoonWarningModal = () =>
  import('~/components/NudgeTooSoonWarningModal')
const MicroVolunteering = () => import('~/components/MicroVolunteering')
const ModCommentAddModal = () => import('~/components/ModCommentAddModal')

export default {
  components: {
    NudgeTooSoonWarningModal,
    NudgeWarningModal,
    ExternalLink,
    ModComments,
    ModSpammerReport,
    Ratings,
    OurFilePond,
    NoticeMessage,
    PromiseModal,
    ProfileModal,
    AddressModal,
    ChatRSVPModal,
    MicroVolunteering,
    ConfirmModal,
    ModCommentAddModal
  },
  mixins: [chat, chatCollate],
  data: function() {
    return {
      saveTimer: null,
      addComment: false
    }
  },
  computed: {
    noticesToShow() {
      const modtools = this.$store.getters['misc/get']('modtools')

      return (
        this.badratings ||
        this.expectedreply ||
        (this.spammer && this.spammer.collection !== 'Whitelisted') ||
        (modtools &&
          this.otheruser &&
          this.otheruser.comments &&
          this.otheruser.comments.length)
      )
    }
  },
  beforeDestroy() {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer)
    }
  },
  mounted() {
    const modtools = this.$store.getters['misc/get']('modtools')

    if (modtools) {
      const draft = this.$store.getters['misc/get']('chatdraft')

      if (draft?.id === this.id) {
        this.sendmessage = draft.message
      }

      this.saveTimer = setTimeout(this.saveDraft, 5000)
    }
  },
  methods: {
    saveDraft() {
      this.$store.dispatch('misc/set', {
        key: 'chatdraft',
        value: {
          id: this.id,
          message: this.sendmessage
        }
      })

      setTimeout(this.saveDraft, 5000)
    },
    async referToSupport() {
      await this.$store.dispatch('chats/referToSupport', {
        id: this.id
      })
    },
    confirmReferToSupport() {
      this.$refs.referConfirm.show()
    },
    addAComment() {
      this.addComment = true
      this.waitForRef('addComment', () => {
        this.$refs.addComment.show()
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.mobtext {
  text-align: center !important;
}

.fa-mob {
  height: 2rem;
  width: 100%;
}

.nocolor {
  color: initial;
}

.cont {
  display: grid;
  grid-template-columns: auto;
  grid-auto-rows: max-content;
}
</style>
