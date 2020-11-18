<template>
  <div>
    <b-modal
      v-model="showInvite"
      variant="info"
      size="lg"
    >
      <template v-slot:modal-header>
        <h1 class="w-100">
          <span v-if="!force" class="text-black-50 float-right mr-2 clickme" title="Close" @click="showInvite = false">
            <v-icon name="times-circle" scale="1.5" />
          </span>
          Help keep Freegle running smoothly
        </h1>
      </template>
      <b-card-text>
        <p v-if="mod" class="text-muted small">
          (This is something members see.  You're seeing it too even though you're a mod, so you can see what it
          looks like to them.)
        </p>
        <p>
          <b>Would you like to keep freegling smooth and safe for people?  You can help!</b>
        </p>
        <p>
          If you're up for it, we can show you the occasional thing on Freegle that needs checking over to make sure it's ok.
        </p>
        <p>
          It'll only take a few seconds to check, and you'll be helping out other people in the Freegle community.
        </p>
      </b-card-text>
      <template v-slot:modal-footer>
        <div class="d-flex justify-content-between w-100 flex-wrap">
          <b-btn variant="primary" class="mb-1" @click="inviteResponse(true)">
            Yes, I'm happy to do that
          </b-btn>
          <b-btn variant="secondary" class="mb-1" @click="inviteResponse(false)">
            No, that's not my thing
          </b-btn>
        </div>
      </template>
    </b-modal>
    <b-modal
      v-model="showTask"
      variant="info"
      size="lg"
      :no-close-on-backdrop="force"
      :hide-header-close="force"
      :no-close-on-esc="force"
    >
      <template v-slot:modal-header>
        <div class="d-flex flex-column w-100">
          <h1 v-if="task && task.type === 'CheckMessage'" class="header--size3 w-100">
            <span v-if="!force" class="text-black-50 float-right mr-2 clickme" title="Close" @click="doneForNow">
              <span class="small">
                {{ todo }} left
              </span>
              <v-icon name="times-circle" scale="1.5" />
            </span>
            Does this post look OK?
          </h1>
          <div class="font-weight-bold">
            Checking posts helps Freegle run smoothly - and earns you heart points <v-icon name="heart" class="text-danger" />.
          </div>
        </div>
      </template>
      <b-card-text>
        <p v-if="mod" class="text-muted small">
          (This is something members see.  You're seeing it too even though you're a mod, so you can see what it
          looks like to them.)
        </p>
        <div v-if="task && task.type === 'CheckMessage'">
          <p>
            This is someone else's post.  Does it look ok to you?
          </p>
          <Message
            v-if="message"
            :key="'task-' + message.id"
            v-bind="message"
            expand-button-text="See more details"
            :replyable="false"
            start-expanded
            :actions="false"
          />
          <div class="d-flex justify-content-between flex-wrap w-100 mt-2">
            <SpinButton
              variant="primary"
              class="mb-1"
              name="check"
              label="Yes, that looks ok"
              :handler="response('Approve')"
              size="lg"
              spinclass="text-white"
            />
            <SpinButton
              variant="secondary"
              class="mb-1"
              name="times"
              label="No, something's not right"
              :handler="response('Reject')"
              size="lg"
              spinclass="text-white"
            />
          </div>
        </div>
      </b-card-text>
      <template v-if="!force" v-slot:modal-footer>
        <div class="d-flex justify-content-between flex-wrap w-100">
          <b-btn v-if="inviteAccepted && !force" variant="link" class="mb-1" @click="response('Stop')()">
            Don't ask me again
          </b-btn>
          <b-btn variant="white" class="mb-1" @click="doneForNow">
            I'm done for now
          </b-btn>
        </div>
      </template>
    </b-modal>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import Message from './Message'
import SpinButton from './SpinButton'
export default {
  components: { SpinButton, Message },
  props: {
    force: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      showTask: false,
      showInvite: false,
      task: null,
      message: null,
      debug: true,
      todo: 5
    }
  },
  computed: {
    lastAsk() {
      return this.$store.getters['misc/get']('microvolunteeringlastask')
    },
    invited() {
      return this.me && this.me.trustlevel
    },
    inviteRejected() {
      console.log('Rejected?', this.me)
      return this.me && this.me.trustlevel === 'Declined'
    },
    inviteAccepted() {
      return this.me && this.me.trustlevel && this.me.trustlevel !== 'Declined'
    },
    askDue() {
      // Ask no more than once per hour.
      return (
        !this.lastAsk ||
        Date.now() - new Date(this.lastAsk).getTime() > 60 * 60 * 1000
      )
    }
  },
  mounted() {
    if (this.debug) {
      // Reset.
      this.$store.dispatch('misc/set', {
        key: 'microvolunteeringlastask',
        value: null
      })
    }

    if (this.me) {
      const now = dayjs()
      const daysago = now.diff(dayjs(this.me.added), 'days')

      console.log(
        'Consider status',
        this.invited,
        this.inviteAccepted,
        this.inviteRejected
      )

      if (!this.me.microvolunteering) {
        // Not on a group with this function enabled.
        console.log('Not on a group with microvolunteering enabled')
      } else if (!this.askDue) {
        // Challenged recently, so return verified.  That's true even for if it's forced - we don't want to bombard
        // people.
        console.log('Challenged recently')
        this.$emit('verified')
      } else if (this.force) {
        // Forced and not asked recently.  Do so.
        console.log('Forced and not recent, ask')
        this.getTask()
      } else if (daysago > 7) {
        // They're not a new member.  We might want to ask them.
        if (this.inviteRejected) {
          // We're not forced to do this, and they've said they don't want to.
          console.log('Invited and said no')
          this.$emit('verified')
        } else if (this.inviteAccepted) {
          // They're up for this.
          console.log('Invited and said yes, ask')
          this.getTask()
        } else {
          // We don't know if they want to.  Ask.
          console.log("Don't know what they want, ask")
          this.$api.bandit.shown({
            uid: 'microvolunteering',
            variant: 'inviteaccepted'
          })
          this.$api.bandit.shown({
            uid: 'microvolunteering',
            variant: 'inviterejected'
          })

          this.showInvite = true
        }
      }
    }
  },
  methods: {
    async getTask() {
      // Try to get a task.
      this.task = await this.$api.microvolunteering.challenge()
      console.log('Got task', this.task)

      if (this.task) {
        console.log('Got a task')
        this.$store.dispatch('misc/set', {
          key: 'microvolunteeringlastask',
          value: Date.now()
        })

        if (this.task.type === 'CheckMessage') {
          await this.$store.dispatch('messages/fetch', {
            id: this.task.msgid
          })

          // Need to save message as store may get wiped.
          this.message = this.$store.getters['messages/get'](this.task.msgid)

          this.showTask = true
        }
      } else {
        console.log('No task')
        // Nothing to do.
        this.doneForNow()
      }
    },
    response(verdict) {
      return async () => {
        if (verdict === 'Stop') {
          this.$store.dispatch('misc/set', {
            key: 'microvolunteeringinviteaccepted',
            value: null
          })

          this.$store.dispatch('misc/set', {
            key: 'microvolunteeringinviterejected',
            value: Date.now()
          })
        } else {
          await this.$api.microvolunteering.response({
            msgid: this.task.msgid,
            response: verdict
          })
        }

        this.todo--

        if (this.todo <= 0) {
          this.doneForNow()
        } else {
          this.getTask()
        }
      }
    },
    async inviteResponse(response) {
      if (response) {
        console.log('Accepted')
        this.$store.dispatch('misc/set', {
          key: 'microvolunteeringinviteaccepted',
          value: Date.now()
        })

        this.$api.bandit.chosen({
          uid: 'microvolunteering',
          variant: 'inviteaccepted'
        })

        this.$store.dispatch('user/edit', {
          id: this.myid,
          trustlevel: 'Basic'
        })

        await this.getTask()
      } else {
        console.log('Declined')
        this.$store.dispatch('misc/set', {
          key: 'microvolunteeringinviterejected',
          value: Date.now()
        })

        this.$api.bandit.chosen({
          uid: 'microvolunteering',
          variant: 'inviterejected'
        })

        this.$store.dispatch('user/edit', {
          id: this.myid,
          trustlevel: 'Declined'
        })
      }

      await this.$store.dispatch('auth/fetchUser', {
        components: ['me', 'groups'],
        force: true
      })

      this.showInvite = false
    },
    doneForNow() {
      console.log('Done for now')
      this.showTask = false
      this.$emit('verified')
    }
  }
}
</script>
