<template>
  <div :id="'msg-' + id" class="position-relative ml-2 mr-2 ml-sm-0 mr-sm-0" itemscope itemtype="http://schema.org/Product">
    <div itemprop="offers" itemscope itemtype="http://schema.org/Offer" class="d-none">
      <meta itemprop="priceCurrency" content="GBP">
      <span itemprop="price">0</span> |
      <span itemprop="availability">Instock</span>
    </div>
    <span ref="breakpoint" class="d-inline d-sm-none" />
    <template v-if="successful">
      <MessageFreegled :id="id" />
    </template>
    <div
      :class="{
        'p-3': true,
        'mb-3': !expanded,
        messagecard: true,
        freegled : successful,
        offer: type === 'Offer',
        wanted: type === 'Wanted',
        clickme: true,
        promisedfade: ispromised && replyable
      }"
      @click="expand"
    >
      <MessageItemLocation :id="id" :matchedon="matchedon" class="mb-1 header-title" :type="type" :expanded="expanded !== null" />
      <MessageHistory :message="$props" class="mb-1 header-history" :display-message-link="sm()" />
      <client-only>
        <MessageDescription v-if="!expanded" :id="id" :matchedon="matchedon" class="mb-1 header-description" />
      </client-only>
      <div v-if="!successful && !expanded" class="header-expand mt-2 mt-sm-0">
        <b-button variant="primary" class="mt-2" @click="expand">
          {{ expandButtonText }} <v-icon name="angle-double-right" />
        </b-button>
      </div>
      <MessageAttachments
        :id="id"
        :attachments="attachments"
        class="image-wrapper"
        :disabled="successful"
        @click="expandIfNot"
      />
      <div v-if="!simple && expanded && actions" class="d-flex mt-1 header-options">
        <b-button v-if="expanded && !hideClose" size="sm" variant="link" class="grey p-0 mr-4" @click="contract">
          Close post
        </b-button>
        <b-btn
          v-if="expanded.groups && expanded.groups.length"
          variant="link"
          class="grey p-0 mr-4"
          size="sm"
          @click="report"
        >
          Report this post
        </b-btn>
        <b-btn
          v-if="expanded"
          variant="link"
          class="p-0 grey"
          title="Share"
          size="sm"
          @click="share"
        >
          Share
        </b-btn>
      </div>
    </div>
    <div v-if="expanded" class="bg-white mb-3 p-2">
      <notice-message v-if="ispromised && replyable" variant="warning" class="mb-3 mt-1">
        This item has already been promised to someone.  You can still reply - you might get it if someone
        else drops out.
      </notice-message>
      <div class="pl-1 d-flex flex-column justify-content-between">
        <div class="d-flex flex-column">
          <Highlighter
            v-if="matchedon"
            :search-words="[matchedon.word]"
            :text-to-highlight="expanded.textbody"
            highlight-class-name="highlight"
            auto-escape
            class="prewrap"
          /><span v-else class="prewrap">{{ expanded.textbody }}</span>
        </div>
        <div v-if="replyable" class="d-flex justify-content-between flex-wrap mt-2">
          <MessageUserInfo v-if="!simple && expanded.fromuser" :user="expanded.fromuser" :milesaway="milesaway" />
          <MessageReplyInfo :message="expanded" />
        </div>
      </div>
      <div v-if="replyable" class="p-1 pt-3 bg-white">
        <CovidClosed v-if="expanded && expanded.closed" />
        <NoticeMessage v-else-if="milesaway > 25" variant="danger">
          With current COVID-19 restrictions, this is too far away.  Please keep freegling local and stay safe.
        </NoticeMessage>
        <div v-else-if="expanded.fromuser && expanded.fromuser.id === myid" />
        <div v-else>
          <CovidCheckList v-if="!confirmed" class="mt-2" @confirmed="confirmed = true" />
          <div v-if="confirmed">
            <EmailValidator
              v-if="!me && !sent"
              ref="email"
              size="lg"
              label="Your email address:"
              :email.sync="email"
              :valid.sync="emailValid"
            />
            <NoticeMessage v-if="milesaway > 3" variant="warning">
              Remember: essential travel only and stay local. Could you delay the actual collection?
            </NoticeMessage>
            <notice-message v-if="stillAvailable" variant="info" class="mb-1 mt-1">
              You don't need to ask if things are still available.  People can mark OFFERs as promised or TAKEN, and
              you'd see that here.  So just write whatever you would have said next - explain why you'd like it and when
              you could collect.
            </notice-message>
            <b-form-group
              v-if="!sent"
              class="flex-grow-1"
              label="Your reply:"
              :label-for="'replytomessage-' + expanded.id"
              :description="expanded.type === 'Offer' ? 'Interested?  Please explain why you\'d like it and when you can collect.  Always be polite and helpful, and remember it\'s not always first come first served.  If appropriate, ask if it\'s working.' : 'Can you help?  If you have what they\'re looking for, let them know.'"
            >
              <b-form-textarea
                v-if="expanded.type == 'Offer'"
                :id="'replytomessage-' + expanded.id"
                v-model="reply"
                rows="3"
                max-rows="8"
                class="border border-success"
              />
              <b-form-textarea
                v-if="expanded.type == 'Wanted'"
                :id="'replytomessage-' + expanded.id"
                v-model="reply"
                rows="3"
                max-rows="8"
                class="flex-grow-1"
              />
            </b-form-group>
            <BAlert v-if="sent" show variant="info" class="d-block d-sm-none mb-1">
              <p class="font-weight-bold">
                We've sent your message.
              </p>
              <p>
                When they reply, it'll be in the
                <nuxt-link to="/chats">
                  <v-icon name="comments" />&nbsp;Chats
                </nuxt-link> section, and by email.  Check your spam folder!
              </p>
            </BAlert>
            <div v-if="!sent">
              <div v-if="!me">
                <div class="contents">
                  <div>
                    <b-btn size="lg" variant="primary" :disabled="disableSend" @click="registerOrSend">
                      Send your reply
                      <v-icon v-if="replying" name="sync" class="fa-spin" />
                      <v-icon v-else name="angle-double-right" />&nbsp;
                    </b-btn>
                  </div>
                  <div />
                  <MessageMap v-if="showMap" :home="home" :position="{ lat: expanded.lat, lng: expanded.lng }" />
                </div>
                <p class="mt-1">
                  If you're a new freegler then welcome!  You'll get emails.  Name, approx. location, and profile picture are public - you
                  can hide your real name and picture from Settings.  This adds cookies and local
                  storage.  Read <nuxt-link target="_blank" to="/terms">
                    Terms of Use
                  </nuxt-link> and
                  <nuxt-link target="_blank" to="/privacy">
                    Privacy
                  </nuxt-link> for details.
                </p>
              </div>
              <div v-else>
                <div class="contents">
                  <div>
                    <b-form-group
                      class="flex-grow-1"
                      label="Your postcode:"
                      :label-for="'replytomessage-' + expanded.id"
                      description="So that we know how far away you are.  The closer the better."
                    >
                      <Postcode @selected="savePostcode" />
                    </b-form-group>
                    <SettingsPhone
                      v-if="me"
                      label="Your mobile:"
                      description="(Optional)  We'll use this to notify you by text (SMS) so you don't miss replies.  We won't show it to the other freegler."
                      size="lg"
                      hide-remove
                      auto-save
                    />
                    <b-btn size="lg" variant="primary" class="d-none d-md-block" :disabled="disableSend" @click="sendReply">
                      Send your reply
                      <v-icon v-if="replying" name="sync" class="fa-spin" />
                      <v-icon v-else name="angle-double-right" />&nbsp;
                    </b-btn>
                    <b-btn
                      size="lg"
                      variant="primary"
                      class="d-block d-md-none mt-2"
                      block
                      :disabled="disableSend"
                      @click="sendReply"
                    >
                      Send your reply
                      <v-icon v-if="replying" name="sync" class="fa-spin" />
                      <v-icon v-else name="angle-double-right" />&nbsp;
                    </b-btn>
                  </div>
                  <div />
                  <MessageMap v-if="showMap" :home="home" :position="{ lat: expanded.lat, lng: expanded.lng }" class="border border-black rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      v-if="showNewUser"
      id="newUserModal"
      ref="newUserModal"
      ok-only
      ok-title="Close and Continue"
      title="Welcome to Freegle!"
      @hide="sendReply"
    >
      <NewUserInfo :password="newUserPassword" />
    </b-modal>
    <ShareModal v-if="expanded && expanded.url" :id="expanded.id" ref="shareModal" />
    <div class="d-none">
      <ChatButton v-if="expanded && replyToUser" ref="chatbutton" :userid="replyToUser" @sent="sentReply" />
    </div>
    <MessageReportModal v-if="expanded" ref="reportModal" :message="$props" />
  </div>
</template>

<script>
// Need to import rather than async otherwise the render doesn't happen and ref isn't set.
import Vue from 'vue'
import { TooltipPlugin } from 'bootstrap-vue'
import waitForRef from '@/mixins/waitForRef'
import SettingsPhone from '@/components/SettingsPhone'
import MessageAttachments from '@/components/MessageAttachments'
import MessageFreegled from '@/components/MessageFreegled'
import MessageItemLocation from '@/components/MessageItemLocation'
import ChatButton from './ChatButton'
import ShareModal from './ShareModal'
import MessageReportModal from './MessageReportModal'

import MessageReplyInfo from './MessageReplyInfo'
import EmailValidator from './EmailValidator'
import NewUserInfo from './NewUserInfo'
import Postcode from './Postcode'
import MessageMap from './MessageMap'
import CovidClosed from './CovidClosed'
import CovidCheckList from './CovidCheckList'
import twem from '~/assets/js/twem'

const Highlighter = () => import('vue-highlight-words')
const MessageUserInfo = () => import('~/components/MessageUserInfo')
const NoticeMessage = () => import('~/components/NoticeMessage')
const MessageHistory = () => import('~/components/MessageHistory')
const MessageDescription = () => import('~/components/MessageDescription')

Vue.use(TooltipPlugin)

export default {
  components: {
    MessageDescription,
    MessageItemLocation,
    MessageFreegled,
    MessageAttachments,
    SettingsPhone,
    CovidCheckList,
    CovidClosed,
    MessageMap,
    Postcode,
    NewUserInfo,
    EmailValidator,
    MessageReplyInfo,
    ChatButton,
    MessageUserInfo,
    Highlighter,
    ShareModal,
    MessageReportModal,
    NoticeMessage,
    MessageHistory
  },
  mixins: [waitForRef],
  props: {
    id: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      required: false,
      default: null
    },
    subject: {
      type: String,
      default: null
    },
    textbody: {
      type: String,
      default: null
    },
    snippet: {
      type: [String, Boolean],
      default: null
    },
    groups: {
      type: Array,
      default: () => []
    },
    attachments: {
      type: Array,
      default: () => []
    },
    matchedon: {
      type: Object,
      default: null
    },
    successful: {
      type: Boolean,
      required: false,
      default: false
    },
    promised: {
      type: Boolean,
      required: false,
      default: false
    },
    startExpanded: {
      type: Boolean,
      required: false,
      default: false
    },
    hideClose: {
      type: Boolean,
      required: false,
      default: false
    },
    url: {
      type: String,
      required: false,
      default: null
    },
    milesaway: {
      type: Number,
      required: false,
      default: null
    },
    availablenow: {
      type: Number,
      required: false,
      default: 1
    },
    expandButtonText: {
      type: String,
      required: false,
      default: 'See details and reply'
    },
    replyable: {
      type: Boolean,
      required: false,
      default: true
    },
    actions: {
      type: Boolean,
      required: false,
      default: true
    },
    recordView: {
      type: Boolean,
      required: true
    }
  },
  data: function() {
    return {
      reply: null,
      expanded: null,
      replying: false,
      sent: false,
      email: null,
      emailValid: false,
      showNewUser: false,
      newUserPassword: null,
      showAttachments: true,
      confirmed: false
    }
  },
  computed: {
    showMap() {
      return this.expanded.lat || this.expanded.lng
    },
    home() {
      let ret = null

      if (this.me && this.me.settings && this.me.settings.mylocation) {
        ret = {
          lat: this.me.settings.mylocation.lat,
          lng: this.me.settings.mylocation.lng
        }
      }

      return ret
    },
    disableSend() {
      return this.replying || !this.reply || (!this.me && !this.emailValid)
    },
    safeBody() {
      return twem.twem(this.$twemoji, this.textbody)
    },
    replyToSend() {
      let ret = null
      const me = this.$store.getters['auth/user']

      if (me) {
        ret = this.$store.getters['reply/get']
      }

      return ret
    },
    ispromised() {
      return this.promised || (this.expanded && this.expanded.promised)
    },
    stillAvailable() {
      return (
        this.expanded.type === 'Offer' &&
        this.reply &&
        this.reply.length <= 35 &&
        this.reply.toLowerCase().indexOf('still available') !== -1
      )
    },
    replyToUser() {
      const msg = this.$store.getters['messages/get'](this.id)

      if (msg && msg.fromuser) {
        return msg.fromuser.id
      }

      return null
    },
    position() {
      let ret = null

      if (this.message) {
        if (this.message.location) {
          // This is what we put in for message submitted on FD.
          ret = this.message.location
        } else if (this.message.lat || this.message.lng) {
          // This happens for TN messages
          ret = {
            lat: this.message.lat,
            lng: this.message.lng
          }
        }
      }

      return ret
    }
  },
  watch: {
    async replyToSend(newVal, oldVal) {
      // Because of the way persistent store is restored, we might only find out that we have a reply to send post-mount.
      if (newVal && newVal.replyTo === this.id) {
        await this.expand()
        this.reply = newVal.replyMessage
        this.$nextTick(() => {
          this.sendReply()
        })
      }
    }
  },
  async mounted() {
    if (this.startExpanded) {
      this.expanded = this.$store.getters['messages/get'](this.id)
      this.view()
    }

    const reply = this.replyToSend

    if (reply && reply.replyTo === this.id) {
      // Because of the way persistent store is restored, we might or might not know that we have a reply to send here.
      this.reply = reply.replyMessage
      await this.expand()
      this.sendReply()
    }
  },
  methods: {
    async expandIfNot() {
      if (!this.expanded) {
        await this.expand()
      }
    },
    async expand() {
      if (!this.successful) {
        await this.$store.dispatch('messages/fetch', {
          id: this.id
        })

        const message = this.$store.getters['messages/get'](this.id)
        this.expanded = message

        this.view()
      }
    },
    view() {
      if (this.recordView) {
        const me = this.$store.getters['auth/user']

        if (me) {
          this.$store.dispatch('messages/view', {
            id: this.id
          })
        }
      }
    },
    contract(e) {
      this.expanded = null
      e.preventDefault()
      e.stopPropagation()
    },
    share() {
      this.$refs.shareModal.show()
    },
    report() {
      this.$refs.reportModal.show()
    },
    async registerOrSend() {
      // We've got a reply and an email address.  Maybe the email address is a registered user, maybe it's new.  If
      // it's a registered user then we want to force them to sign in.
      //
      // We attempt to register the user.  If the user already exists, then we'll be told about that as an error.
      console.log('Register or send', this.email)

      try {
        const ret = await this.$api.user.add(this.email, false)

        console.log('Returned', ret)
        if (ret.ret === 0 && ret.password) {
          // We registered a new user and logged in.
          console.log('New user')
          await this.$store.dispatch('auth/fetchUser', {
            components: ['me'],
            force: true
          })
          console.log('Fetched')

          // Show the new user modal.
          this.newUserPassword = ret.password
          this.showNewUser = true
          this.waitForRef('newUserModal', () => {
            // Now that we are logged in, we can reply.
            this.$refs.newUserModal.show()

            // Once the modal is closed, we will send the reply.
          })
        } else {
          // If anything else happens, then we call sendReply which will force us to log in.
          this.$store.dispatch('auth/loggedInEver', true)
          this.sendReply()
        }
      } catch (e) {
        // Probably an existing user.  Force ourselves to log in.
        this.$store.dispatch('auth/loggedInEver', true)
        this.sendReply()
      }
    },
    async sendReply() {
      // We have different buttons which display at different screen sizes.  Which of those is visible and hence
      // clicked tells us whether we want to open this chat in a popup or not.
      const popup = this.sm()
      console.log('Send reply', this.reply, popup)

      if (this.reply) {
        const me = this.$store.getters['auth/user']

        if (me && me.id) {
          if (me.id !== this.replyToUser) {
            // We have several things to do:
            // - join a group if need be (doesn't matter which)
            // - post our reply
            // - open the popup chat so they see what happened
            this.replying = true
            const myGroups = this.$store.getters['auth/groups']
            let found = false
            let tojoin = null

            for (const messageGroup of this.groups) {
              tojoin = messageGroup.groupid
              Object.keys(myGroups).forEach(key => {
                const group = myGroups[key]

                if (messageGroup.groupid === group.id) {
                  found = true
                }
              })
            }

            if (!found) {
              // Not currently a member.
              console.log('Need to join')
              await this.$store.dispatch('auth/joinGroup', {
                userid: me.id,
                groupid: tojoin
              })

              // Have to get the message back, because as a non-member we couldn't see who sent it, and therefore
              // who to reply to.
              await this.$store.dispatch('messages/fetch', {
                id: this.id
              })
            }

            // Now create the chat and send the first message.
            console.log('Prepare chat', this.reply, this.id, this.replyToUser)
            this.$nextTick(() => {
              console.log(
                'Now open chat',
                this.reply,
                this.id,
                this.replyToUser,
                popup
              )

              // Open the chat.  We don't want to move from this page - either we'll get a popup chat (so we can
              // see the reply went) or we're on mobile and we'll display the sent message notice.
              this.waitForRef('chatbutton', () => {
                this.$refs.chatbutton.openChat(
                  null,
                  this.reply,
                  this.id,
                  popup,
                  false
                )
              })
            })
          }
        } else {
          // We're not logged in yet.  We need to save the reply and force a sign in.
          //
          // Setting the reply text here will get persisted to the store.  Once we log in and return to the message
          // page, then we will find this in the store and trigger the send of the reply.
          await this.$store.dispatch('reply/set', {
            replyTo: this.id,
            replyMessage: this.reply
          })

          this.$store.dispatch('auth/forceLogin', true)
        }
      }
    },
    async sentReply() {
      // This gets invoked when we have sent a message we passed to ChatButton.
      this.replying = false
      this.sent = true

      // Clear message now sent
      this.reply = null

      await this.$store.dispatch('reply/set', {
        replyTo: null,
        replyMessage: null
      })
    },

    sm() {
      // Detect breakpoint by checking computing style of an element which uses the bootstrap classes
      let ret = false

      if (process.client) {
        const el = this.$refs.breakpoint
        if (el) {
          const display = getComputedStyle(el, null).display

          if (display === 'none') {
            ret = true
          }
        }
      }

      return ret
    },
    async savePostcode(pc) {
      const settings = this.me.settings

      if (!settings.mylocation || settings.mylocation.id !== pc.id) {
        settings.mylocation = pc
        await this.$store.dispatch('auth/saveAndGet', {
          settings: settings
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.card-body {
  padding: 0px;
}

.header--size4 {
  color: $colour-info-fg !important;
  font-weight: bold;
}

.messagePhoto {
  max-height: 600px !important;
}

.highlight {
  color: $color-orange--dark;
  background-color: initial;
  padding: 0;
}

.promisedfade {
  opacity: 0.3;
}

.grey {
  color: $color-gray--base;
}

.messagecard {
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  border: solid 1px $color-gray--light;

  display: grid;
  align-items: start;
  grid-template-columns: minmax(0, 1fr);

  @include media-breakpoint-up(sm) {
    grid-template-columns: 200px 1fr;
    grid-column-gap: 1rem;
    grid-template-rows: max-content max-content max-content auto auto auto;
  }

  &.offer {
    background-color: $color-white;
  }

  &.wanted {
    background-color: $color-green--light;
  }

  .header-title {
    grid-column: 1 / 2;
    grid-row: 1 / 2;

    @include media-breakpoint-up(sm) {
      grid-column: 2 / 3;
    }
  }

  .header-history {
    grid-column: 1 / 2;
    grid-row: 2 / 3;

    @include media-breakpoint-up(sm) {
      grid-column: 2 / 3;
    }
  }

  .header-description {
    grid-column: 1 / 2;
    grid-row: 4 / 5;

    @include media-breakpoint-up(sm) {
      grid-column: 2 / 3;
      grid-row: 3 / 4;
    }
  }

  .image-wrapper {
    position: relative;

    grid-column: 1 / 2;
    grid-row: 3 / 5;

    @include media-breakpoint-up(sm) {
      grid-column: 1 / 2;
      grid-row: 1 / 5;
      width: unset;
    }
  }

  .header-options {
    grid-column: 1 / 2;
    grid-row: 5 / 6;

    @include media-breakpoint-up(sm) {
      grid-column: 1 / 2;
      grid-row: 4 / 5;
    }
  }

  .header-expand {
    grid-column: 1 / 2;
    grid-row: 5 / 6;
    align-self: end;
    justify-self: end;

    @include media-breakpoint-up(sm) {
      grid-column: 2 / 3;
      grid-row: 4 / 5;
    }
  }
}

.contents {
  display: grid;
  grid-template-columns: 2fr 10px 1fr;
  //
  //@include media-breakpoint-down(md) {
  //  grid-template-columns: 1fr 0px 0px;
  //}
}

.freegled {
  filter: contrast(50%);
}

/deep/ label {
  font-weight: bold;
}
</style>
