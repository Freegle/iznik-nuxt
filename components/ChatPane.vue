<template>
  <div>
    <b-alert v-if="notVisible" variant="warning" class="mt-2" show>
      <h3>
        That chat isn't for
        <span v-if="me && me.email">{{ me.email }}</span>
        <span v-else>this account </span>
      </h3>
      <p>
        Please change your email from <nuxt-link to="/settings">
          Settings
        </nuxt-link> if necessary - we'll
        merge your accounts.
      </p>
      <!--      <p>-->
      <!--        This usually happens if you have two different accounts on Freegle.  We can merge your-->
      <!--        accounts or help you work out what's going on.-->
      <!--      </p>-->
      <!--      <div v-if="me && urlid">-->
      <!--        <b-btn variant="success" class="mb-2" size="lg" :href="'mailto:support@ilovefreegle.org?subject=I may have two acounts (#' + myid + ' and #' + urlid + ')&body=Please can you help?  My main email address is...'">-->
      <!--          Contact our Support Volunteers-->
      <!--        </b-btn>-->
      <!--        <p>-->
      <!--          If that button doesn't work then please mail support@ilovefreegle.org.  Please copy and paste this and send it to them:-->
      <!--        </p>-->
      <!--        <p>-->
      <!--          <b>#{{ me.id }} and #{{ urlid }}</b>-->
      <!--        </p>-->
      <!--        <p>-->
      <!--          Please also let them know your main email address.-->
      <!--        </p>-->
      <!--      </div>-->
    </b-alert>
    <div v-else-if="me">
      <client-only>
        <div class="chatHolder">
          <b-row class="chatTitle">
            <b-col v-if="chat">
              <b-row>
                <b-col cols="8" class="p-0 pl-1">
                  <span v-if="(chat.chattype == 'User2User' || chat.chattype == 'User2Mod')" class="d-inline clickme">
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
                    <Ratings v-if="otheruser" :id="otheruserid" :key="'otheruser-' + otheruserid" size="sm" />
                  </span>
                </b-col>
                <b-col cols="4" class="p-0">
                  <b-dropdown v-if="chat.chattype === 'User2User'" size="sm" variant="transparent" class="float-right" right>
                    <template slot="button-content" />
                    <b-dropdown-item @click="showhide">
                      Hide this chat
                    </b-dropdown-item>
                    <b-dropdown-item @click="showblock">
                      Block this person
                    </b-dropdown-item>
                    <b-dropdown-item @click="report">
                      Report this person
                    </b-dropdown-item>
                  </b-dropdown>
                  <span class="float-right pl-1 mr-1 clickme d-none d-sm-inline-block" title="Popup chat window" @click="popup">
                    <v-icon name="window-restore" />
                  </span>
                  <b-btn variant="white" size="sm" class="float-right mr-2 d-none d-sm-inline-block" @click="markRead">
                    Mark read
                  </b-btn>
                </b-col>
              </b-row>
              <b-row class="d-block d-sm-none">
                <b-col class="p-0 pl-1 mb-1">
                  <span>
                    <b-btn variant="white" size="sm" class="float-right" @click="markRead">
                      Mark all read
                    </b-btn>
                    <Ratings v-if="otheruser" :id="otheruserid" :key="'otheruser-' + otheruser.id" size="sm" />
                  </span>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <div v-if="chat" class="chatContent row" infinite-wrapper>
            <infinite-loading
              v-if="otheruser || chat.chattype === 'User2Mod'"
              direction="top"
              force-use-infinite-wrapper="true"
              :distance="distance"
              class="w-100"
              @infinite="loadMore"
            >
              <span slot="no-results" />
              <span slot="no-more" />
              <span slot="spinner" class="w-100">
                <div class="col text-center">
                  <b-img-lazy src="~/static/loader.gif" alt="Loading" />
                </div>
              </span>
            </infinite-loading>
            <ul v-if="otheruser || chat.chattype === 'User2Mod'" class="p-0 pt-1 list-unstyled mb-1 w-100">
              <li v-for="chatmessage in chatmessages" :key="'chatmessage-' + chatmessage.id">
                <ChatMessage
                  v-if="chatmessage"
                  :key="'chatmessage-' + chatmessage.id"
                  :chatmessage="chatmessage"
                  :chat="chat"
                  :otheruser="otheruser"
                  :last="chatmessage.id === chatmessages[chatmessages.length - 1].id"
                />
              </li>
            </ul>
            <div v-if="chatBusy" class="text-center">
              <b-img class="float-right" src="~static/loader.gif" />
            </div>
          </div>
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
                <div v-if="showNotices">
                  <notice-message v-if="badratings" variant="warning" class="clickme" @click.native="showInfo">
                    <p>
                      <v-icon name="exclamation-triangle" />&nbsp;This freegler has a lot of thumbs down ratings.
                      That might not be their fault, but please make very clear arrangements.  If you have a good
                      experience with them, give them a thumbs up.
                    </p>
                    <Ratings v-if="otheruser" :id="otheruserid" :key="'otheruser-' + otheruserid" />
                  </notice-message>
                  <notice-message v-else-if="expectedreply" variant="warning" class="clickme" @click.native="showInfo">
                    <v-icon name="exclamation-triangle" />&nbsp;{{ expectedreply | pluralize(['freegler is', 'freeglers are'], { includeNumber: true }) }} still waiting for them to reply.  You might not hear back from them.
                  </notice-message>
                  <notice-message v-else-if="otheruser && otheruser.hasReneged" variant="warning" class="clickme" @click.native="showInfo">
                    <v-icon name="exclamation-triangle" />&nbsp;Things haven't always worked out for this freegler.  That might not be their fault, but please make very clear arrangements.
                  </notice-message>
                  <notice-message v-if="!spammer && replytime" class="clickme" @click.native="showInfo">
                    <v-icon name="info-circle" />&nbsp;Typically replies in <b>{{ replytime }}</b>.  Click for more info.
                  </notice-message>
                  <notice-message v-if="spammer && spammer.collection !== 'Whitelisted'" variant="danger">
                    This person has been reported as a spammer or scammer.  Please do not talk to them and under no circumstances
                    send them any money.
                  </notice-message>
                </div>
                <b-form-textarea
                  v-if="!spammer"
                  ref="chatarea"
                  v-model="sendmessage"
                  placeholder="Type here..."
                  rows="3"
                  max-rows="8"
                  autocapitalize="none"
                  @keydown.enter.exact.prevent
                  @keyup.enter.exact="send"
                  @keydown.enter.shift.exact.prevent="newline"
                  @keydown.alt.shift.exact.prevent="newline"
                  @focus="markRead"
                />
              </b-col>
            </b-row>
            <b-row v-if="!spammer" class="bg-white">
              <b-col class="p-0 pt-1 pb-1">
                <div class="d-none d-lg-block">
                  <span v-if="chat && chat.chattype === 'User2User' && otheruser">
                    <b-btn v-b-tooltip.hover.top variant="white" title="Promise an item to this person" @click="promise">
                      <v-icon name="handshake" class="fa-fw" />&nbsp;Promise
                    </b-btn>
                    <b-btn v-if="!simple" v-b-tooltip.hover.top variant="white" title="Send your address" @click="addressBook">
                      <v-icon name="address-book" class="fa-fw" />&nbsp;Address
                    </b-btn>
                    <b-btn v-if="!simple" v-b-tooltip.hover.top variant="white" title="Update your availability" @click="availability">
                      <v-icon name="calendar-alt" class="fa-fw" />&nbsp;Availability
                    </b-btn>
                    <b-btn v-b-tooltip.hover.top variant="white" title="Info about this freegler" @click="showInfo">
                      <v-icon name="info-circle" class="fa-fw" />&nbsp;Info
                    </b-btn>
                    <b-btn v-if="!simple" v-b-tooltip.hover.top variant="white" title="Waiting for a reply?  Nudge this freegler." @click="nudge">
                      <v-icon name="bell" class="fa-fw" />&nbsp;Nudge
                    </b-btn>
                  </span>
                  <span v-if="chat && chat.chattype === 'User2Mod'">
                    <b-btn v-b-tooltip.hover.top variant="white" title="Info about this freegler" @click="showInfo">
                      <v-icon name="info-circle" />&nbsp;Info
                    </b-btn>
                    <b-btn v-if="mod" variant="white" @click="spamReport">
                      <v-icon name="ban" /> Spammer
                    </b-btn>
                    <ModSpammerReport v-if="showSpamModal" ref="spamConfirm" :user="otheruser" />
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
                <div class="d-flex d-lg-none justify-content-between align-middle">
                  <div v-if="chat && chat.chattype === 'User2User' && otheruser" v-b-tooltip.hover.top title="Promise an item to this person" class="ml-1 mr-2" @click="promise">
                    <v-icon scale="2" name="handshake" class="fa-mob" />
                    <div class="mobtext">
                      Promise
                    </div>
                  </div>
                  <div
                    v-if="chat && chat.chattype === 'User2User' && otheruser"
                    v-b-tooltip.hover.top
                    title="Send your address"
                    disabled
                    class="mr-2"
                    @click="addressBook"
                  >
                    <v-icon scale="2" name="address-book" class="fa-mob" />
                    <div class="mobtext">
                      Address
                    </div>
                  </div>
                  <div v-if="chat && chat.chattype === 'User2User' && otheruser" v-b-tooltip.hover.top title="Update your availability" class="mr-2" @click="availability">
                    <v-icon scale="2" name="calendar-alt" class="fa-mob" />
                    <div class="mobtext">
                      Available
                    </div>
                  </div>
                  <div v-if="chat && chat.chattype === 'User2User' && otheruser" v-b-tooltip.hover.top title="Info about this freegler" class="mr-2" @click="showInfo">
                    <v-icon scale="2" name="info-circle" class="fa-mob" />
                    <div class="mobtext">
                      Info
                    </div>
                  </div>
                  <div v-if="chat && chat.chattype === 'User2Mod' && mod" v-b-tooltip.hover.top title="Report as spammer" class="mr-2" @click="spamReport">
                    <v-icon scale="2" name="ban" class="fa-mob" />
                    <div class="mobtext">
                      Spammer
                    </div>
                  </div>
                  <div v-if="chat && chat.chattype === 'User2User' && otheruser" v-b-tooltip.hover.top title="Waiting for a reply?  Nudge this freegler." class="mr-2" @click="nudge">
                    <v-icon scale="2" name="bell" class="fa-mob" />
                    <div class="mobtext">
                      Nudge
                    </div>
                  </div>
                  <div class="" @click="photoAdd">
                    <v-icon scale="2" name="camera" class="fa-mob" />
                    <div class="mobtext">
                      Photo
                    </div>
                  </div>
                  <b-btn variant="primary" @click="send">
                    Send
                    <v-icon v-if="sending" name="sync" class="fa-spin" title="Sending..." />
                    <v-icon v-else name="angle-double-right" title="Send" />
                  </b-btn>
                </div>
              </b-col>
            </b-row>
          </div>
          <PromiseModal ref="promise" :messages="ouroffers" :selected-message="likelymsg ? likelymsg : 0" :users="otheruser ? [ otheruser ] : []" :selected-user="otheruser ? otheruser.id : null" />
          <ProfileModal v-if="otheruser" :id="otheruser ? otheruser.id : null" ref="profile" />
          <AvailabilityModal v-if="me && chat" ref="availabilitymodal" :otheruid="otheruser ? otheruser.id : null" :chatid="chat.id" :thisuid="me.id" />
          <AddressModal ref="addressModal" :choose="true" @chosen="sendAddress" />
          <ChatBlockModal v-if="chat && chat.chattype === 'User2User' && otheruser" :id="id" ref="chatblock" :user="otheruser" @confirm="block" />
          <ChatHideModal v-if="chat && chat.chattype === 'User2User' && otheruser" :id="id" ref="chathide" :user="otheruser" @confirm="hide" />
          <ChatReportModal
            v-if="otheruser && chat && chat.chattype === 'User2User'"
            :id="'report-' + id"
            ref="chatreport"
            :user="otheruser"
            :chatid="chat.id"
            @confirm="hide"
          />
          <ChatRSVPModal v-if="RSVP" :id="id" ref="rsvp" :user="otheruser" />
        </div>
      </client-only>
    </div>
  </div>
</template>
<script>
import { TooltipPlugin } from 'bootstrap-vue'
import Vue from 'vue'
import InfiniteLoading from 'vue-infinite-loading'
import ChatBlockModal from './ChatBlockModal'
import ChatHideModal from './ChatHideModal'
import twem from '~/assets/js/twem'
import chatCollate from '@/mixins/chatCollate.js'
import WaitForRef from '@/mixins/waitForRef'

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
const ChatRSVPModal = () => import('~/components/ChatRSVPModal')
const ModSpammerReport = () => import('~/components/ModSpammerReport')

export default {
  components: {
    ModSpammerReport,
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
    ChatReportModal,
    ChatRSVPModal
  },
  mixins: [chatCollate, WaitForRef],
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
      showNotices: true,
      RSVP: false,
      notVisible: false,
      contactGroup: null,
      urlid: null,
      showSpamModal: false
    }
  },
  computed: {
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
      const msgs = this.$store.getters['chatmessages/getMessages'](this.id)
      const ret = this.chatCollate(msgs)
      return ret
    },

    chatusers() {
      return this.$store.getters['chatmessages/getUsers'](this.id)
    },

    otheruserid() {
      // The user who isn't us.
      let ret = null

      if (this.chat && this.me) {
        if (this.chat.chattype === 'User2User' && this.chat.user1 && this.me) {
          ret =
            this.chat.user1 && this.chat.user1.id === this.me.id
              ? this.chat.user2.id
              : this.chat.user1.id
        } else if (
          this.chat.chattype === 'User2Mod' &&
          this.chat.user1 &&
          this.me.id !== this.chat.user1.id
        ) {
          // We are a mod.
          ret = this.chat.user1.id
        }
      }

      return ret
    },

    otheruser() {
      // We get this from the store rather than the chat object, because we fetched it in fetchChat, and
      // that copy has more info, which we need.
      let user = null

      if (this.otheruserid) {
        user = this.$store.getters['user/get'](this.otheruserid)
      }

      return user
    },

    spammer() {
      let ret = false

      if (
        this.otheruser &&
        this.otheruser.spammer &&
        this.otheruser.spammer.collection !== 'Whitelisted'
      ) {
        ret = this.otheruser.spammer
      }

      return ret
    },

    badratings() {
      let ret = false

      if (
        this.otheruser &&
        this.otheruser.info &&
        this.otheruser.info.ratings &&
        this.otheruser.info.ratings.Down > 2 &&
        this.otheruser.info.ratings.Down > 2 * this.otheruser.info.ratings.Up
      ) {
        ret = true
      }

      return ret
    },

    expectedreply() {
      let ret = 0

      if (this.otheruser && this.otheruser.info) {
        ret = this.otheruser.info.expectedreply
      }

      return ret
    },

    replytime() {
      let ret = null
      let secs = null

      if (this.otheruser && this.otheruser.info) {
        secs = this.otheruser.info.replytime
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
    me(newVal, oldVal) {
      if (!oldVal && newVal) {
        this.fetchChat()
      }
    },
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
  created() {
    console.log('Route', this.$route)
    this.urlid = this.$route.query.u
  },

  beforeMount() {
    this.fetchChat()
  },

  async mounted() {
    // We don't want to clear the store, because cached messages make us look zippy.  But there might be new messages
    // since we updated our store. So fetch until we stop finding new messages.
    //
    // We can't rely on infinite scroll because we might already be full.
    await this.$store.dispatch('chatmessages/clearContext', {
      chatid: this.id
    })

    let msgs
    let count

    do {
      msgs = this.$store.getters['chatmessages/getMessages'](this.id)
      count = msgs.length

      await this.$store.dispatch('chatmessages/fetch', {
        chatid: this.id
      })

      msgs = this.$store.getters['chatmessages/getMessages'](this.id)
    } while (msgs.length !== count)
  },

  methods: {
    showInfo() {
      this.waitForRef('profile', () => {
        this.$refs.profile.show()
      })
    },
    availability() {
      this.waitForRef('availabilitymodal', () => {
        this.$refs.availabilitymodal.show()
      })
    },
    loadMore: function($state) {
      const currentCount = this.chatmessages.length

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
      const p = this.$refs.chatarea.selectionStart
      if (p) {
        this.sendmessage =
          this.sendmessage.substring(0, p) +
          '\n' +
          this.sendmessage.substring(p)
      } else {
        this.sendmessage += '\n'
      }
    },
    _updateAfterSend: async function() {
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
      await this.$store.dispatch('chats/fetch', {
        id: this.id
      })
    },

    send: async function() {
      let msg = this.sendmessage

      if (msg) {
        this.sending = true

        // If the current last message in this chat is an "interested" from the other party, then we're going to ask
        // if they expect a reply.
        const RSVP =
          this.chatmessages.length &&
          this.chatmessages[this.chatmessages.length - 1].type ===
            'Interested' &&
          this.chatmessages[this.chatmessages.length - 1].userid !== this.myid

        // Encode up any emojis.
        msg = twem.untwem(msg)

        // Send it
        await this.$store.dispatch('chatmessages/send', {
          roomid: this.id,
          message: msg
        })

        // Clear the message now it's sent.
        this.sendmessage = ''

        await this._updateAfterSend()

        if (RSVP) {
          this.RSVP = true
          this.waitForRef('rsvp', () => {
            this.$refs.rsvp.show()
          })
        }
      }
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

      this.$router.push('/chats')
    },
    block() {
      this.$store.dispatch('chats/block', {
        id: this.id
      })

      this.$router.push('/chats')
    },
    report() {
      this.$refs.chatreport.show()
    },
    async fetchChat() {
      // Components can't use asyncData, so we fetch here.  Can't do this for SSR, but that's fine as we don't
      // need to render this pane on the server.
      await this.$store.dispatch('chats/fetch', {
        id: this.id
      })

      const chat = this.$store.getters['chats/get'](this.id)

      this.notVisible = false

      if (chat) {
        await this.$store.dispatch('chatmessages/clearContext', {
          chatid: this.id
        })

        if (this.otheruserid) {
          // Get the user info in case we need to warn about them.
          await this.$store.dispatch('user/fetch', {
            id: this.otheruserid,
            info: true
          })

          setTimeout(() => {
            this.showNotices = false
          }, 30000)
        }
      } else {
        // Invalid chat id
        this.notVisible = true
      }
    },
    spamReport() {
      this.showSpamModal = true
      this.waitForRef('spamConfirm', () => {
        this.$refs.spamConfirm.show()
      })
    }
  }
}
</script>
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
  z-index: 1000;
}

.chatTitle div {
  background-color: $color-blue--light;
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
  overflow-x: hidden;
}

.chatFooter {
  order: 4;
  justify-content: flex-end;
  background-color: $color-white;
}

::v-deep .dropdown-toggle {
  color: $color-white;
}

.mobtext {
  font-size: 0.6em;
  text-align: center !important;
}

.fa-mob {
  width: 2rem;
  height: 2rem;
  width: 100%;
}
</style>
