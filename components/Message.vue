<template>
  <div :id="'msg-' + id" class="position-relative">
    <span ref="breakpoint" class="d-inline d-sm-none" />
    <b-img-lazy v-if="successful" src="~/static/freegled.jpg" class="freegled__image" />
    <b-tooltip v-if="successful" variant="success" :target="'msg-' + id">
      <p v-if="type === 'Offer'">
        Yay, someone took it!
      </p>
      <p v-else>
        Hurray, they got what they were looking for!
      </p>
      <p>
        Don't forget to Mark your posts as TAKEN/RECEIVED from <em>My Posts</em>.
      </p>
    </b-tooltip>
    <b-card class="p-0" variant="success" :class="{ freegled : successful }">
      <b-card-header :class="'pl-2 pr-2 clearfix card-header' + (ispromised && replyable ? ' promisedfade' : '')">
        <b-card-title class="msgsubj mb-1 header--size4 card-header__title" title-tag="h3">
          <Highlighter
            v-if="matchedon"
            :search-words="[matchedon.word]"
            :text-to-highlight="eSubject"
            highlight-class-name="highlight"
            auto-escape
          />
          <span v-else>
            {{ eSubject }}
          </span>
          <b-badge v-if="availablenow > 1" variant="info">
            {{ availablenow }} left
          </b-badge>
        </b-card-title>
        <MessageHistory :message="$props" class="mb-1 card-header__history" :display-message-link="sm()" />
        <div flex-grow-1 class="small mb-1 card-header__description">
          <div v-if="eSnippet && eSnippet !== 'null' && !expanded">
            <b class="snippet black">
              <Highlighter
                v-if="matchedon"
                :search-words="[matchedon.word]"
                :text-to-highlight="eSnippet"
                highlight-class-name="highlight"
                auto-escape
              />
              <span v-else>{{ eSnippet }}</span>
              ...
            </b>
          </div>
          <div v-if="(!eSnippet || eSnippet === 'null') && !expanded">
            <i>There's no description.</i>
          </div>
          <b-button v-if="!successful && !expanded" variant="white" class="mt-2" @click="expand">
            {{ expandButtonText }} <v-icon name="angle-double-right" />
          </b-button>
        </div>
        <button v-if="showAttachments && attachments && attachments.length > 0" class="card-header-image__wrapper p-0 border-0" :disabled="successful" @click="showPhotos">
          <b-badge v-if="attachments.length > 1" class="photobadge" variant="primary">
            {{ attachments.length }} <v-icon name="camera" />
          </b-badge>
          <b-img-lazy
            rounded
            thumbnail
            class="attachment p-0 card-header__image"
            generator-unable-to-provide-required-alt=""
            title="Item picture"
            :src="attachments[0].paththumb"
            @error.native="brokenImage"
          />
        </button>
        <div v-if="!simple && expanded && actions" class="d-flex mt-1 card-header__options">
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
      </b-card-header>
      <b-card-body v-if="expanded" class="pl-1">
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
      </b-card-body>
      <b-card-footer v-if="expanded && replyable" class="p-1 pt-3">
        <CovidClosed v-if="expanded && expanded.closed" />
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
      </b-card-footer>
    </b-card>
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
    <MessagePhotosModal
      v-if="expanded && expanded.attachments && expanded.attachments.length"
      ref="photoModal"
      :message="expanded"
      :subject="subject"
    />
    <ShareModal v-if="expanded && expanded.url" :id="expanded.id" ref="shareModal" />
    <ChatButton v-if="expanded && replyToUser" ref="chatbutton" :userid="replyToUser" class="d-none" @sent="sentReply" />
    <MessageReportModal v-if="expanded" ref="reportModal" :message="$props" />
  </div>
</template>

<script>
// Need to import rather than async otherwise the render doesn't happen and ref isn't set.
import Vue from 'vue'
import { TooltipPlugin } from 'bootstrap-vue'
import ChatButton from './ChatButton'
import ShareModal from './ShareModal'
import MessageReportModal from './MessageReportModal'

import MessageReplyInfo from './MessageReplyInfo'
import EmailValidator from './EmailValidator'
import NewUserInfo from './NewUserInfo'
import MessagePhotosModal from './MessagePhotosModal'
import Postcode from './Postcode'
import MessageMap from './MessageMap'
import CovidClosed from './CovidClosed'
import CovidCheckList from './CovidCheckList'
import twem from '~/assets/js/twem'
import waitForRef from '@/mixins/waitForRef'

const Highlighter = () => import('vue-highlight-words')
const MessageUserInfo = () => import('~/components/MessageUserInfo')
const NoticeMessage = () => import('~/components/NoticeMessage')
const MessageHistory = () => import('~/components/MessageHistory')

Vue.use(TooltipPlugin)

export default {
  components: {
    CovidCheckList,
    CovidClosed,
    MessageMap,
    Postcode,
    MessagePhotosModal,
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
    eSubject() {
      return twem.twem(this.$twemoji, this.subject)
    },
    safeBody() {
      return twem.twem(this.$twemoji, this.textbody)
    },
    eSnippet() {
      let snip = null

      if (this.snippet) {
        snip = twem.twem(this.$emoji, this.snippet)
      }

      return snip
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
      const me = this.$store.getters['auth/user']

      if (me) {
        this.$store.dispatch('messages/view', {
          id: this.id
        })
      }
    },
    contract() {
      this.expanded = null
    },
    async showPhotos() {
      if (!this.expanded) {
        await this.expand()
      }

      this.waitForRef('photoModal', () => {
        this.$refs.photoModal.show()
      })
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
          // We have several things to do:
          // - join a group if need be (doesn't matter which)
          // - post our reply
          // - open the popup chat so they see what happened
          this.replying = true
          const me = this.$store.getters['auth/user']
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
    },
    brokenImage() {
      // If the attachment image is broken, we're best off just hiding it.
      this.showAttachments = false
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

.header--size4.snippet {
  color: $color-black !important;
  font-weight: 500;
}

.messagePhoto {
  max-height: 600px !important;
}

.highlight {
  color: $color-orange--dark;
  background-color: initial;
}

.photobadge {
  right: 10px;
  position: absolute;
  top: 10px;
}

.msgsubj {
  color: $colour-info-fg !important;
}

.highlight {
  padding: 0;
}

.promisedfade {
  opacity: 0.3;
}

.grey {
  color: $color-gray--base;
}

.card-header {
  display: grid;

  align-items: start;
  grid-template-columns: minmax(0, 1fr);

  @include media-breakpoint-up(sm) {
    grid-template-columns: auto max-content;
    grid-template-rows: max-content max-content max-content auto auto;
  }
}

.card-header__title {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

.card-header__history {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}

.card-header__description {
  font-size: 1.2rem;
  line-height: 1.2;

  grid-column: 1 / 2;
  grid-row: 4 / 5;

  @include media-breakpoint-up(sm) {
    grid-column: 1 / 2;
    grid-row: 3 / 4;
  }
}

.card-header-image__wrapper {
  position: relative;

  grid-column: 1 / 2;
  grid-row: 3 / 4;

  @include media-breakpoint-up(sm) {
    grid-column: 2 / 3;
    grid-row: 1 / 5;
  }
}

.card-header__image {
  object-fit: cover;
  width: 100%;
  height: 200px;

  @include media-breakpoint-up(sm) {
    max-height: 150px !important;
    max-width: 150px !important;
    width: 200px;
  }
}

.card-header__options {
  grid-column: 1 / 2;
  grid-row: 5 / 6;

  @include media-breakpoint-up(sm) {
    grid-column: 1 / 2;
    grid-row: 4 / 5;
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

.freegled__image {
  position: absolute;
  width: 225px;
  z-index: 2;
  transform: rotate(15deg);
  top: 30%;

  // Centre the absolute positioned div in it's container
  left: 50%;
  margin-left: -125px;
}
</style>
