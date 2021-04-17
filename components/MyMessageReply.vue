<template>
  <div class="border border-success rounded mb-1">
    <div class="layout mb-1">
      <div class="divider" />
      <div class="d-flex flex-column justify-content-start user">
        <div class="d-flex mr-4 clickme" @click="showProfileModal">
          <ProfileImage :image="reply.user.profile.turl" class="m-1 d-none d-md-block" is-thumbnail size="sm" />
          <ProfileImage :image="reply.user.profile.turl" class="m-1 d-block d-md-none" is-thumbnail size="lg" />
          <!-- eslint-disable-next-line -->
            <span class="align-middle mt-1" v-if="unseen > 0"><strong>{{ reply.user.displayname }}</strong></span>
          <!-- eslint-disable-next-line -->
            <span v-else class="align-middle mt-1"><strong>{{ reply.user.displayname }}</strong></span>
        </div>
      </div>
      <div class="badges d-flex flex-wrap justify-content-end">
        <div class="mt-1 mr-1 d-flex flex-column justify-content-center">
          <b-badge v-if="closest" variant="info" pill class="pb-1">
            Nearby
          </b-badge>
        </div>
        <div class="mt-1 mr-1 d-flex flex-column justify-content-center">
          <b-badge v-if="best" variant="info" pill class="pb-1">
            Good rating
          </b-badge>
        </div>
        <div class="mt-1 mr-1 d-flex flex-column justify-content-center">
          <b-badge v-if="quickest" variant="info" pill class="pb-1">
            Quick reply
          </b-badge>
        </div>
        <Supporter v-if="reply.user.supporter" class="mt-1 mr-1 d-flex flex-column justify-content-center" />
      </div>
      <div class="pl-1 flex-shrink-1 ratings d-flex d-md-none justify-content-end">
        <ratings :id="reply.user.id" size="sm" />
      </div>
      <div class="pl-1 flex-shrink-1 ratings d-none d-md-flex justify-content-end w-100 pr-1">
        <ratings :id="reply.user.id" />
      </div>
      <div class="d-flex flex-column justify-content-center wrote">
        <div>
          <div class="text-muted small mb-1">
            <span v-if="reply.lastuserid !== myid">
              last wrote to you
            </span>
            <span v-else>
              you last sent
            </span>
            <span :title="$dayjs(reply.lastdate).toLocaleString()">
              {{ reply.lastdate | timeago }}
            </span>
          </div>
          <span v-if="unseen > 0" class="bg-white snippet text-primary">
            {{ reply.snippet }}...
          </span>
          <span v-else-if="reply.snippet" class="bg-white snippet">
            {{ reply.snippet }}...
          </span>
          <span v-else class="ml-4">
            ...
          </span>
        </div>
      </div>
      <div class="d-flex flex-column justify-content-center ml-2 buttons">
        <div>
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
          <b-btn v-else-if="message.type === 'Offer' && !taken && !withdrawn" variant="primary" class="align-middle mt-1 mb-1" @click="promise">
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
    </div>
    <PromiseModal ref="promise" :messages="[ message ]" :selected-message="message.id" :users="[ reply.user ]" :selected-user="reply.user.id" />
    <RenegeModal ref="renege" :messages="[ message ]" :selected-message="message.id" :users="[ reply.user ]" :selected-user="reply.user.id" />
    <ProfileModal v-if="showProfile && reply && reply.user" :id="reply.user.id" ref="profile" />
  </div>
</template>

<script>
import waitForRef from '@/mixins/waitForRef'
import Supporter from '~/components/Supporter'
import ProfileImage from '~/components/ProfileImage'

const PromiseModal = () => import('./PromiseModal')
const RenegeModal = () => import('./RenegeModal')
const Ratings = () => import('~/components/Ratings')
const ProfileModal = () => import('~/components/ProfileModal')

export default {
  components: {
    Supporter,
    Ratings,
    PromiseModal,
    RenegeModal,
    ProfileImage,
    ProfileModal
  },
  mixins: [waitForRef],
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
    },
    closest: {
      type: Boolean,
      required: false,
      default: false
    },
    best: {
      type: Boolean,
      required: false,
      default: false
    },
    quickest: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      showProfile: false
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
        this.$router.push('/chats/' + this.reply.chatid).catch(() => {})
      }
    },
    promise() {
      this.$refs.promise.show()
    },
    unpromise() {
      this.$refs.renege.show()
    },
    showProfileModal() {
      this.showProfile = true

      this.waitForRef('profile', () => {
        this.$refs.profile.show()
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.snippet {
  border: 1px solid $color-gray--light;
  border-radius: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 4px;
  padding-right: 4px;
  word-wrap: break-word;
  line-height: 1.75;
  font-size: 125%;
  font-weight: bold;
}

.unpromise__slash {
  transform: rotate(180deg);
  color: $color-red;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto auto auto;

  .user {
    grid-row: 1 / 2;
    grid-column: 1 / 3;
    align-self: start;
    font-size: 150%;
  }

  .badges {
    grid-row: 2 / 3;
    grid-column: 2 / 3;
    align-self: end;
  }

  .ratings {
    grid-row: 2 / 3;
    grid-column: 1 / 2;
    justify-self: start;
    margin-top: 0.5rem;
    margin-right: 0.5rem;
  }

  .divider {
    border-bottom: 1px solid $color-gray--light;
    margin-top: 5px;
    margin-bottom: 5px;
    grid-row: 3 / 4;
    grid-column: 1 / 3;
  }

  .wrote {
    grid-row: 4 / 5;
    grid-column: 1 / 3;
    margin-top: 0.5rem;
    margin-left: 0.5rem;
  }

  .buttons {
    grid-row: 5 / 6;
    grid-column: 1 / 3;
    margin-top: 0.25rem;
  }

  @include media-breakpoint-up(md) {
    grid-template-columns: 3fr 1fr;
    grid-template-rows: auto auto auto;

    .divider {
      grid-column: 1 / 4;
      grid-row: 3 / 4;
      margin-top: 5px;
    }

    .user {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }

    .badges {
      grid-row: 2 / 3;
      grid-column: 3 / 4;
    }

    .ratings {
      grid-column: 3 / 4;
      grid-row: 1 / 2;
    }

    .wrote {
      grid-row: 4 / 5;
      grid-column: 1 / 2;
      border-top: 0;
    }

    .buttons {
      grid-column: 2 / 4;
      grid-row: 4 / 5;
      justify-self: end;
      border-top: 0;
    }
  }
}
</style>
