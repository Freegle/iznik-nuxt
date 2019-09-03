<template>
  <b-modal
    id="promisemodal"
    v-model="showModal"
    title="Remove a promise"
    size="lg"
    no-stacking
  >
    <template slot="default">
      <b-alert show variant="info">
        Please only do this if there's a good reason, so as not to disappoint people.
      </b-alert>
      <p>You're no longer promising:</p>
      <b-select v-model="selectedMessage" :options="messageOptions" class="mb-2" disabled />
      <p>...to:</p>
      <b-select v-model="selectedUser" :options="userOptions" class="mb-2" disabled />
    </template>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <b-button variant="white" @click="cancel">
        Cancel
      </b-button>
      <b-button variant="warning" @click="promise">
        Unpromise
      </b-button>
    </template>
  </b-modal>
</template>
<style scoped>
select {
  font-weight: bold;
}
</style>
<script>
// TODO DESIGN This is a good example of why I can't write mobile apps.  It's a very old-school interface, dropdown
// lists, whereas perhaps it should be a all funky image-based touch-gesture stuff.
export default {
  components: {},
  props: {
    messages: {
      type: Array,
      required: true
    },
    selectedMessage: {
      type: Number,
      required: false,
      default: 0
    },
    users: {
      type: Array,
      required: true
    },
    selectedUser: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data: function() {
    return {
      showModal: false
    }
  },
  computed: {
    messageOptions() {
      const options = []

      if (this.messages.length > 1) {
        options.push({
          value: 0,
          text: '-- Please choose a message --',
          selected: this.selectedMessage === 0
        })
      }

      for (const message of this.messages) {
        options.push({
          value: message.id,
          text: message.subject,
          selected: this.selectedMessage === message.id
        })
      }

      return options
    },
    userOptions() {
      const options = []

      if (this.users.length > 1) {
        options.push({
          value: 0,
          text: '-- Please choose a user --',
          selected: this.selectedUser === 0
        })
      }

      for (const user of this.users) {
        options.push({
          value: user.id,
          text: user.displayname,
          selected: this.selectedUser === user.id
        })
      }

      return options
    },
    userobj() {
      let ret = null

      for (const user of this.users) {
        if (user.id === this.selectedUser) {
          ret = user
        }
      }

      return ret
    }
  },
  methods: {
    promise() {
      this.$store.dispatch('messages/renege', {
        id: this.selectedMessage,
        userid: this.selectedUser
      })

      this.hide()
    },

    show() {
      this.showModal = true
    },

    hide() {
      this.showModal = false
    }
  }
}
</script>

this.$store.dispatch('message/renege', {
id: this.message.id,
userid: this.message.promises[0].userid
})
