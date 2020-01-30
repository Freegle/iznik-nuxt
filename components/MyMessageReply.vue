<template>
  <div>
    <b-row>
      <b-col cols="6" class="text-truncate">
        <span>
          <profile-image :image="reply.user.profile.turl" class="mr-1 mb-1 mt-2 inline" is-thumbnail size="sm" />
          <span v-if="unseen > 0" class="align-middle">
            <b>{{ reply.user.displayname }}</b>
          </span>
          <span v-else class="align-middle">
            {{ reply.user.displayname }}
          </span>
          <span class="align-middle text-muted">
            last wrote to you:
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
          {{ reply.lastdate | timeago }}
        </span>
      </b-col>
      <b-col cols="12" xl="6">
        <span class="float-xl-right ml-2 mt-2 mb-2">
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
          <b-btn variant="primary" class="d-none d-sm-inline-block align-middle mt-1 mb-1 mr-1" @click="chat(true)">
            <b-badge v-if="unseen > 0" variant="danger">
              {{ unseen }}
            </b-badge>
            <span v-else>
              <v-icon name="comments" />
            </span>
            Chat
          </b-btn>
          <b-btn variant="primary" class="d-inline-block d-sm-none align-middle mt-1 mb-1 mr-1" @click="chat(false)">
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
    chat(popup) {
      console.log('Open chat', this.reply.chatid, popup)

      if (popup) {
        this.$store.dispatch('popupchats/popup', { id: this.reply.chatid })
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
