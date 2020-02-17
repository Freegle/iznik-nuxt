<template>
  <div>
    <b-card no-body>
      <b-card-header>
        <div class="d-flex justify-content-start flex-wrap">
          <ModChatReviewUser :user="message.fromuser" class="mr-2" />
          <v-icon name="arrow-circle-right" scale="2" class="mt-1 text-info" />
          <ModChatReviewUser :user="message.touser" class="ml-2" />
          <!--          TODO Notes-->
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
            Held by <span v-if="me.id === message.held.id">you</span><b v-else>{{ message.held.name }}</b>
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
            <v-icon name="hashtag" />{{ message.id }}
          </span>
        </div>
      </b-card-body>
      <b-card-footer>
        <d class="d-flex flex-wrap justify-content-start">
          <b-btn variant="white" class="mr-2">
            <v-icon name="comments" /> View Chat
          </b-btn>
          <b-btn v-if="message.held" variant="warning" class="mr-2">
            <v-icon name="play" /> Release
          </b-btn>
          <b-btn v-if="!message.held" variant="primary" class="mr-2">
            <v-icon name="exclamation-triangle" /> Add Mod Message
          </b-btn>
          <b-btn v-if="!message.held" variant="success" class="mr-2">
            <v-icon name="check" /> Approve - Not Spam
          </b-btn>
          <b-btn v-if="!message.held" variant="success" class="mr-2">
            <v-icon name="check" /> Approve and whitelist
          </b-btn>
          <b-btn v-if="!message.held" variant="warning" class="mr-2">
            <v-icon name="pause" /> Hold
          </b-btn>
          <b-btn v-if="!message.held" variant="danger" class="mr-2">
            <v-icon name="trash-alt" /> Delete
          </b-btn>
          <b-btn v-if="!message.held" variant="danger" class="mr-2">
            <v-icon name="ban" /> Spam
          </b-btn>
        </d>
      </b-card-footer>
    </b-card>
  </div>
</template>
<script>
import NoticeMessage from './NoticeMessage'
import ModChatReviewUser from './ModChatReviewUser'
export default {
  components: { ModChatReviewUser, NoticeMessage },
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  computed: {
    me() {
      return this.$store.getters['auth/user']
    }
  }
}
</script>
