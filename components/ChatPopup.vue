<template>
  <div v-if="me">
    <client-only>
      <div :style="'position: fixed; right: ' + right + 'px; bottom: 0'">
        <vue-draggable-resizable
          :handles="['tl']"
          :w="width"
          :h="height"
          :parent="false"
          :draggable="false"
          :active="true"
          :prevent-deactivation="true"
          :min-width="320"
          :min-height="400"
          :style="'right: ' + width"
          @resizing="onResize"
        >
          <div class="shadow chatHolder">
            <b-row class="chatTitle m-0">
              <b-col v-if="chat" class="pr-3">
                <b-row>
                  <b-col class="p-0 pl-3">
                    <span class="chatname text-truncate">
                      <span v-if="(chat.chattype == 'User2User' || chat.chattype == 'User2Mod')">
                        <span @click="showInfo">
                          {{ chat.name }}
                        </span>
                      </span>
                      <span v-else>
                        {{ chat.name }}
                      </span>
                    </span>
                    <span v-if="chat.unseen">
                      <b-badge variant="danger">{{ chat.unseen }}</b-badge>
                    </span>
                    <ratings v-if="otheruser" :key="'otheruser-' + (otheruser ? otheruser.id : null)" size="sm" v-bind="otheruser" class="pl-1 pt-1" />
                    <span class="pl-2 pr-1 float-right" @click="hide">
                      <v-icon name="times" scale="1.5" class="clickme mt-1" title="Hide chat window" />
                    </span>
                    <span class="pl-1 float-right" @click="maximise">
                      <v-icon name="window-maximize" scale="1.5" class="clickme mt-1" title="Maximise chat window" />
                    </span>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-row class="chatContent m-0" infinite-wrapper>
              <b-col v-if="chat">
                <infinite-loading direction="top" force-use-infinite-wrapper="true" :distance="distance" @infinite="loadMore">
                  <span slot="no-results" />
                  <span slot="no-more" />
                  <span slot="spinner">
                    <b-img-lazy src="~/static/loader.gif" alt="Loading" />
                  </span>
                </infinite-loading>
                <ul v-for="chatmessage in chatmessages" :key="'chatmessage-' + chatmessage.id" class="p-0 pt-1 list-unstyled mb-1">
                  <li v-if="chatmessage">
                    <ChatMessage
                      :key="'chatmessage-' + chatmessage.id"
                      :chatmessage="chatmessage"
                      :chat="chat"
                      :me="me"
                      :otheruser="otheruser"
                      :last="chatmessage.id === chatmessages[chatmessages.length - 1].id"
                    />
                  </li>
                </ul>
              </b-col>
            </b-row>
            <div class="chatFooter">
              <b-row class="m-0">
                <b-col class="p-0">
                  <p v-if="spammer" class="bg-danger white p-2 mb-0">
                    This person has been reported as a spammer or scammer.  Please do not talk to them and under no circumstances
                    send them any money.
                  </p>
                  <b-form-textarea
                    v-if="!spammer"
                    v-model="sendmessage"
                    placeholder="Type here..."
                    rows="2"
                    max-rows="4"
                    @keydown.enter.exact.prevent
                    @keyup.enter.exact="send"
                    @keydown.enter.shift.exact="newline"
                    @keydown.alt.shift.exact="newline"
                    @focus="markRead"
                  />
                </b-col>
              </b-row>
              <b-row class="m-0">
                <b-col v-if="!spammer" class="p-0 pt-1 pb-1">
                  <b-btn v-b-tooltip.hover.top variant="white" title="Promise an item to this person" class="ml-1" @click="promise">
                    <v-icon name="handshake" />
                  </b-btn>
                  <b-btn v-b-tooltip.hover.top variant="white" title="Send your address" @click="addressBook">
                    <v-icon name="address-book" />
                  </b-btn>
                  <b-btn v-b-tooltip.hover.top variant="white" title="Update your availability" @click="availability">
                    <v-icon name="calendar-alt" />
                  </b-btn>
                  <b-btn v-b-tooltip.hover.top variant="white" title="Info about this freegler" @click="showInfo">
                    <v-icon name="info-circle" />
                  </b-btn>
                  <b-btn v-b-tooltip.hover.top variant="white" title="Waiting for a reply?  Nudge this freegler." @click="nudge">
                    <v-icon name="bell" />
                  </b-btn>
                  <b-btn variant="primary" class="float-right mr-1" @click="send">
                    <v-icon v-if="sending" name="sync" class="fa-spin" title="Sending..." />
                    <v-icon v-else name="angle-double-right" title="Send" />
                  </b-btn>
                </b-col>
              </b-row>
            </div>
          </div>
        </vue-draggable-resizable>
        <PromiseModal ref="promise" :messages="ouroffers" :selected-message="likelymsg ? likelymsg : 0" :users="otheruser ? [ otheruser ] : []" :selected-user="otheruser ? otheruser.id : null" />
        <ProfileModal :id="otheruser ? otheruser.id : null" ref="profile" />
        <AvailabilityModal ref="availabilitymodal" :otheruid="otheruser ? otheruser.id : null" :thisuid="me.id" />
        <AddressModal ref="addressModal" :choose="true" @chosen="sendAddress" />
      </div>
    </client-only>
  </div>
</template>

<style scoped lang="scss">
@import 'color-vars';

.vdr {
  position: absolute;
  top: initial !important;
  left: initial !important;
  bottom: 0;
  z-index: 900;
  background-color: $color-yellow--base;
  animation: chatIn 2s;
  transform-origin: right bottom;
  background-color: transparent !important;
  display: flex;
}

.chatHolder {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid $color-gray--dark;
}

.chatname {
  display: inline-block;
  max-width: 100px;
  font-weight: bold;
  color: $color-white;
}

.shadow {
  box-shadow: 1px 3px 5px 3px $color-black-opacity-60 !important;
}

@keyframes chatIn {
  0% {
    transform: scale(0.1);
    opacity: 0;
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.chatTitle {
  background-color: $color-blue--light;
  color: $color-white;
  font-weight: bold;
  order: 1;
}

.chatWarning {
  order: 2;
  justify-content: flex-start;
}

.chatContent {
  order: 3;
  justify-content: flex-start;
  flex-grow: 1;
  overflow-y: auto;
  background-color: $color-yellow--base;
}

.chatFooter {
  order: 4;
  justify-content: flex-end;
  background-color: $color-white;
}
</style>

<script>
import { TooltipPlugin } from 'bootstrap-vue'
import Vue from 'vue'
import twem from '~/assets/js/twem'

// Don't use dynamic imports because it stops us being able to scroll to the bottom after render.
import ChatMessage from '~/components/ChatMessage.vue'

Vue.use(TooltipPlugin)
const VueDraggableResizable = () => import('vue-draggable-resizable')
const Ratings = () => import('~/components/Ratings')
const PromiseModal = () => import('./PromiseModal')
const ProfileModal = () => import('./ProfileModal')
const AvailabilityModal = () => import('~/components/AvailabilityModal')
const AddressModal = () => import('~/components/AddressModal')

// TODO DESIGN The maximise icon from font awesome is not obvious.
// TODO MINOR This has a lot of code overlap with ChatPane.  Shame on me.

export default {
  components: {
    VueDraggableResizable,
    Ratings,
    ChatMessage,
    PromiseModal,
    ProfileModal,
    AvailabilityModal,
    AddressModal
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      lastFetched: new Date(),
      complete: false,
      sendmessage: null,
      distance: 1000,
      likelymsg: null,
      ouroffers: null,
      sending: false,
      scrolledToBottom: false
    }
  },
  computed: {
    me() {
      // The user who is us
      if (this.chat && this.chat.user1 && this.$store.getters['auth/user']) {
        return this.chat.user1 &&
          this.chat.user1.id === this.$store.getters['auth/user'].id
          ? this.chat.user1
          : this.chat.user2
      } else {
        return null
      }
    },

    chat() {
      return this.$store.getters['chats/get'](this.id)
    },

    spammer() {
      let ret = false

      if (this.otheruser) {
        ret = this.otheruser.spammer
      }

      return ret
    },

    unseen() {
      const unseen = this.$store.getters['chats/get'](this.id).unseen
      return unseen
    },

    chatmessages() {
      return Object.values(
        this.$store.getters['chatmessages/getMessages'](this.id)
      )
    },

    chatusers() {
      return Object.values(
        this.$store.getters['chatmessages/getUsers'](this.id)
      )
    },

    otheruser() {
      // The user who isn't us.
      if (
        this.chat &&
        this.chat.chattype === 'User2User' &&
        this.chat.user1 &&
        this.$store.getters['auth/user']
      ) {
        return this.chat.user1 &&
          this.chat.user1.id === this.$store.getters['auth/user'].id
          ? this.chat.user2
          : this.chat.user1
      } else {
        return null
      }
    },
    width() {
      return this.chat && this.chat.remember && this.chat.remember.width
        ? this.chat.remember.width
        : 320
    },
    height() {
      return this.chat && this.chat.remember && this.chat.remember.height
        ? this.chat.remember.height
        : 400
    },
    right() {
      let right = 0
      const popups = Object.values(this.$store.getters['popupchats/list'])

      if (popups) {
        for (const popup of popups) {
          const width = popup.width ? parseInt(popup.width) : 320
          right += width

          if (parseInt(popup.id) === this.id) {
            break
          }
        }
      }
      return right
    }
  },
  watch: {
    async unseen(newVal, oldVal) {
      // The unseen count will get changed by reactivity from the store.  If that's the chat we have in our pane
      // then that will trigger this watch, which we can use to pick up the new message.
      if (newVal > oldVal) {
        // New unread message.  Pick it up.
        await this.$store.dispatch('chatmessages/clearContext', {
          chatid: this.id
        })
        await this.$store.dispatch('chatmessages/fetch', {
          chatid: this.id
        })

        this.$nextTick(() => {
          const container = this.$el.querySelector('.chatContent')
          container.scrollTop = container.scrollHeight
        })
      }
    }
  },
  async mounted() {
    // Components can't use asyncData, so we fetch here.  Can't do this for SSR, but that's fine as we don't
    // need to render this pane on the server.
    await this.$store.dispatch('chats/fetch', {
      id: this.id
    })
    const fetched = this.$store.getters['chats/get'](this.id)

    if (!fetched) {
      // This is an invalid chatid.  Remove it to stop it causing problems.
      this.chat = {
        id: this.id
      }
      this.hide()
    }
  },
  methods: {
    showInfo() {
      this.$refs.profile.show()
    },
    availability() {
      this.$refs.availabilitymodal.show()
    },
    loadMore: function($state) {
      const currentCount = this.chatmessages.length

      if (this.complete) {
        $state.complete()
      } else {
        this.busy = true
        this.$store
          .dispatch('chatmessages/fetch', {
            chatid: this.id
          })
          .then(() => {
            try {
              this.lastFetched = new Date()

              if (!this.scrolledToBottom) {
                // First load.  Scroll to the bottom when things have sorted themselves out.
                this.$nextTick(() => {
                  const container = this.$el.querySelector('.chatContent')
                  container.scrollTop = container.scrollHeight
                  this.scrolledToBottom = true
                })
              }

              if (currentCount === this.chatmessages.length) {
                this.complete = true
                $state.complete()
              } else {
                $state.loaded()
              }
              this.busy = false
            } catch (e) {
              console.error(e)
            }
          })
          .catch(e => {
            console.error(e)
            this.busy = false
            $state.complete()
          })
      }
    },
    newline: function() {
      this.sendmessage += '\n'
    },
    _updateAfterSend() {
      this.sending = false
      this.lastFetched = new Date()

      // Scroll to the bottom so we can see it.
      this.$nextTick(() => {
        const container = this.$el.querySelector('.chatContent')
        container.scrollTop = container.scrollHeight
      })

      // We also want to trigger an update in the chat list.
      this.$store.dispatch('chats/fetch', {
        id: this.id
      })
    },
    send: async function() {
      let msg = this.sendmessage
      this.sending = true

      // Encode up any emojis.
      msg = twem.untwem(msg)

      // Send it
      await this.$store.dispatch('chatmessages/send', {
        roomid: this.id,
        message: msg
      })

      this._updateAfterSend()

      // Clear the message now it's sent.
      this.sendmessage = ''
    },
    hide() {
      this.$store.dispatch('popupchats/hide', { id: this.chat.id })
    },
    maximise() {
      this.$store.dispatch('popupchats/hide', { id: this.chat.id })
      this.$router.push('/chats/' + this.chat.id)
    },
    onResize: function(x, y, width, height) {
      this.$store.dispatch('popupchats/popup', {
        id: this.id,
        width: width,
        height: height
      })
      console.log('Stored', width, height)
    },
    promise() {
      // Show the modal first, as eye candy.
      this.$refs.promise.show()

      this.$nextTick(async () => {
        // Get our offers.
        const me = this.$store.getters['auth/user']
        await this.$store.dispatch('messages/clear')
        await this.$store.dispatch('messages/fetchMessages', {
          fromuser: me.id,
          types: ['Offer'],
          hasoutcome: false,
          limit: 100,
          collection: 'AllUser'
        })

        this.ouroffers = this.$store.getters['messages/getAll']

        // Find the last message referenced in this chat, if any.  That's the most likely one you'd want to promise,
        // so it should be the default.
        this.likelymsg = 0

        for (const msg of this.chatmessages) {
          if (msg.refmsg) {
            // Check that it's still in our list of messages
            for (const ours of this.ouroffers) {
              if (ours.id === msg.refmsg.id) {
                this.likelymsg = msg.refmsg.id
              }
            }
          }
        }

        this._updateAfterSend()
      })
    },
    async nudge() {
      await this.$store.dispatch('chatmessages/nudge', {
        roomid: this.id
      })

      this._updateAfterSend()
    },
    async markRead() {
      await this.$store.dispatch('chats/markSeen', {
        id: this.id
      })

      this._updateAfterSend()
    },
    addressBook() {
      this.$refs.addressModal.show()
    },
    sendAddress(id) {
      this.$store
        .dispatch('chatmessages/send', {
          roomid: this.id,
          addressid: id
        })
        .then(this._updateAfterSend)
    }
  }
}
</script>
