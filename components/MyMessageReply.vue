<template>
  <div class="border border-success rounded mb-1">
    <div class="d-flex justify-content-between flex-wrap">
      <div class="d-flex align-content-start mb-1 flex-grow-1">
        <ProfileImage :image="reply.user.profile.turl" class="m-1" is-thumbnail size="sm" />
        <div class="text-truncate">
          <!-- eslint-disable-next-line -->
          <span  class="align-middle" v-if="unseen > 0"><b>{{ reply.user.displayname }}</b></span>
          <!-- eslint-disable-next-line -->
          <span v-else class="align-middle"><b>{{ reply.user.displayname }}</b></span>
          <span v-if="reply.lastuserid !== myid" class="align-middle text-muted">
            last wrote to you:
          </span>
          <span v-else class="align-middle text-muted">
            you last sent:
          </span>
          <br>
          <span v-if="unseen > 0" class="bg-white snippet text-primary">
            {{ reply.snippet }}...
          </span>
          <span v-else-if="reply.snippet" class="bg-white snippet">
            {{ reply.snippet }}...
          </span>
          <span v-else class="ml-4">
            ...
          </span>
          <span class="small text-muted align-middle ml-2" :title="$dayjs(reply.lastdate).toLocaleString()">
            {{ reply.lastdate | timeago }}
          </span>
        </div>
      </div>
      <ratings :id="reply.user.id" class="pl-1 pt-1 mt-1 mr-2 flex-shrink-1" />
      <div class="pt-1 flex-shrink-1 ml-2">
        <b-btn v-if="promised && !taken && !withdrawn" variant="warning" class="align-middle mt-1 mb-1" @click="unpromise">
          <v-icon>
            <v-icon name="handshake" />
            <v-icon
              name="slash"
              class="unpromise__slash"
            />
          </v-icon>
          Unpromise
        </b-btn>
        <b-btn v-else-if="message.type === 'Offer' && !taken && !withdrawn" variant="success" class="align-middle mt-1 mb-1" @click="promise">
          <v-icon name="handshake" /> Promise
        </b-btn>
        <b-btn variant="secondary" class="d-none d-sm-inline-block align-middle mt-1 mb-1 mr-1" @click="chat(true)">
          <b-badge v-if="unseen > 0" variant="danger">
            {{ unseen }}
          </b-badge>
          <span v-else>
            <v-icon name="comments" />
          </span>
          Chat
        </b-btn>
        <b-btn variant="secondary" class="d-inline-block d-sm-none align-middle mt-1 mb-1 mr-1" @click="chat(false)">
          <b-badge v-if="unseen > 0" variant="danger">
            {{ unseen }}
          </b-badge>
          <span v-else>
            <v-icon name="comments" />
          </span>
          Chat
        </b-btn>
      </div>
    </div>
    <PromiseModal ref="promise" :messages="[ message ]" :selected-message="message.id" :users="[ reply.user ]" :selected-user="reply.user.id" />
    <RenegeModal ref="renege" :messages="[ message ]" :selected-message="message.id" :users="[ reply.user ]" :selected-user="reply.user.id" />
  </div>
</template>

<script>
import ProfileImage from '~/components/ProfileImage'
const PromiseModal = () => import('./PromiseModal')
const RenegeModal = () => import('./RenegeModal')
const Ratings = () => import('~/components/Ratings')

export default {
  components: {
    Ratings,
    PromiseModal,
    RenegeModal,
    ProfileImage
  },
  props: {
    message: {
      type: Object,
      required: true
    },
    taken: {
      type: Boolean,
      required: false,
      default: false
    },
    received: {
      type: Boolean,
      required: false,
      default: false
    },
    withdrawn: {
      type: Boolean,
      required: false,
      default: false
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
          if (promise.userid === this.reply.user.id) {
            return true
          }
        }
      }

      return false
    }
  },
  methods: {
    async chat(popup) {
      // We might have closed off the chat, in which case it will no longer appear in our list.
      const chats = Object.values(this.$store.getters['chats/list'])
      let found = false
      for (const chat of chats) {
        if (parseInt(chat.id) === parseInt(this.reply.chatid)) {
          found = true
        }
      }

      if (!found) {
        // We did close it, so we need to reopen it.
        await this.$store.dispatch('chats/openChatToUser', {
          userid: this.reply.user.id
        })
      }

      if (popup) {
        await this.$store.dispatch('popupchats/popup', {
          id: this.reply.chatid
        })
      } else {
        this.$router.push('/chats/' + this.reply.chatid)
      }
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

.unpromise__slash {
  transform: rotate(180deg);
  color: $color-red;
}
</style>
