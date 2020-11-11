<template>
  <div>
    <b-modal
      id="promisemodal"
      v-model="showModal"
      :title="message.subject"
      size="lg"
      no-stacking
    >
      <template slot="default">
        <div v-if="type === 'Taken' || type === 'Received'" class="text-center">
          <OutcomeBy :users="users" :availablenow="message.availablenow" :type="type" :left.sync="left" @tookUsers="tookUsers = $event" />
          <hr>
        </div>
        <div v-if="showCompletion">
          <div class="text-center">
            <p class="mt-2">
              How do you feel about freegling just now?
            </p>
            <b-button-group>
              <b-button :pressed="happiness === 'Happy'" variant="primary" size="lg" class="shadow-none" @click="happiness = 'Happy'">
                <v-icon name="smile" scale="2" /> Happy
              </b-button>
              <b-button :pressed="happiness === 'Fine'" variant="white" size="lg" class="shadow-none" @click="happiness = 'Fine'">
                <v-icon name="meh" scale="2" color="grey" /> Fine
              </b-button>
              <b-button :pressed="happiness === 'Unhappy'" variant="danger" size="lg" class="shadow-none" @click="happiness = 'Unhappy'">
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
        <b-button variant="primary" :disabled="submitDisabled" @click="submit">
          Submit
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import OutcomeBy from './OutcomeBy'

export default {
  components: { OutcomeBy },
  props: {
    message: {
      type: Object,
      required: true
    },
    users: {
      validator: prop => typeof prop === 'object' || prop === null,
      required: true
    }
  },
  data: function() {
    return {
      showModal: false,
      type: null,
      happiness: null,
      comments: null,
      left: null,
      tookUsers: [],
      selectedUser: null
    }
  },
  computed: {
    showCompletion() {
      // We show for taken/received only when there are none left.
      return (
        this.message.type === 'Withdrawn' ||
        this.message.availablenow === 1 ||
        this.left === 0
      )
    },
    submitDisabled() {
      const ret =
        this.type !== 'Withdrawn' && this.message.availablenow === this.left
      return ret
    },
    groupid() {
      let ret = null

      if (this.message && this.message.groups && this.message.groups.length) {
        ret = this.message.groups[0].groupid
      }

      return ret
    }
  },
  mounted() {
    if (this.$refs.userselect) {
      this.$refs.userselect.show()
    }
  },
  methods: {
    async submit() {
      for (const u of this.tookUsers) {
        await this.$store.dispatch('messages/addBy', {
          id: this.message.id,
          userid: u.userid,
          count: u.count
        })
      }

      if (this.showCompletion) {
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
      this.selectedUser = this.users.length ? -1 : 0
    },

    hide() {
      // We're having trouble capturing events from this modal, so use root as a bus.
      this.$root.$emit('outcome', {
        groupid: this.groupid,
        outcome: this.type
      })

      this.showModal = false
    },

    cancel() {
      this.showModal = false
    }
  }
}
</script>
