<template>
  <div v-if="me">
    <client-only>
      <div class="chatHolder">
        <b-row class="chatTitle">
          <b-col v-if="chat">
            <b-row>
              <b-col cols="8" class="p-0 pl-1">
                <span v-if="(chat.chattype == 'User2User' || chat.chattype == 'User2Mod')" class="d-inline">
                  <span @click="showInfo">
                    {{ chat.name }}
                  </span>
                </span>
                <span v-else class="d-inline">
                  {{ chat.name }}
                </span>
                <span v-if="unseen">
                  <b-badge variant="danger">{{ unseen }}</b-badge>
                </span>
                <span class="mr-2 d-none d-sm-inline-block">
                  <ratings v-if="otheruser" :key="'otheruser-' + otheruser.id" size="sm" v-bind="otheruser" />
                </span>
              </b-col>
              <b-col cols="4" class="p-0">
                <b-dropdown size="sm" variant="transparent" class="float-right" right>
                  <template slot="button-content" />
                  <b-dropdown-item v-if="chat.chattype === 'User2User'" @click="showhide">
                    Hide this chat
                  </b-dropdown-item>
                  <b-dropdown-item v-if="chat.chattype === 'User2User'" @click="showblock">
                    Block this person
                  </b-dropdown-item>
                  <b-dropdown-item v-if="chat.chattype === 'User2User'" @click="report">
                    Report this person
                  </b-dropdown-item>
                </b-dropdown>
                <span class="float-right pl-1 mr-1 clickme" title="Popup chat window" @click="popup">
                  <v-icon name="window-restore" />
                </span>
                <b-btn variant="white" size="sm" class="float-right mr-2 d-none d-sm-inline-block" @click="markRead">
                  Mark all read
                </b-btn>
              </b-col>
            </b-row>
            <b-row class="d-block d-sm-none">
              <b-col class="p-0 pl-1 mb-1">
                <span>
                  <b-btn variant="white" size="sm" class="float-right" @click="markRead">
                    Mark all read
                  </b-btn>
                  <ratings v-if="otheruser" :key="'otheruser-' + otheruser.id" size="sm" v-bind="otheruser" />
                </span>
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
              <notice-message v-if="userHasReneged" variant="warning">
                <v-icon name="exclamation-triangle" />&nbsp;Things haven't always worked out for this freegler.  That might not be their fault, but please make very clear arrangements.
              </notice-message>
              <notice-message v-if="!spammer && showReplyTime && replytime" class="clickme" @click.native="showInfo">
                <v-icon name="info-circle" />&nbsp;Typically replies in <b>{{ replytime }}</b>.  Click for more info.
              </notice-message>
              <notice-message v-if="spammer" variant="danger">
                This person has been reported as a spammer or scammer.  Please do not talk to them and under no circumstances
                send them any money.
              </notice-message>
              <b-form-textarea
                v-if="!spammer"
                v-model="sendmessage"
                placeholder="Type here..."
                rows="3"
                max-rows="8"
                @keydown.enter.exact.prevent
                @keyup.enter.exact="send"
                @keydown.enter.shift.exact="newline"
                @keydown.alt.shift.exact="newline"
                @focus="markRead"
              />
            </b-col>
          </b-row>
          <b-row v-if="!spammer" class="bg-white">
            <b-col class="p-0 pt-1 pb-1">
              <div class="d-none d-xl-block">
                <span v-if="chat && chat.chattype === 'User2User' && otheruser">
                  <b-btn v-b-tooltip.hover.top variant="white" title="Promise an item to this person" @click="promise">
                    <v-icon name="handshake" />&nbsp;Promise
                  </b-btn>
                  <b-btn v-b-tooltip.hover.top variant="white" title="Send your address" @click="addressBook">
                    <v-icon name="address-book" />&nbsp;Address
                  </b-btn>
                  <b-btn v-b-tooltip.hover.top variant="white" title="Update your availability" @click="availability">
                    <v-icon name="calendar-alt" />&nbsp;Availability
                  </b-btn>
                  <b-btn v-b-tooltip.hover.top variant="white" title="Info about this freegler" @click="showInfo">
                    <v-icon name="info-circle" />&nbsp;Info
                  </b-btn>
                  <b-btn v-b-tooltip.hover.top variant="white" title="Waiting for a reply?  Nudge this freegler." @click="nudge">
                    <v-icon name="bell" />&nbsp;Nudge
                  </b-btn>
                </span>
                <b-btn variant="primary" class="float-right ml-1" @click="send">
                  Send&nbsp;
                  <v-icon v-if="sending" name="sync" class="fa-spin" title="Sending..." />
                  <v-icon v-else name="angle-double-right" title="Send" />
                </b-btn>
                <b-btn variant="white" class="float-right" @click="photoAdd">
                  <v-icon name="camera" />
                </b-btn>
              </div>
              <div class="d-block d-xl-none">
                <span v-if="chat && chat.chattype === 'User2User' && otheruser">
                  <span v-b-tooltip.hover.top title="Promise an item to this person" class="ml-1 mr-2" @click="promise">
                    <v-icon scale="2" name="handshake" />
                  </span>
                  <span v-b-tooltip.hover.top title="Send your address" disabled class="mr-2">
                    <v-icon scale="2" name="address-book" />
                  </span>
                  <span v-b-tooltip.hover.top title="Update your availability" class="mr-2" @click="availability">
                    <v-icon scale="2" name="calendar-alt" />
                  </span>
                  <span v-b-tooltip.hover.top title="Info about this freegler" class="mr-2" @click="showInfo">
                    <v-icon scale="2" name="info-circle" />
                  </span>
                  <span v-b-tooltip.hover.top title="Waiting for a reply?  Nudge this freegler." class="mr-2" @click="nudge">
                    <v-icon scale="2" name="bell" />
                  </span>
                </span>
                <b-btn variant="primary" class="float-right ml-1 mr-1" @click="send">
                  Send
                  <v-icon v-if="sending" name="sync" class="fa-spin" title="Sending..." />
                  <v-icon v-else name="angle-double-right" title="Send" />
                </b-btn>
                <span class="float-right mr-2" @click="photoAdd">
                  <v-icon scale="2" name="camera" />
                </span>
              </div>
            </b-col>
          </b-row>
        </div>
        <PromiseModal ref="promise" :messages="ouroffers" :selected-message="likelymsg ? likelymsg : 0" :users="otheruser ? [ otheruser ] : []" :selected-user="otheruser ? otheruser.id : null" />
        <ProfileModal :id="otheruser ? otheruser.id : null" ref="profile" />
        <AvailabilityModal v-if="me" ref="availabilitymodal" :otheruid="otheruser ? otheruser.id : null" :chatid="chat.id" :thisuid="me.id" />
        <AddressModal ref="addressModal" :choose="true" @chosen="sendAddress" />
        <ChatBlockModal v-if="chat.chattype === 'User2User'" :id="id" ref="chatblock" :user="otheruser" @confirm="block" />
        <ChatHideModal v-if="chat.chattype === 'User2User'" :id="id" ref="chathide" :user="otheruser" @confirm="hide" />
        <ChatReportModal
          v-if="chat.chattype === 'User2User'"
          :id="'report-' + id"
          ref="chatreport"
          :user="otheruser"
          :chatid="chat.id"
          @confirm="hide"
        />
      </div>
    </client-only>
  </div>
</template>
<style scoped lang="scss">
@import 'color-vars';

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
}

.chatFooter {
  order: 4;
  justify-content: flex-end;
  background-color: $color-white;
}

::v-deep .dropdown-toggle {
  color: $color-white;
}
</style>
<script>
import { TooltipPlugin } from 'bootstrap-vue'
import Vue from 'vue'
import InfiniteLoading from 'vue-infinite-loading'
import ChatBlockModal from './ChatBlockModal'
import ChatHideModal from './ChatHideModal'
import twem from '~/assets/js/twem'

// Don't use dynamic imports because it stops us being able to scroll to the bottom after render.
import ChatMessage from '~/components/ChatMessage.vue'
Vue.use(TooltipPlugin)
const OurFilePond = () => import('~/components/OurFilePond')
const Ratings = () => import('~/components/Ratings')
const PromiseModal = () => import('./PromiseModal')
const ProfileModal = () => import('./ProfileModal')
const NoticeMessage = () => import('~/components/NoticeMessage')
const AvailabilityModal = () => import('~/components/AvailabilityModal')
const AddressModal = () => import('~/components/AddressModal')
const ChatReportModal = () => import('~/components/ChatReportModal')

export default {
  components: {
    InfiniteLoading,
    Ratings,
    ChatMessage,
    OurFilePond,
    PromiseModal,
    ProfileModal,
    AvailabilityModal,
    AddressModal,
    NoticeMessage,
    ChatBlockModal,
    ChatHideModal,
    ChatReportModal
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
      lastFetched: new Date(),
      complete: false,
      sendmessage: null,
      uploading: false,
      imageid: null,
      distance: 1000,
      likelymsg: null,
      ouroffers: null,
      sending: false,
      scrolledToBottom: false,
      showReplyTime: true
    }
  },
  computed: {
    me() {
      // The user who is us
      let ret = null
      const me = this.$store.getters['auth/user']
      if (this.chat && this.chat.user1 && me) {
        ret =
          this.chat.user1 &&
          this.chat.user1.id === this.$store.getters['auth/user'].id
            ? this.chat.user1
            : this.chat.user2
      }

      return ret
    },

    chat() {
      const ret = this.$store.getters['chats/get'](this.id)
      return ret
    },

    unseen() {
      let unseen = 0
      const chat = this.$store.getters['chats/get'](this.id)

      if (chat) {
        unseen = chat.unseen
      }

      return unseen
    },

    chatmessages() {
      return this.$store.getters['chatmessages/getMessages'](this.id)
    },

    chatusers() {
      return this.$store.getters['chatmessages/getUsers'](this.id)
    },

    otheruser() {
      // The user who isn't us.
      let ret = null

      if (
        this.chat &&
        this.chat.chattype === 'User2User' &&
        this.chat.user1 &&
        this.$store.getters['auth/user']
      ) {
        ret =
          this.chat.user1 &&
          this.chat.user1.id === this.$store.getters['auth/user'].id
            ? this.chat.user2
            : this.chat.user1
      }

      return ret
    },
    userHasReneged() {
      return this.otheruser
        ? this.$store.getters['user/userHasReneged'](this.otheruser.id)
        : false
    },

    spammer() {
      let ret = false

      if (this.otheruser) {
        ret = this.otheruser.spammer
      }

      return ret
    },

    replytime() {
      let ret = null
      let secs = null

      if (this.otheruser) {
        const user = this.$store.getters['user/get'](this.otheruser.id)
        if (user && user.info) {
          secs = user.info.replytime
        }
      }

      if (secs) {
        if (secs < 60) {
          ret = Math.round(secs) + ' second'
        } else if (secs < 60 * 60) {
          ret = Math.round(secs / 60) + ' minute'
        } else if (secs < 24 * 60 * 60) {
          ret = Math.round(secs / 60 / 60) + ' hour'
        } else {
          ret = Math.round(secs / 60 / 60 / 24) + ' day'
        }

        if (ret.indexOf('1 ') !== 0) {
          ret += 's'
        }
      }

      return ret
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

        setTimeout(() => {
          if (this.$el && this.$el.querySelector) {
            const container = this.$el.querySelector('.chatContent')
            if (container) {
              container.scrollTop = container.scrollHeight
            }
          }
        }, 500)
      }
    }
  },

  async beforeMount() {
    // Components can't use asyncData, so we fetch here.  Can't do this for SSR, but that's fine as we don't
    // need to render this pane on the server.
    await this.$store.dispatch('chats/fetch', {
      id: this.id
    })

    await this.$store.dispatch('chatmessages/clearContext', {
      chatid: this.id
    })

    // Get the user info in case we need to warn about them.
    await this.$store.dispatch('user/fetch', {
      id: this.otheruser,
      info: true
    })

    setTimeout(() => {
      this.showReplyTime = false
    }, 30000)
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
      console.log('load more', currentCount)

      if (!this.scrolledToBottom) {
        // First load.  Scroll to the bottom when things have sorted themselves out.  This helps if we have messages
        // in our store, so we'll render some, otherwise we are stuck at the top until this fetch completes and we
        // scroll to the bottom below.
        this.$nextTick(() => {
          if (this.$el && this.$el.querySelector) {
            const container = this.$el.querySelector('.chatContent')
            container.scrollTop = container.scrollHeight
          }
        })
      }

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
                  if (this.$el && this.$el.querySelector) {
                    const container = this.$el.querySelector('.chatContent')
                    container.scrollTop = container.scrollHeight
                    this.scrolledToBottom = true
                  }
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
      this.sending = false
      this.lastFetched = new Date()

      // Scroll to the bottom so we can see it.
      this.$nextTick(() => {
        if (this.$el && this.$el.querySelector) {
          const container = this.$el.querySelector('.chatContent')
          container.scrollTop = container.scrollHeight
        }
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
    popup() {
      this.$store.dispatch('popupchats/popup', { id: this.chat.id })
    },
    photoAdd() {
      // Flag that we're uploading.  This will trigger the render of the filepond instance and subsequently the
      // processed callback below.
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
    },
    showhide() {
      this.$refs.chathide.show()
    },
    showblock() {
      this.$refs.chatblock.show()
    },
    hide() {
      this.$store.dispatch('chats/hide', {
        id: this.id
      })
    },
    block() {
      this.$store.dispatch('chats/block', {
        id: this.id
      })
    },
    report() {
      this.$refs.chatreport.show()
    }
  }
}
</script>
