<template>
  <div>
    <span ref="breakpoint" class="d-inline d-sm-none" />
    <b-card class="p-0 mb-1" variant="success">
      <b-card-header :class="'pl-2 pr-2 clearfix card-header' + (ispromised ? ' promisedfade' : '')">
        <b-card-title class="msgsubj mb-0 header--size4 card-header__title" title-tag="h3">
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
        </b-card-title>
        <MessageHistory :message="$props" class="card-header__history" :display-message-link="sm()" />
        <div flex-grow-1 class="small card-header__description">
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
          <b-button v-if="!expanded" variant="white" class="mt-1" @click="expand">
            See details and reply <v-icon name="angle-double-right" />
          </b-button>
        </div>
        <div v-if="attachments && attachments.length > 0" class="clickme card-header-image__wrapper" @click="showPhotos">
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
          />
        </div>
        <div v-if="!simple && expanded" class="d-flex justify-content-between mt-1 card-header__options">
          <b-button v-if="expanded && !hideClose" size="sm" variant="link" class="grey" @click="contract">
            Close post
          </b-button>
          <b-btn
            v-if="expanded.groups && expanded.groups.length"
            variant="link"
            class="mr-2 grey"
            size="sm"
            @click="report"
          >
            Report this post
          </b-btn>
          <b-btn
            v-if="expanded"
            variant="white"
            class="mr-1"
            title="Share"
            size="sm"
            @click="share"
          >
            <v-icon name="share-alt" />
          </b-btn>
        </div>
      </b-card-header>
      <b-card-body v-if="expanded" class="pl-1">
        <notice-message v-if="ispromised" variant="warning" class="mb-3 mt-1">
          This item has already been promised to someone.  You can still reply - you might get it if someone
          else drops out.
        </notice-message>

        <p class="prewrap pl-1">
          <Highlighter
            v-if="matchedon"
            :search-words="[matchedon.word]"
            :text-to-highlight="expanded.textbody"
            highlight-class-name="highlight"
            auto-escape
          /><span v-else>{{ expanded.textbody }}</span>
        </p>

        <div v-if="!simple" class="d-flex justify-content-between">
          <MessageUserInfo v-if="expanded.fromuser" :user="expanded.fromuser" :milesaway="milesaway" class="flex-grow-1" />
          <MessageReplyInfo :message="expanded" />
        </div>
      </b-card-body>
      <b-card-footer v-if="expanded" class="p-1 pt-3">
        <NoticeMessage v-if="sent" variant="info" class="d-block d-sm-none mb-1">
          We've sent your message.  You can see replies in the
          <nuxt-link to="/chats">
            <v-icon name="comments" /> Chats
          </nuxt-link> section.
        </NoticeMessage>
        <EmailValidator
          v-if="!me"
          ref="email"
          size="lg"
          label="Your email address:"
          :email.sync="email"
          :valid.sync="emailValid"
        />
        <b-form-group
          class="flex-grow-1"
          label="Your reply:"
          :label-for="'replytomessage-' + expanded.id"
          :description="expanded.type === 'Offer' ? 'Interested?  Please explain why you\'d like it and when you can collect.  Always be polite and helpful.  If appropriate, ask if it\'s working.' : 'Can you help?  If you have what they\'re looking for, let them know.'"
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
        <p v-if="!me">
          If you're a new freegler then welcome!  You'll get emails.  Name, approx. location, and profile picture are public - you
          can hide your real name and picture from Settings.  This adds cookies and local
          storage.  Read <nuxt-link target="_blank" to="/terms">
            Terms of Use
          </nuxt-link> and
          <nuxt-link target="_blank" to="/privacy">
            Privacy
          </nuxt-link> for details.
        </p>
        <b-btn v-if="!me" size="lg" variant="primary" :disabled="disableSend" @click="registerOrSend">
          Send your reply
          <v-icon v-if="replying" name="sync" class="fa-spin" />
          <v-icon v-else name="angle-double-right" />&nbsp;
        </b-btn>
        <div v-else>
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
    <ChatButton v-if="replyToUser" ref="chatbutton" :userid="replyToUser" class="d-none" @sent="sentReply" />
    <MessageReportModal v-if="expanded" ref="reportModal" :message="$props" />
  </div>
</template>

<script>
// Need to import rather than async otherwise the render doesn't happen and ref isn't set.
import ChatButton from './ChatButton'
import ShareModal from './ShareModal'
import MessageReportModal from './MessageReportModal'

import MessageReplyInfo from './MessageReplyInfo'
import EmailValidator from './EmailValidator'
import NewUserInfo from './NewUserInfo'
import MessagePhotosModal from './MessagePhotosModal'
import Postcode from './Postcode'
import twem from '~/assets/js/twem'
import waitForRef from '@/mixins/waitForRef'

const Highlighter = () => import('vue-highlight-words')
const MessageUserInfo = () => import('~/components/MessageUserInfo')
const NoticeMessage = () => import('~/components/NoticeMessage')
const MessageHistory = () => import('~/components/MessageHistory')

export default {
  components: {
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
      newUserPassword: null
    }
  },
  computed: {
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
    }

    const reply = this.replyToSend

    if (reply && reply.replyTo === this.id) {
      // Because of the way persistent store is restored, we might or might not know that we have a reply to send here.
      this.reply = reply.replyMessage
      await this.expand()
      console.log('Send it')
      this.sendReply()
    }
  },
  methods: {
    async expand() {
      await this.$store.dispatch('messages/fetch', {
        id: this.id
      })

      const message = this.$store.getters['messages/get'](this.id)

      this.expanded = message

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
  grid-template-columns: auto;

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
</style>
