<template>
  <client-only>
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
                  <v-icon name="lock" title="This chat is private." class="d-inline" />
                </b-col>
              </b-row>
            </b-col>
            <b-col cols="6">
              <v-icon name="window-restore" class="float-right mt-1 pl-1 clickme" title="Popup chat window" @click="popup" />
              <b-btn variant="white" size="xs" class="float-right mt-1 mr-2">
                Mark read
              </b-btn>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="chatContent" infinite-wrapper>
        <b-col v-if="chat">
          <infinite-loading direction="top" force-use-infinite-wrapper="true" :distance="distance" @infinite="loadMore">
            <span slot="no-results" />
            <span slot="no-more" />
            <span slot="spinner">
              <b-img-lazy src="~/static/loader.gif" />
            </span>
          </infinite-loading>
          <ul v-for="(chatmessage, $index) in chatmessages" :key="'chatmessage-' + $index" class="p-0 pt-1 list-unstyled mb-1">
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
          <b-row v-if="chatBusy">
            <b-col>
              <b-img class="float-right" src="~static/loader.gif" />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <div class="chatFooter">
        <b-row v-if="uploading" class="bg-white">
          <b-col class="p-0">
            <OurFilePond
              imgtype="ChatMessage"
              imgflag="chatmessage"
              @photoProcessed="photoProcessed"
            />
          </b-col>
        </b-row>
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
            <b-btn v-b-tooltip.hover.top variant="white" title="Promise an item to this person" @click="promise">
              <v-icon name="handshake" />&nbsp;Promise
            </b-btn>
            <b-btn v-b-tooltip.hover.top variant="white" title="Send your address">
              <v-icon name="address-book" />&nbsp;Address
            </b-btn>
            <b-btn v-b-tooltip.hover.top variant="white" title="Update your availability">
              <v-icon name="calendar-alt" />&nbsp;Calendar
            </b-btn>
            <b-btn v-b-tooltip.hover.top variant="white" title="Info about this freegler">
              <v-icon name="info-circle" />&nbsp;Info
            </b-btn>
            <b-btn v-b-tooltip.hover.top variant="white" title="Waiting for a reply?  Nudge this freegler.">
              <v-icon name="bell" />&nbsp;Nudge
            </b-btn>
            <b-btn variant="primary" class="float-right ml-1" @click="send">
              Send&nbsp;&gt;
            </b-btn>
            <b-btn variant="white" class="float-right" @click="photoAdd">
              <v-icon name="camera" />&nbsp;Photo
            </b-btn>
          </b-col>
        </b-row>
      </div>
    </div>
  </client-only>
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
  overflow-y: auto;
}

.chatFooter {
  order: 4;
  justify-content: flex-end;
  background-color: white;
}
</style>
<script>
// TODO Chat dropdown warnings
// TODO Chat dropdown menu for report etc

import twem from '~/assets/js/twem'
const OurFilePond = () => import('~/components/OurFilePond')
const requestIdleCallback = () => import('~/assets/js/requestIdleCallback')
const Ratings = () => import('~/components/Ratings')
const ChatMessage = () => import('~/components/ChatMessage.vue')

export default {
  components: {
    Ratings,
    ChatMessage,
    OurFilePond
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
      chatBusy: false,
      chat: null,
      chatmessages: [],
      chatusers: [],
      lastFetched: new Date(),
      complete: false,
      sendmessage: null,
      uploading: false,
      imageid: null,
      distance: 1000
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
      let ret = null
      if (
        this.chat &&
        this.chat.chattype === 'User2User' &&
        this.chat.user1 &&
        this.$store.state.auth.user
      ) {
        ret =
          this.chat.user1 &&
          this.chat.user1.id === this.$store.state.auth.user.id
            ? this.chat.user2
            : this.chat.user1
      }

      return ret
    }
  },
  async mounted() {
    // Components can't use asyncData, so we fetch here.  Can't do this for SSR, but that's fine as we don't
    // need to render this pane on the server.
    await this.$store.dispatch('chats/fetch', {
      id: this.id
    })

    const chat = await this.$store.getters['chats/get'](this.id)
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
                // First load.  Scroll to the bottom when things have sorted themselves out.
                requestIdleCallback(() => {
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
    _updateAfterSend: function() {
      this.chatBusy = false

      // The latest messages will be in the store now.  Get them to trigger re-render
      this.chatmessages = Object.values(
        this.$store.getters['chatmessages/getMessages'](this.id)
      )
      this.chatusers = Object.values(
        this.$store.getters['chatmessages/getUsers'](this.id)
      )
      this.lastFetched = new Date()

      // Scroll to the bottom so we can see it.
      // TODO DESIGN This method, here and in ChatPopup doesn't work reliably.  If you add an image which will cause
      // further scroll, then we can called before the image has loaded properly.  We might need to add a placeholder
      // based on the dimensions of the image (which we know at the point we uploaded it).
      requestIdleCallback(() => {
        const container = this.$el.querySelector('.chatContent')
        container.scrollTop = container.scrollHeight
      })

      // Clear the message now it's sent.
      this.sendmessage = ''

      // We also want to trigger an update in the chat list.
      this.$store.dispatch('chats/listChats')
    },

    send: function() {
      let msg = this.sendmessage

      // Encode up any emojis.
      msg = twem.untwem(msg)

      // Send it
      this.chatBusy = true
      this.$store
        .dispatch('chatmessages/send', {
          roomid: this.id,
          message: msg
        })
        .then(this._updateAfterSend)
    },
    popup() {
      this.$store.dispatch('popupchats/popup', { id: this.chat.id })
    },
    photoAdd() {
      // Flag that we're uploading.  This will trigger the render of the filepond instance and subsequently the
      // init callback below.
      this.uploading = true
    },
    async photoProcessed(imageid, imagethumb, image) {
      // We have uploaded a photo.  Remove the filepond instance.
      this.uploading = false

      // Show the chat busy indicator.
      this.chatBusy = true

      // We have uploaded a photo.  Post a chatmessage referencing it.
      await this.$store
        .dispatch('chatmessages/send', {
          roomid: this.id,
          imageid: imageid
        })
        .then(this._updateAfterSend)
    },
    promise() {
      // Find the last message referenced in this chat, if any.  That's the most likely one you'd want to promise,
      // so it should be the default.
      console.log('Promise')
      const lastmsg = null

      for (const msg in this.chatmessages) {
        console.log('Chat message', msg)
      }

      console.log(lastmsg)
    }
  }
}
</script>
