<template>
  <div>
    <div v-if="!fromme" class="grey p-2">
      <EmailValidator
        v-if="!me"
        ref="email"
        size="lg"
        label="Your email address:"
        :email.sync="email"
        :valid.sync="emailValid"
      />
      <MessageStillAvailable v-if="stillAvailable" class="mb-1 mt-1" />
      <b-form-group
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
    <hr>
    <div class="d-flex justify-content-between">
      <div class="pr-2 w-50">
        <b-btn variant="secondary" size="lg" block @click="close">
          Close
        </b-btn>
      </div>
      <div v-if="!fromme" class="pl-2 w-50">
        <b-btn
          v-if="!me"
          size="lg"
          variant="primary"
          :disabled="disableSend"
          block
          @click="registerOrSend"
        >
          Send <span class="d-none d-md-inline">your</span> reply
          <client-only>
            <v-icon v-if="replying" name="sync" class="fa-spin" />
            <v-icon v-else name="angle-double-right" />&nbsp;
          </client-only>
        </b-btn>
        <b-btn
          v-else
          size="lg"
          variant="primary"
          block
          :disabled="disableSend"
          @click="sendReply"
        >
          Send <span class="d-none d-md-inline">your</span> reply
          <client-only>
            <v-icon v-if="replying" name="sync" class="fa-spin" />
            <v-icon v-else name="angle-double-right" />&nbsp;
          </client-only>
        </b-btn>
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
    <span ref="breakpoint" class="d-inline d-sm-none" />
    <div class="d-none">
      <ChatButton ref="replyToPostChatButton" :userid="replyToUser" />
    </div>
  </div>
</template>
<script>
import replyToPost from '@/mixins/replyToPost'
import MessageStillAvailable from '@/components/MessageStillAvailable'
import SettingsPhone from '@/components/SettingsPhone'
import Postcode from '@/components/Postcode'
import EmailValidator from '@/components/EmailValidator'
import NewUserInfo from '@/components/NewUserInfo'
import ChatButton from '@/components/ChatButton'

const NewFreegler = () => import('~/components/NewFreegler')

export default {
  components: {
    ChatButton,
    MessageStillAvailable,
    SettingsPhone,
    Postcode,
    EmailValidator,
    NewFreegler,
    NewUserInfo
  },
  mixins: [replyToPost],
  props: {
    id: {
      type: Number,
      required: true
    },
    messageOverride: {
      type: Object,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      reply: null,
      replying: false,
      email: null,
      emailValid: false,
      showNewUser: false,
      newUserPassword: null
    }
  },
  computed: {
    message() {
      return (
        this.messageOverride ?? this.$store.getters['messages/get'](this.id)
      )
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
    fromme() {
      return this.message.fromuser && this.message.fromuser.id === this.myid
    }
  },
  watch: {
    me(newVal, oldVal) {
      console.log('Login change', newVal, oldVal)
      if (!oldVal && newVal && this.reply) {
        // We have now logged in - resume our send.
        console.log('Resume send')
        this.sendReply()
      }
    }
  },
  mounted() {
    if (
      process.browser &&
      (!this.message ||
        !this.message.fromuser ||
        typeof this.message.fromuser !== 'object')
    ) {
      // We are on the client and loading a page which we have rendered on the server rather than navigated to on the
      // client side.  We will therefore have rendered it logged out.  Refetch the message so that we get more info,
      // which we may do when logged in.
      this.$store.dispatch('messages/fetch', {
        id: this.id,
        force: true
      })
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
          this.$store.dispatch('auth/loggedInEver', true)

          await this.fetchMe(['me'], true)

          // Show the new user modal.
          this.newUserPassword = ret.password
          this.showNewUser = true
          this.waitForRef('newUserModal', () => {
            // Now that we are logged in, we can reply.
            this.$refs.newUserModal.show()

            // Once the modal is closed, we will send the reply.
          })
        } else {
          // If anything else happens, then we call sendReply which will force us to log in.  Then the watch will
          // spot that we're logged in and trigger the send, so we don't need to do that here.
          console.log('Failed to register - force login', ret)
          this.$store.dispatch('auth/forceLogin', true)
        }
      } catch (e) {
        // Probably an existing user.  Force ourselves to log in as above.
        console.log('Register exception, force login', e.message)
        this.$store.dispatch('auth/forceLogin', true)
      }
    },
    async sendReply() {
      console.log('sendReply', this.reply)

      if (this.reply) {
        // Save the reply
        const replyToSend = {
          replyMsgId: this.id,
          replyMessage: this.reply,
          replyingAt: Date.now()
        }
        console.log('Save', JSON.stringify(replyToSend))
        await this.$store.dispatch('reply/set', replyToSend)

        if (this.me) {
          // We have several things to do:
          // - join a group if need be (doesn't matter which)
          // - post our reply
          // - show/go to the open the popup chat so they see what happened
          this.replying = true
          let found = false
          let tojoin = null

          for (const messageGroup of this.message.groups) {
            tojoin = messageGroup.groupid
            Object.keys(this.myGroups).forEach(key => {
              const group = this.myGroups[key]

              if (messageGroup.groupid === group.id) {
                found = true
              }
            })
          }

          if (!found) {
            // Not currently a member.
            console.log('Need to join')
            await this.$store.dispatch('auth/joinGroup', {
              userid: this.myid,
              groupid: tojoin
            })

            // Have to get the message back, because as a non-member we couldn't see who sent it, and therefore
            // who to reply to.
            await this.$store.dispatch('messages/fetch', {
              id: this.id,
              force: true
            })
          }

          // Now we can send the reply via chat.
          this.$nextTick(async () => {
            await this.replyToPost()
            this.sent()
          })
        } else {
          // We're not logged in yet.  We need to force a sign in.  Once that completes then either the watch in here
          // or default.vue will spot we have a reply to send and make it happen.
          console.log('Force login')
          this.$store.dispatch('auth/forceLogin', true)
        }
      }
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
    close() {
      this.$emit('close')
    },
    sent() {
      this.$emit('sent')
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
