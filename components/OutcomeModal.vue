<template>
  <div>
    <b-modal
      id="promisemodal"
      v-model="showModal"
      size="lg"
      no-stacking
      title-class="w-100"
    >
      <template slot="modal-title">
        <h3 class="d-flex justify-content-between">
          {{ message.subject }}
          <div>
            <b-badge v-if="message.availableinitially > 1" variant="info" class="lg">
              {{ left }} left
            </b-badge>
          </div>
        </h3>
      </template>
      <template slot="default">
        <NoticeMessage v-if="type === 'Withdrawn'" variant="info">
          <div v-if="message.type === 'Offer'">
            <p>
              Only use <strong>Withdraw</strong> if you didn't manage to pass on this item
              on Freegle, and it's no longer available.
            </p>
          </div>
          <div v-else>
            <p>
              Only use <strong>Withdraw</strong> if you are no longer looking for this
              item.
            </p>
          </div>
          <p>
            If everything worked out OK, then use <strong>Mark as <span v-if="message.type === 'Offer'">TAKEN</span><span v-else>RECEIVED</span></strong>
            to let us know.
          </p>
        </NoticeMessage>
        <div v-if="type === 'Taken'">
          <OutcomeBy
            :availableinitially="typeof message.availableinitially === 'number' ? message.availableinitially : 1"
            :type="type"
            :msgid="message.id"
            :left="left"
            :taken-by="takenBy"
            :choose-error="chooseError"
            @tookUsers="tookUsers = $event"
          />
        </div>
        <div v-if="showCompletion">
          <div>
            <label class="mt-3 strong">
              How do you feel about freegling just now?
            </label>
            <b-button-group class="d-none d-md-block">
              <b-button :pressed="happiness === 'Happy'" :variant="happiness === 'Happy' ? 'info': 'primary'" size="lg" class="shadow-none" @click="happiness = 'Happy'">
                <v-icon name="smile" scale="2" /> Happy
              </b-button>
              <b-button :pressed="happiness === 'Fine'" :variant="happiness === 'Fine' ? 'info' : 'white'" size="lg" class="shadow-none" @click="happiness = 'Fine'">
                <v-icon name="meh" scale="2" color="grey" /> Fine
              </b-button>
              <b-button :pressed="happiness === 'Unhappy'" :variant="happiness === 'Unhappy' ? 'info' : 'danger'" size="lg" class="shadow-none" @click="happiness = 'Unhappy'">
                <v-icon name="frown" scale="2" /> Sad
              </b-button>
            </b-button-group>
            <b-button-group class="d-block d-md-none">
              <b-button :pressed="happiness === 'Happy'" :variant="happiness === 'Happy' ? 'info': 'primary'" size="md" class="shadow-none" @click="happiness = 'Happy'">
                <v-icon name="smile" scale="2" /> Happy
              </b-button>
              <b-button :pressed="happiness === 'Fine'" :variant="happiness === 'Fine' ? 'info' : 'white'" size="md" class="shadow-none" @click="happiness = 'Fine'">
                <v-icon name="meh" scale="2" color="grey" /> Fine
              </b-button>
              <b-button :pressed="happiness === 'Unhappy'" :variant="happiness === 'Unhappy' ? 'info' : 'danger'" size="md" class="shadow-none" @click="happiness = 'Unhappy'">
                <v-icon name="frown" scale="2" /> Sad
              </b-button>
            </b-button-group>
          </div>
          <NoticeMessage v-if="happiness !== null && type === 'Taken'" class="mt-2">
            You can use the thumbs up/down buttons above to say how things went with other freeglers.
          </NoticeMessage>
          <div>
            <label class="mt-4 strong">
              It went well/badly because:
            </label>
            <b-textarea v-model="comments" rows="3" max-rows="6" class="border-primary" />
            <div class="text-muted small mt-2">
              <span v-if="happiness === null || happiness === 'Happy' || happiness === 'Fine'">
                <v-icon name="globe-europe" /> Your comments may be public
              </span>
              <span v-if="happiness === 'Unhappy'">
                <v-icon name="lock" /> Your comments will only go to our volunteers
              </span>
            </div>
          </div>
        </div>
        <NoticeMessage v-if="message.availableinitially > 1 && left > 0" variant="warning">
          There will still be some left.  If you're giving them all away now, please adjust the numbers above.
        </NoticeMessage>
      </template>
      <template slot="modal-footer">
        <div>
          <div class="d-flex flex-wrap justify-content-end">
            <b-button variant="secondary" @click="cancel">
              Cancel
            </b-button>
            <SpinButton
              variant="primary"
              name="save"
              :label="buttonLabel"
              :handler="submit"
              class="ml-2"
              :disabled="type === 'Taken' && !tookUsers.length"
            />
          </div>
        </div>
      </template>
    </b-modal>
  </div>
</template>
<script>
import modal from '@/mixins/modal'
import OutcomeBy from './OutcomeBy'
import SpinButton from './SpinButton'
import NoticeMessage from '~/components/NoticeMessage'

export default {
  components: { NoticeMessage, SpinButton, OutcomeBy },
  mixins: [modal],
  props: {
    message: {
      type: Object,
      required: true
    },
    takenBy: {
      type: Object,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      type: null,
      happiness: null,
      comments: null,
      tookUsers: [],
      selectedUser: null,
      chooseError: false
    }
  },
  computed: {
    left() {
      let left = this.message.availableinitially
        ? this.message.availableinitially
        : 1

      for (const u of this.tookUsers) {
        left -= u.count
      }

      return left
    },
    showCompletion() {
      // We show for taken/received only when there are none left.
      return (
        this.type === 'Withdrawn' ||
        this.message.availableinitially === 1 ||
        this.left === 0
      )
    },
    submitDisabled() {
      const ret =
        this.type === 'Taken' &&
        this.message.availableinitially === 1 &&
        this.left === 1
      return ret
    },
    groupid() {
      let ret = null

      if (this.message && this.message.groups && this.message.groups.length) {
        ret = this.message.groups[0].groupid
      }

      return ret
    },
    buttonLabel() {
      if (!this.type) {
        return 'Submit'
      } else if (this.type === 'Withdrawn') {
        return 'Withdraw'
      } else {
        return 'Mark as ' + this.type.toUpperCase()
      }
    }
  },
  mounted() {
    if (this.$refs.userselect) {
      this.$refs.userselect.show()
    }
  },
  methods: {
    async submit() {
      let complete = false
      this.chooseError = false

      if (this.submitDisabled) {
        this.chooseError = true
      } else {
        if (this.type === 'Withdrawn' || this.type === 'Received') {
          complete = true
        } else {
          complete = this.left === 0

          for (const u of this.tookUsers) {
            if (u.count > 0) {
              await this.$store.dispatch('messages/addBy', {
                id: this.message.id,
                userid: u.userid > 0 ? u.userid : null,
                count: u.count
              })
            } else {
              await this.$store.dispatch('messages/removeBy', {
                id: this.message.id,
                userid: u.userid > 0 ? u.userid : null
              })
            }
          }
        }

        if (complete) {
          // The post is being taken/received.
          await this.$store.dispatch('messages/update', {
            action: 'Outcome',
            id: this.message.id,
            outcome: this.type,
            happiness: this.happiness,
            comment: this.comments
          })

          this.fetchMe(['openposts'])
          this.hide()
        } else {
          // We are recording some partial results for the post.
          // Don't call hide as that will trigger donation ask.
          this.showModal = false
        }
      }
    },

    show(type) {
      this.showModal = true
      this.type = type
    },

    hide() {
      // We're having trouble capturing events from this modal, so use root as a bus.
      this.$root.$emit('outcome', {
        groupid: this.groupid,
        outcome: this.type
      })

      this.showModal = false
      this.tookUsers = []
      this.happiness = null
    },

    cancel() {
      this.showModal = false
      this.tookUsers = []
      this.happiness = null
    }
  }
}
</script>
