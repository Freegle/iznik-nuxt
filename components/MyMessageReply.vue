<template>
  <div>
    <b-row>
      <b-col cols="3" class="text-truncate">
        <b-img-lazy
          rounded="circle"
          thumbnail
          class="profilesm p-0 ml-1 mb-1"
          alt="Profile picture"
          :src="reply.user.profile.turl"
          @error.native="brokenImage"
        />
        <span v-if="unseen > 0">
          <b>{{ reply.user.displayname }}</b>
        </span>
        <span v-else>
          {{ reply.user.displayname }}
        </span>
      </b-col>
      <b-col cols="6">
        <span v-if="unseen > 0">
          <b>{{ reply.snippet }}...</b>
        </span>
        <span v-else>
          {{ reply.snippet }}...
        </span>
        <span class="small text-muted" :title="$dayjs(reply.lastdate).toLocaleString()">
          {{ $dayjs(reply.lastdate).fromNow() }}
        </span>
      </b-col>
      <b-col cols="3">
        <b-btn variant="primary" class="float-right mb-1" @click="chat">
          <b-badge v-if="unseen > 0" variant="danger">
            {{ unseen }}
          </b-badge>
          <span v-else>
            <v-icon name="comments" />
          </span>
          Chat
        </b-btn>
      </b-col>
    </b-row>
  </div>
</template>
<script>
// TODO DESIGN I would like a way of indicating whether the last message, which we have in snippet, came from
// this user or not.  We can work that out, but I can't think of a way of showing that which is obvious.  On the
// other hand, the most important messages will be bold because they're unread, and all bold messages will
// be from the other party, so maybe that's fine as it is.
export default {
  props: {
    reply: {
      type: Object,
      required: true
    },
    chats: {
      type: Array,
      required: true
    }
  },
  computed: {
    unseen() {
      // See if this reply has unseen messages in the chats.
      let unseen = 0

      for (const chat of this.chats) {
        if (chat.id === this.reply.chatid) {
          unseen += chat.unseen
        }
      }

      return unseen
    }
  },
  methods: {
    brokenImage(event) {
      event.target.src = '/static/defaultprofile.png'
    },
    chat() {
      console.log('Open chat', this.reply.chatid)
      this.$store.dispatch('popupchats/popup', { id: this.reply.chatid })
    }
  }
}
</script>
