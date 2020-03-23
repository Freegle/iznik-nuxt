<template>
  <div>
    <b-card no-body>
      <b-card-header>
        <div class="d-flex justify-content-start flex-wrap">
          <ModChatReviewUser :user="message.fromuser" class="mr-2" tag="From: " :groupid="message.group.id" />
          <v-icon name="arrow-circle-right" scale="2" class="mt-1 text-info" />
          <ModChatReviewUser :user="message.touser" class="ml-2" tag="To: " :groupid="message.group.id" />
          <span v-if="message.msgid">
            TODO View original mail
          </span>
        </div>
      </b-card-header>
      <b-card-body>
        <NoticeMessage v-if="message.held" class="mb-2">
          <span v-if="me.id === message.held.id">
            You held this {{ message.held.timestamp | timeago }}.  Other people will see a warning to check with
            you before releasing it.
          </span>
          <span v-else>
            Held by <b>{{ message.held.name }}</b>
            {{ message.held.timestamp | timeago }}.  Please check with them before releasing it.
          </span>
        </NoticeMessage>
        <div class="rounded bg-white p-2 font-weight-bold border border-warning mb-2">
          <div v-if="message.mesage">
            {{ message.message }}
          </div>
          <div v-else>
            <ChatMessage :chat="message.chatroom" :chatmessage="message" :otheruser="message.userid === message.fromuser.id ? message.touser : message.fromuser" last />
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
            :pov="message.userid"
          />
          <b-btn
            v-if="
              message.held"
            variant="warning"
            class="mr-2 mb-1"
            @click="release"
          >
            <v-icon name="play" /> Release
          </b-btn>
          <b-btn v-if="!message.held" variant="primary" class="mr-2 mb-1" @click="modnote">
            <v-icon name="exclamation-triangle" /> Add Mod Message
          </b-btn>
          <b-btn v-if="!message.held" variant="success" class="mr-2 mb-1" @click="approve">
            <v-icon name="check" /> Approve - Not Spam
          </b-btn>
          <b-btn v-if="!message.held" variant="success" class="mr-2 mb-1" @click="whitelist">
            <v-icon name="check" /> Approve and whitelist
          </b-btn>
          <b-btn v-if="!message.held" variant="warning" class="mr-2 mb-1" @click="hold">
            <v-icon name="pause" /> Hold
          </b-btn>
          <b-btn v-if="!message.held" variant="danger" class="mr-2 mb-1" @click="reject">
            <v-icon name="trash-alt" /> Delete
          </b-btn>
          <b-btn v-if="!message.held" variant="danger" class="mr-2 mb-1" @click="reject">
            <v-icon name="ban" /> Spam
          </b-btn>
        </div>
      </b-card-footer>
    </b-card>
    <ModChatNoteModal v-if="message" ref="modnote" :chatid="message.chatid" />
  </div>
</template>
<script>
import waitForRef from '../mixins/waitForRef'
import NoticeMessage from './NoticeMessage'
import ModChatReviewUser from './ModChatReviewUser'
import ChatMessage from './ChatMessage'
import ModChatNoteModal from './ModChatNoteModal'
import ModChatViewButton from './ModChatViewButton'

export default {
  components: {
    ModChatViewButton,
    ModChatNoteModal,
    ChatMessage,
    ModChatReviewUser,
    NoticeMessage
  },
  mixins: [waitForRef],
  props: {
    message: {
      type: Object,
      required: true
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
    }
  }
}
</script>
