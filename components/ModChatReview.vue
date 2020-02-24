<template>
  <div>
    <b-card no-body>
      <b-card-header>
        <div class="d-flex justify-content-start flex-wrap">
          <ModChatReviewUser :user="message.fromuser" class="mr-2" tag="From: " />
          <v-icon name="arrow-circle-right" scale="2" class="mt-1 text-info" />
          <ModChatReviewUser :user="message.touser" class="ml-2" tag="To: " />
          <!--          TODO Add note -->
          <!--          TODO View Original Email-->
          <!--          TODO View Conversation-->
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
          {{ message.message }}
        </div>
        <div class="d-flex justify-content-between flex-wrap">
          <span>
            {{ message.date | timeago }}
          </span>
          <span>
            <v-icon name="info-circle" /> {{ message.touser.displayname }} is on {{ message.group.namedisplay }}, which you mod.
          </span>
          <span>
            <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ message.id }}
          </span>
        </div>
      </b-card-body>
      <b-card-footer>
        <div class="d-flex flex-wrap justify-content-start">
          <b-btn variant="white" class="mr-2 mb-1" @click="view">
            <v-icon name="comments" /> View Chat
          </b-btn>
          <b-btn v-if="message.held" variant="warning" class="mr-2 mb-1" @click="release">
            <v-icon name="play" /> Release
          </b-btn>
          <b-btn v-if="!message.held" variant="primary" class="mr-2 mb-1" disabled>
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
    <ModChatReviewModal ref="modal" :message="message" />
  </div>
</template>
<script>
import waitForRef from '../mixins/waitForRef'
import NoticeMessage from './NoticeMessage'
import ModChatReviewUser from './ModChatReviewUser'
import ModChatReviewModal from './ModChatReviewModal'

export default {
  components: { ModChatReviewModal, ModChatReviewUser, NoticeMessage },
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
    view() {
      this.waitForRef('modal', () => {
        this.$refs.modal.show()
      })
    }
  }
}
</script>
