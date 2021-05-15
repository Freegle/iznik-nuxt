<template>
  <div>
    <CovidClosed v-if="message.closed" />
    <div v-else-if="!message.fromuser || message.fromuser.id !== myid" class="grey p-2">
      <EmailValidator
        v-if="!me && !sent"
        ref="email"
        size="lg"
        label="Your email address:"
        :email.sync="email"
        :valid.sync="emailValid"
      />
      <NoticeMessage v-if="message.milesaway > 10" variant="warning" class="mb-2">
        Remember: lockdown is easing but please stay local.
      </NoticeMessage>
      <MessageStillAvailable v-if="stillAvailable" class="mb-1 mt-1" />
      <b-form-group
        v-if="!sent"
        class="flex-grow-1"
        label="Your reply:"
        :label-for="'replytomessage-' + message.id"
        :description="message.type === 'Offer' ? 'Interested?  Please explain why you\'d like it and when you can collect.  Always be polite and helpful, and remember it\'s not always first come first served.  If appropriate, ask if it\'s working.' : 'Can you help?  If you have what they\'re looking for, let them know.'"
      >
        <b-form-textarea
          v-if="message.type == 'Offer'"
          :id="'replytomessage-' + message.id"
          v-model="reply"
          rows="3"
          max-rows="8"
          class="border border-success"
        />
        <b-form-textarea
          v-if="message.type == 'Wanted'"
          :id="'replytomessage-' + message.id"
          v-model="reply"
          rows="3"
          max-rows="8"
          class="flex-grow-1"
        />
      </b-form-group>
      <MessageReplySent v-if="sent" />
      <div v-if="!sent">
        <div v-if="!me">
          <NewFreegler />
        </div>
        <div v-else>
          <div class="d-flex justify-content-between flex-wrap">
            <b-form-group
              class="flex-grow-1"
              label="Your postcode:"
              :label-for="'replytomessage-' + message.id"
              description=""
            >
              <Postcode @selected="savePostcode" />
            </b-form-group>
            <SettingsPhone
              v-if="me"
              label="Your mobile:"
              size="lg"
              hide-remove
              auto-save
              input-class="phone"
            />
          </div>
          <p class="text--small text-muted">
            We ask for your postcode so that we know how far away you are - the closer the better.  Your mobile is
            optional - we can notify you by text (SMS) so you don't miss replies.  We won't show it to the other freegler.
          </p>
        </div>
      </div>
    </div>
    <hr>
    <div class="d-flex justify-content-between">
      <b-btn variant="secondary" class="mr-2 w-50" size="lg">
        Close
      </b-btn>
      <b-btn
        v-if="!me"
        size="lg"
        variant="primary"
        :disabled="disableSend"
        block
        class="ml-2"
        @click="registerOrSend"
      >
        Send <span class="d-none d-md-inline">your</span> reply
        <v-icon v-if="replying" name="sync" class="fa-spin" />
        <v-icon v-else name="angle-double-right" />&nbsp;
      </b-btn>
      <b-btn
        v-else
        size="lg"
        variant="primary"
        block
        :disabled="disableSend"
        class="ml-2 w-50"
        @click="sendReply"
      >
        Send <span class="d-none d-md-inline">your</span> reply
        <v-icon v-if="replying" name="sync" class="fa-spin" />
        <v-icon v-else name="angle-double-right" />&nbsp;
      </b-btn>
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
    <div class="d-none">
      <ChatButton v-if="replyToUser" ref="chatbutton" :userid="replyToUser" @sent="sentReply" />
    </div>
  </div>
</template>
<script>
import MessageStillAvailable from '@/components/MessageStillAvailable'
import SettingsPhone from '@/components/SettingsPhone'
import CovidClosed from '@/components/CovidClosed'
import Postcode from '@/components/Postcode'
import EmailValidator from '@/components/EmailValidator'
import NoticeMessage from '@/components/NoticeMessage'
import NewUserInfo from '@/components/NewUserInfo'
import ChatButton from '@/components/ChatButton'

const NewFreegler = () => import('~/components/NewFreegler')
const MessageReplySent = () => import('~/components/MessageReplySent')

export default {
  components: {
    MessageStillAvailable,
    SettingsPhone,
    CovidClosed,
    Postcode,
    EmailValidator,
    NoticeMessage,
    NewFreegler,
    MessageReplySent,
    NewUserInfo,
    ChatButton
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      reply: null,
      replying: false,
      sent: false,
      email: null,
      emailValid: false,
      showNewUser: false,
      newUserPassword: null
    }
  },
  computed: {
    message() {
      return this.$store.getters['messages/get'](this.id)
    },
    stillAvailable() {
      return (
        this.message.type === 'Offer' &&
        this.reply &&
        this.reply.length <= 35 &&
        this.reply.toLowerCase().indexOf('still available') !== -1
      )
    },
    disableSend() {
      return this.replying || !this.reply || (!this.me && !this.emailValid)
    },
    replyToUser() {
      const msg = this.$store.getters['messages/get'](this.id)

      if (msg && msg.fromuser) {
        return msg.fromuser.id
      }

      return null
    }
  },
  methods: {
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

            for (const messageGroup of this.message.groups) {
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

.grey {
  background-color: $color-gray--lighter;
}

/deep/ .phone {
  border: 2px solid $color-gray--normal !important;
}
</style>
