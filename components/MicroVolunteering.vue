<template>
  <div>
    <client-only>
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
            <div v-if="task">
              <h1 class="header--size3 w-100">
                <span class="float-right">
                  <span class="small d-inline-flex justify-content-start">
                    <v-icon v-for="i in done" :key="'hearta-' + i" class="mr-1 text-danger" name="heart" />
                    <v-icon v-for="i in todo" :key="'heartb-' + i" class="mr-1 text-faded" name="heart" />
                  </span>
                  <span v-if="!force" class="text-black-50 mr-2 clickme" title="Close" @click="doneForNow">
                    <v-icon name="times-circle" scale="1.5" />
                  </span>
                </span>
                <span v-if="task.type === 'CheckMessage'">
                  Does this post look OK?
                </span>
                <span v-else-if="task.type === 'SearchTerm'">
                  Word Match
                </span>
              </h1>
              <div class="font-weight-bold">
                These little things help Freegle run smoothly - and earn you heart points <v-icon name="heart" class="text-danger" />.
              </div>
            </div>
          </div>
        </template>
        <b-card-text>
          <p v-if="mod" class="text-muted small">
            (This is something members see.  You're seeing it too even though you're a mod, so you can see what it
            looks like to them.)
          </p>
          <div v-if="task">
            <div v-if="task.type === 'CheckMessage'">
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
                :record-view="false"
              />
              <div v-if="!showComments" class="d-flex justify-content-between flex-wrap w-100 mt-3">
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
              <div v-if="showComments" class="mt-2">
                <b-form-group>
                  <label for="details" class="font-weight-bold text-center">
                    What's wrong?
                  </label>
                  <b-textarea v-model="comments" rows="2" placeholder="Could you give us a quick indication of what's not right?" />
                  <SpinButton
                    variant="secondary"
                    class="mt-2"
                    name="save"
                    label="Send your comments"
                    :handler="response('Comments')"
                    size="lg"
                    spinclass="text-white"
                  />
                </b-form-group>
              </div>
            </div>
            <div v-else-if="task.type === 'SearchTerm'">
              <p>
                Click the <b>two most similar</b> terms - or if there are none, click <em>Skip</em>.
              </p>
              <div class="d-flex flex-wrap justify-content-between">
                <MicroVolunteeringSimilarTerm
                  v-for="term in task.terms"
                  :key="'term-' + term.id"
                  :term="term"
                  :similar-terms="similarTerms"
                  class="mr-1 mb-2"
                  @similar="similar(term)"
                  @not="notSimilar(term)"
                />
              </div>
              <hr>
              <div class="d-flex flex-wrap justify-content-between">
                <b-btn variant="white" size="lg" class="mt-2" @click="getTask">
                  Skip - no similar terms
                </b-btn>
                <b-btn variant="primary" size="lg" class="mt-2" :disabled="similarTerms.length < 2" @click="submitSimilar">
                  Submit - these terms are similar
                </b-btn>
              </div>
            </div>
            <div v-else-if="task.type === 'Facebook'">
              <FacebookPostToShare :id="task.facebook.postid" @skipped="facebookSkipped" @done="facebookDone" />
            </div>
            <div v-else>
              Unknown task {{ task }}
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
    </client-only>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import Message from './Message'
import SpinButton from './SpinButton'
import MicroVolunteeringSimilarTerm from './MicroVolunteeringSimilarTerm'
import FacebookPostToShare from './FacebookPostToShare'
export default {
  components: {
    FacebookPostToShare,
    MicroVolunteeringSimilarTerm,
    SpinButton,
    Message
  },
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
      showComments: false,
      comments: null,
      task: null,
      message: null,
      similarTerms: [],
      debug: true,
      todo: 5,
      done: 0
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
      this.similarTerms = []

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
        } else if (this.task.type === 'SearchTerm') {
          this.showTask = true
        } else if (this.task.type === 'Facebook') {
          this.showTask = true
        } else {
          this.doneForNow()
        }
      } else {
        console.log('No task')
        // Nothing to do.
        this.doneForNow()
      }
    },
    response(verdict) {
      return async () => {
        switch (verdict) {
          case 'Stop': {
            this.$store.dispatch('misc/set', {
              key: 'microvolunteeringinviterejected',
              value: Date.now()
            })

            this.$api.bandit.chosen({
              uid: 'microvolunteering',
              variant: 'inviterejected'
            })

            await this.$store.dispatch('user/edit', {
              id: this.myid,
              trustlevel: 'Declined'
            })

            this.doneForNow()
            break
          }
          case 'Approve': {
            // Approved -  that's it.
            await this.$api.microvolunteering.response({
              msgid: this.task.msgid,
              response: verdict
            })

            this.considerNext()
            break
          }
          case 'Reject': {
            // Record the result but give them a chance to say why.
            await this.$api.microvolunteering.response({
              msgid: this.task.msgid,
              response: verdict
            })

            this.showComments = true
            break
          }
          case 'Comments': {
            // Record the result with comments.
            await this.$api.microvolunteering.response({
              msgid: this.task.msgid,
              response: 'Reject',
              comments: this.comments
            })

            this.considerNext()
          }
        }
      }
    },
    considerNext() {
      this.todo--
      this.done++

      this.similarTerms = []

      if (this.todo <= 0) {
        this.doneForNow()
      } else {
        this.getTask()
      }

      this.showComments = false
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
    },
    isSimilar(term) {
      return this.similarTerms.find(t => t.id === term.id)
    },
    similar(term) {
      if (this.similarTerms.length < 2) {
        this.similarTerms.push(term)
      }
    },
    notSimilar(term) {
      this.similarTerms = this.similarTerms.filter(t => t.id !== term.id)
    },
    async submitSimilar() {
      await this.$api.microvolunteering.response({
        searchterm1: this.similarTerms[0].id,
        searchterm2: this.similarTerms[1].id
      })

      this.considerNext()
    },
    async facebookSkipped() {
      await this.$api.microvolunteering.response({
        facebook: this.task.facebook.id,
        response: 'Reject'
      })

      this.getTask()
    },
    async facebookDone() {
      await this.$api.microvolunteering.response({
        facebook: this.task.facebook.id,
        response: 'Approve'
      })

      this.considerNext()
    }
  }
}
</script>
<style scoped lang="scss">
</style>
