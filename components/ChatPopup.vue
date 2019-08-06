<template>
  <no-ssr>
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
            <b-col v-if="chat">
              <b-row>
                <b-col>
                  <span class="chatname">
                    <span v-if="(chat.chattype == 'User2User' || chat.chattype == 'User2Mod')" class="d-inline">
                      <span @click="showInfo">
                        {{ chat.name }}
                      </span>
                    </span>
                    <span v-else class="d-inline">
                      {{ chat.name }}
                    </span>
                  </span>
                  <span v-if="chat.unseen">
                    <b-badge variant="danger">{{ chat.unseen }}</b-badge>
                  </span>
                  <ratings v-if="otheruser" :key="'otheruser-' + (otheruser ? otheruser.id : null)" size="sm" v-bind="otheruser" class="pl-2" />
                  <span class="pl-3 float-right">
                    <fa icon="window-maximize" size="lg" class="clickme mt-1" title="Maximise chat window" @click="maximise" />
                  </span>
                  <span class="pl-3 float-right">
                    <fa icon="times" size="lg" class="clickme mt-1" title="Hide chat window" @click="hide" />
                  </span>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="chatContent m-0" infinite-wrapper>
            <b-col v-if="chat">
              <infinite-loading direction="top" force-use-infinite-wrapper="true" @infinite="loadMore">
                <span slot="no-results" />
                <span slot="spinner">
                  <b-img-lazy src="~/static/loader.gif" />
                </span>
              </infinite-loading>
              <ul v-for="(chatmessage, $index) in chatmessages" :key="'chatmessage-' + $index" class="p-0 pt-1 list-unstyled mb-1">
                <li v-if="chatmessage">
                  <ChatMessage :key="'chatmessage-' + chatmessage.id" :chatmessage="chatmessage" :chat="chat" :me="me" :otheruser="otheruser" />
                </li>
              </ul>
            </b-col>
          </b-row>
          <div class="chatFooter">
            <b-row class="m-0">
              <b-col class="p-0">
                <b-form-textarea
                  v-model="sendmessage"
                  placeholder="Type here..."
                  rows="2"
                  max-rows="4"
                  @keydown.enter.exact.prevent
                  @keyup.enter.exact="send"
                  @keydown.enter.shift.exact="newline"
                  @keydown.alt.shift.exact="newline"
                />
              </b-col>
            </b-row>
            <b-row class="m-0">
              <b-col class="p-0 pt-1 pb-1">
                <b-btn v-b-tooltip.hover.top variant="white" title="Promise an item to this person" class="ml-1">
                  <fa icon="handshake" />
                </b-btn>
                <b-btn v-b-tooltip.hover.top variant="white" title="Send your address">
                  <fa icon="address-book" />
                </b-btn>
                <b-btn v-b-tooltip.hover.top variant="white" title="Update your availability">
                  <fa icon="calendar-alt" />
                </b-btn>
                <b-btn v-b-tooltip.hover.top variant="white" title="Info about this freegler">
                  <fa icon="info-circle" />
                </b-btn>
                <b-btn v-b-tooltip.hover.top variant="white" title="Waiting for a reply?  Nudge this freegler.">
                  <fa icon="bell" />
                </b-btn>
                <b-btn variant="primary" class="float-right mr-1" @click="send">
                  <fa icon="angle-double-right" title="Send" />
                </b-btn>
              </b-col>
            </b-row>
          </div>
        </div>
      </vue-draggable-resizable>
    </div>
  </no-ssr>
</template>
<style scoped>
.vdr {
  position: absolute;
  top: initial !important;
  left: initial !important;
  bottom: 0;
  z-index: 900;
  background-color: #f3f0da;
  animation: chatIn 2s;
  transform-origin: right bottom;
  background-color: transparent !important;
  display: flex;
}

.chatHolder {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid grey;
}

.chatname {
  /* TODO The ellipsis stuff here isn't working */
  max-width: 100px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  color: white;
}

.shadow {
  box-shadow: 1px 3px 5px 3px rgba(0, 0, 0, 0.6) !important;
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
  background-color: #4895dd;
  color: white;
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
  overflow-y: scroll;
  background-color: rgb(243, 240, 218);
}

.chatFooter {
  order: 4;
  justify-content: flex-end;
  background-color: white;
}
</style>
<script>
import Vue from 'vue'
import VueDraggableResizable from 'vue-draggable-resizable'
import Ratings from '~/components/Ratings'
import ChatMessage from '~/components/ChatMessage.vue'
import twem from '~/assets/js/twem'

export default {
  components: {
    Ratings,
    ChatMessage,
    VueDraggableResizable
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      chat: null,
      chatmessages: [],
      chatusers: [],
      lastFetched: new Date(),
      complete: false,
      sendmessage: null
    }
  },
  computed: {
    me() {
      // The user who is us
      if (this.chat && this.chat.user1 && this.$store.state.auth.user) {
        return this.chat.user1 &&
          this.chat.user1.id === this.$store.state.auth.user.id
          ? this.chat.user1
          : this.chat.user2
      } else {
        return null
      }
    },

    otheruser() {
      // The user who isn't us.
      if (this.chat && this.chat.user1 && this.$store.state.auth.user) {
        return this.chat.user1 &&
          this.chat.user1.id === this.$store.state.auth.user.id
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
      const popups = Object.values(this.$store.getters['popupchats/list']())

      if (popups) {
        for (const popup of popups) {
          const width = popup.width ? parseInt(popup.width) : 320
          right += width

          if (parseInt(popup.id) === this.id) {
            break
          }
        }

        console.log('Right', this.id, right)
      }
      return right
    }
  },
  async mounted() {
    // Components can't use asyncData, so we fetch here.  Can't do this for SSR, but that's fine as we don't
    // need to render this pane on the server.
    const chat = {
      ...(await this.$store.getters['chats/get'](this.id)),
      remember: await this.$store.getters['popupchats/get'](this.id)
    }
    console.log('Fetched chat', chat)
    this.chat = chat
  },
  methods: {
    showInfo() {
      console.log('Show info')
    },
    loadMore: function($state) {
      const currentCount = this.chatmessages.length

      if (this.complete) {
        // This is a bit weird - calling complete() works here to stop the plugin firing, but not lower down in the
        // callback.  And we get the error message about no results, so I've overridden it above to be empty.
        // TODO Figure out what's going on here.  This kinda works but it's hacky.
        $state.complete()
      } else {
        this.busy = true
        this.$store
          .dispatch('chatmessages/fetch', {
            chatid: this.id
          })
          .then(() => {
            try {
              this.chatmessages = Object.values(
                this.$store.getters['chatmessages/getMessages'](this.id)
              )
              this.chatusers = Object.values(
                this.$store.getters['chatmessages/getUsers'](this.id)
              )
              this.lastFetched = new Date()

              if (currentCount === 0) {
                // First load.  Scroll to the bottom.
                // TODO This doesn't work reliably.
                this.$nextTick(() => {
                  const container = this.$el.querySelector('.chatContent')
                  container.scrollTop = container.scrollHeight
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
    send: function() {
      let msg = this.sendmessage

      // Encode up any emojis.
      msg = twem.untwem(msg)

      // Send it
      this.$store
        .dispatch('chatmessages/send', {
          roomid: this.id,
          message: msg
        })
        .then(() => {
          // The latest messages will be in the store now.  Get them to trigger re-render
          this.chatmessages = Object.values(
            this.$store.getters['chatmessages/getMessages'](this.id)
          )
          this.chatusers = Object.values(
            this.$store.getters['chatmessages/getUsers'](this.id)
          )
          this.lastFetched = new Date()

          // Scroll to the bottom so we can see it.
          // TODO This doesn't work reliably.
          Vue.nextTick(() => {
            const container = this.$el.querySelector('.chatContent')
            container.scrollTop = container.scrollHeight
          })

          // Clear the message now it's sent.
          this.sendmessage = ''

          // We also want to trigger an update in the chat list.
          this.$store.dispatch('chats/listChats')
        })
    },
    hide() {
      console.log('Trigger hide')
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
    }
  }
}
</script>
