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
        <div v-if="type === 'Taken' || type === 'Received'" class="text-center">
          <OutcomeBy
            :availableinitially="typeof message.availableinitially === 'number' ? message.availableinitially : 1"
            :type="type"
            :msgid="message.id"
            :left="left"
            @tookUsers="tookUsers = $event"
          />
          <hr>
        </div>
        <div v-if="showCompletion">
          <hr>
          <div class="text-center">
            <p class="mt-2">
              How do you feel about freegling just now?
            </p>
            <b-button-group>
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
          </div>
          <div class="text-center">
            <p class="mt-2">
              You can add comments:
            </p>
            <b-textarea v-model="comments" rows="2" max-rows="6" />
            <div class="float-right text-muted mt-2">
              <span v-if="happiness === null || happiness === 'Happy' || happiness === 'Fine'">
                <v-icon name="globe-europe" /> Your comments may be public
              </span>
              <span v-if="happiness === 'Unhappy'">
                <v-icon name="lock" /> Your comments will only go to our volunteers
              </span>
            </div>
          </div>
        </div>
      </template>
      <template slot="modal-footer">
        <b-button variant="white" @click="cancel">
          Cancel
        </b-button>
        <SpinButton variant="primary" :disabled="submitDisabled" name="save" :label="buttonLabel" :handler="submit" />
      </template>
    </b-modal>
  </div>
</template>
<script>
import OutcomeBy from './OutcomeBy'
import SpinButton from './SpinButton'

export default {
  components: { SpinButton, OutcomeBy },
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      showModal: false,
      type: null,
      happiness: null,
      comments: null,
      tookUsers: [],
      selectedUser: null
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
        this.type !== 'Withdrawn' &&
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
      console.log('Submit', this.left)
      let complete = false

      if (this.type === 'Withdrawn') {
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

        this.hide()
      } else {
        // We are recording some partial results for the post.
        // Don't call hide as that will trigger donation ask.
        this.showModal = false
      }
    },

    setComments() {
      switch (this.type) {
        case 'Taken':
          this.comments = 'Thanks, this has now been taken.'
          break
        case 'Received':
          this.comments = 'Thanks, this has now been received.'
          break
        case 'Withdrawn':
          this.comments =
            this.message.type === 'Offer'
              ? 'Sorry, this is no longer available.'
              : "Thanks, I'm no longer looking for this."
          break
      }
    },

    show(type) {
      this.showModal = true
      this.type = type
      this.setComments()
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
