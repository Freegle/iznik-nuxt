<template>
  <div>
    <b-row>
      <b-col cols="6" class="text-truncate">
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
      <b-col cols="6">
        <ratings v-bind="reply.user" class="pl-1 pt-1 float-right mt-1 mr-1" size="sm" />
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" xl="6">
        <span v-if="unseen > 0" class="ml-1 bg-white snippet">
          <b>{{ reply.snippet }}...</b>
        </span>
        <span v-else-if="reply.snippet" class="ml-1 bg-white snippet">
          {{ reply.snippet }}...
        </span>
        <span v-else class="ml-1">
          ...
        </span>
        <span class="small text-muted align-middle ml-2" :title="$dayjs(reply.lastdate).toLocaleString()">
          {{ $dayjs(reply.lastdate).fromNow() }}
        </span>
      </b-col>
      <b-col cols="12" xl="6">
        <span class="float-xl-right ml-2 mt-2 mb-2">
          <b-btn v-if="promised" variant="warning" class="align-middle mt-1 mb-1" @click="unpromise">
            <v-icon>
              <v-icon name="handshake" />
              <v-icon
                name="slash"
                style="transform: rotate(180deg)"
                class="red"
              />
            </v-icon>
            Unpromise
          </b-btn>
          <b-btn v-else variant="success" class="align-middle mt-1 mb-1" @click="promise">
            <v-icon name="handshake" /> Promise
          </b-btn>
          <b-btn variant="primary" class="align-middle mt-1 mb-1 mr-1" @click="chat">
            <b-badge v-if="unseen > 0" variant="danger">
              {{ unseen }}
            </b-badge>
            <span v-else>
              <v-icon name="comments" />
            </span>
            Chat
          </b-btn>
        </span>
      </b-col>
    </b-row>
    <PromiseModal ref="promise" :messages="[ message ]" :selected-message="message.id" :users="[ reply.user ]" :selected-user="reply.user.id" />
    <RenegeModal ref="renege" :messages="[ message ]" :selected-message="message.id" :users="[ reply.user ]" :selected-user="reply.user.id" />
  </div>
</template>

<style scoped lang="scss">
@import 'color-vars';

.snippet {
  border: 1px solid $color-gray--light;
  border-radius: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 4px;
  padding-right: 4px;
  word-wrap: break-word;
  line-height: 1.75;
}

.red {
  color: $color-red;
}
</style>
<script>
import 'vue-awesome/icons/handshake'
const PromiseModal = () => import('./PromiseModal')
const RenegeModal = () => import('./RenegeModal')

// TODO DESIGN I would like a way of indicating whether the last message, which we have in snippet, came from
// this user or not.  We can work that out, but I can't think of a way of showing that which is obvious.  On the
// other hand, the most important messages will be bold because they're unread, and all bold messages will
// be from the other party, so maybe that's fine as it is.
// TODO DESIGN Unpromise icon is lame.
const Ratings = () => import('~/components/Ratings')

export default {
  components: {
    Ratings,
    PromiseModal,
    RenegeModal
  },
  props: {
    message: {
      type: Object,
      required: true
    },
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
    },
    promised() {
      if (this.message.promisecount) {
        for (const promise of this.message.promises) {
          console.log('Propmised?', promise.userid, this.reply.user.id)
          if (promise.userid === this.reply.user.id) {
            return true
          }
        }
      }

      return false
    }
  },
  methods: {
    brokenImage(event) {
      event.target.src = '/static/defaultprofile.png'
    },
    chat() {
      console.log('Open chat', this.reply.chatid)
      this.$store.dispatch('popupchats/popup', { id: this.reply.chatid })
    },
    promise() {
      this.$refs.promise.show()
    },
    unpromise() {
      this.$refs.renege.show()
    }
  }
}
</script>
