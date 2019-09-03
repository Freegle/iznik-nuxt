<template>
  <div>
    <b-row class="">
      <b-col cols="2" class="text-truncate">
        <span class="">
          <b-img-lazy
            rounded="circle"
            thumbnail
            class="profilesm p-0 ml-1 mb-1 mt-2"
            alt="Profile picture"
            :src="reply.user.profile.turl"
            @error.native="brokenImage"
          />
          <span v-if="unseen > 0" class="align-middle">
            <b>{{ reply.user.displayname }}</b>
          </span>
          <span v-else class="align-middle">
            {{ reply.user.displayname }}
          </span>
        </span>
      </b-col>
      <b-col cols="2">
        <ratings v-bind="reply.user" class="pl-1 pt-1" size="sm mt-2" />
      </b-col>
      <b-col cols="5" class="pt-1" style="line-height: 1">
        <span v-if="unseen > 0" class="">
          <b>{{ reply.snippet }}...</b>
        </span>
        <span v-else class="">
          {{ reply.snippet }}...
        </span>
        <br>
        <span class="small text-muted align-middle" :title="$dayjs(reply.lastdate).toLocaleString()">
          {{ $dayjs(reply.lastdate).fromNow() }}
        </span>
      </b-col>
      <b-col cols="3" class="">
        <b-btn variant="primary" class="float-right align-middle mt-1 mb-1" @click="chat">
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
<style scoped>
</style>
<script>
// TODO DESIGN I would like a way of indicating whether the last message, which we have in snippet, came from
// this user or not.  We can work that out, but I can't think of a way of showing that which is obvious.  On the
// other hand, the most important messages will be bold because they're unread, and all bold messages will
// be from the other party, so maybe that's fine as it is.
const Ratings = () => import('~/components/Ratings')

export default {
  components: {
    Ratings
  },
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
