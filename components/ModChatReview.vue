<template>
  <div>
    <b-card no-body>
      <b-card-header>
        <div class="d-flex justify-content-between flex-wrap">
          <div class="d-flex justify-content-start flex-wrap">
            <ModChatReviewUser :user="message.fromuser" class="mr-2" tag="From: " :groupid="message.group.id" />
            <v-icon name="arrow-circle-right" scale="2" class="mt-1 text-info" />
            <ModChatReviewUser :user="message.touser" class="ml-2" tag="To: " :groupid="message.group.id" />
          </div>
          <b-btn v-if="message.bymailid" size="lg" variant="white" @click="viewOriginal">
            <v-icon name="info-circle" /> View original email
          </b-btn>
        </div>
      </b-card-header>
      <b-card-body>
        <NoticeMessage v-if="message.held" class="mb-2">
          <span v-if="me.id === message.held.id">
            You held this {{ message.held.timestamp | timeago }}.  Other people will see a warning to check with
            you before releasing it.
          </span>
          <span v-else>
            Held by <b><a :href="'mailto:' + message.held.email">{{ message.held.name }}</a></b>
            {{ message.held.timestamp | timeago }}.  Please check with them before releasing it.
          </span>
        </NoticeMessage>
        <div class="rounded bg-white p-2 font-weight-bold border border-warning mb-2">
          <div v-if="message.mesage">
            {{ message.message }}
          </div>
          <div v-else>
            <ChatMessage :chat="message.chatroom" :chatmessage="message" :otheruser="message.fromuser" last :chatusers="chatusers" />
          </div>
        </div>
        <div class="d-flex justify-content-between flex-wrap">
          <span>
            {{ message.date | timeago }}
          </span>
          <span>
            <v-icon name="info-circle" /> {{ message.touser.displayname }} is on {{ message.group.namedisplay }}, which you mod.
            <b-btn :to="'/modtools/members/approved/search/' + message.group.id + '/' + message.touser.id" variant="link" class="p-0 border-0 align-top">
              Go to membership
            </b-btn>
          </span>
          <span>
            <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ message.id }}
          </span>
        </div>
      </b-card-body>
      <b-card-footer>
        <div class="d-flex flex-wrap justify-content-start">
          <ModChatViewButton
            :id="message.chatid"
            :pov="message.touser.id"
          />
          <b-btn
            v-if="message.held"
            variant="warning"
            class="mr-2 mb-1"
            @click="release"
          >
            <v-icon name="play" /> Release
          </b-btn>
          <SpinButton
            v-if="!message.held"
            name="exclamation-triangle"
            label="Add Mod Message"
            variant="warning"
            class="mr-2 mb-1"
            :handler="modnote"
          />
          <SpinButton
            v-if="!message.held"
            name="check"
            label="Approve - Not Spam"
            spinclass="text-white"
            variant="primary"
            class="mr-2 mb-1"
            :handler="approve"
          />
          <SpinButton
            v-if="!message.held"
            name="check"
            label="Approve and whitelist"
            spinclass="text-white"
            variant="primary"
            class="mr-2 mb-1"
            :handler="whitelist"
          />
          <SpinButton
            v-if="!message.held"
            name="pause"
            label="Hold"
            variant="warning"
            class="mr-2 mb-1"
            :handler="hold"
          />
          <SpinButton
            v-if="!message.held"
            name="trash-alt"
            label="Delete"
            variant="danger"
            class="mr-2 mb-1"
            :handler="reject"
          />
          <SpinButton
            v-if="!message.held"
            name="ban"
            label="Spam"
            variant="danger"
            class="mr-2 mb-1"
            :handler="reject"
          />
        </div>
      </b-card-footer>
    </b-card>
    <ModChatNoteModal v-if="message" ref="modnote" :chatid="message.chatid" />
    <ModMessageEmailModal v-if="showOriginal" :id="message.bymailid" ref="original" />
  </div>
</template>
<script>
import waitForRef from '../mixins/waitForRef'
import NoticeMessage from './NoticeMessage'
import ModChatReviewUser from './ModChatReviewUser'
import ChatMessage from './ChatMessage'
import ModChatNoteModal from './ModChatNoteModal'
import ModChatViewButton from './ModChatViewButton'
import SpinButton from './SpinButton'
import chat from '@/mixins/chat.js'
const ModMessageEmailModal = () => import('~/components/ModMessageEmailModal')

export default {
  components: {
    SpinButton,
    ModChatViewButton,
    ModChatNoteModal,
    ChatMessage,
    ModChatReviewUser,
    NoticeMessage,
    ModMessageEmailModal
  },
  mixins: [waitForRef, chat],
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      showOriginal: false
    }
  },
  methods: {
    release() {
      this.$store.dispatch('chatmessages/release', {
        id: this.message.id,
        chatid: null
      })
    },
    hold() {
      this.$store.dispatch('chatmessages/hold', {
        id: this.message.id,
        chatid: null
      })
    },
    approve() {
      this.$store.dispatch('chatmessages/approve', {
        id: this.message.id,
        chatid: null
      })
    },
    reject() {
      this.$store.dispatch('chatmessages/reject', {
        id: this.message.id,
        chatid: null
      })
    },
    whitelist() {
      this.$store.dispatch('chatmessages/whitelist', {
        id: this.message.id,
        chatid: null
      })
    },
    modnote() {
      this.waitForRef('modnote', () => {
        this.$refs.modnote.show()
      })
    },
    viewOriginal() {
      this.showOriginal = true
      this.waitForRef('original', () => {
        this.$refs.original.show()
      })
    }
  }
}
</script>
