<template>
  <no-ssr>
    <div class="chatHolder">
      <b-row class="chatTitle">
        <b-col v-if="chat">
          <b-row>
            <b-col cols="6">
              <b-row>
                <b-col>
                  <span v-if="(chat.chattype == 'User2User' || chat.chattype == 'User2Mod')" class="d-inline">
                    <span @click="showInfo">
                      {{ chat.name }}
                    </span>
                  </span>
                  <span v-else class="d-inline">
                    {{ chat.name }}
                  </span>
                  <span v-if="chat.unseen">
                    <b-badge variant="danger">{{ chat.unseen }}</b-badge>
                  </span>
                  <fa icon="lock" title="This chat is private." class="d-inline" />
                </b-col>
              </b-row>
            </b-col>
            <b-col cols="6">
              <fa icon="window-restore" class="float-right mt-1 pl-1 clickme" title="Popup chat window" @click="popup" />
              <b-btn variant="white" size="xs" class="float-right mt-1 mr-2">
                Mark read
              </b-btn>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="chatContent" infinite-wrapper>
        <b-col v-if="chat" :key="'chatmessagelist' + lastFetched">
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
        <b-row>
          <b-col class="p-0">
            <b-form-textarea
              v-model="sendmessage"
              placeholder="Type here..."
              rows="3"
              max-rows="8"
              @keydown.enter.exact.prevent
              @keyup.enter.exact="send"
              @keydown.enter.shift.exact="newline"
              @keydown.alt.shift.exact="newline"
            />
          </b-col>
        </b-row>
        <b-row class="bg-white">
          <b-col class="p-0 pt-1 pb-1">
            <ratings v-if="otheruser" :key="'otheruser-' + (otheruser ? otheruser.id : null)" v-bind="otheruser" />
            <ratings v-else />
            <b-btn v-b-tooltip.hover.top variant="white" title="Promise an item to this person">
              <fa icon="handshake" />&nbsp;Promise
            </b-btn>
            <b-btn v-b-tooltip.hover.top variant="white" title="Send your address">
              <fa icon="address-book" />&nbsp;Address
            </b-btn>
            <b-btn v-b-tooltip.hover.top variant="white" title="Update your availability">
              <fa icon="calendar-alt" />&nbsp;Calendar
            </b-btn>
            <b-btn v-b-tooltip.hover.top variant="white" title="Info about this freegler">
              <fa icon="info-circle" />&nbsp;Info
            </b-btn>
            <b-btn v-b-tooltip.hover.top variant="white" title="Waiting for a reply?  Nudge this freegler.">
              <fa icon="bell" />&nbsp;Nudge
            </b-btn>
            <b-btn variant="primary" class="float-right" @click="send">
              Send&nbsp;&gt;
            </b-btn>
          </b-col>
        </b-row>
      </div>
    </div>
  </no-ssr>
</template>
<style scoped>
.chatpane {
  min-height: 100vh;
}

.chatHolder {
  height: calc(100vh - 74px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
}

.chatFooter {
  order: 4;
  justify-content: flex-end;
  background-color: white;
}
</style>
<script>
// TODO It's painfully slow to switch between chats.  Profiling shows it's spending a lot of time in render code,
// which suggests that I've done something dumb.
// TODO Chat dropdown warnings
// TODO Chat dropdown menu for report etc

import Vue from 'vue'
import Ratings from '~/components/Ratings'
import ChatMessage from '~/components/ChatMessage.vue'
import twem from '~/assets/js/twem'
// import requestIdleCallback from '~/assets/js/requestIdleCallback'

export default {
  components: {
    Ratings,
    ChatMessage
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    lastmsgseen: {
      type: Number,
      required: false,
      default: null
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
    }
  },
  async mounted() {
    // Components can't use asyncData, so we fetch here.  Can't do this for SSR, but that's fine as we don't
    // need to render this pane on the server.
    await this.$store.dispatch('chats/fetch', {
      id: this.id
    })

    const chat = this.$store.getters['chats/get'](this.id)
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
    popup() {
      this.$store.dispatch('popupchats/popup', { id: this.chat.id })
    }
  }
}
</script>
