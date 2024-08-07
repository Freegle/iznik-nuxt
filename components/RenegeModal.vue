<template>
  <b-modal
    id="promisemodal"
    v-model="showModal"
    title="Remove a promise"
    size="lg"
  >
    <template slot="default">
      <notice-message class="mb-3">
        Please only do this if there's a good reason, so as not to disappoint people.
      </notice-message>
      <p>You're no longer promising:</p>
      <b-select v-model="selectedMessage" :options="messageOptions" class="mb-2 font-weight-bold" disabled />
      <p>...to:</p>
      <b-select v-model="selectedUser" :options="userOptions" class="mb-2 font-weight-bold" disabled />
      <div v-if="tryst" class="d-flex flex-wrap">
        <b-form-checkbox v-model="removeTryst" size="lg">
          Cancel handover arranged for <strong>{{ trystdate }}</strong>
        </b-form-checkbox>
      </div>
      <hr>
      <p>
        Please also give this freegler a thumbs up or down, depending on the experience you had with them.
      </p>
      <Ratings :id="selectedUser" class="mt-2" size="lg" />
    </template>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <b-button variant="white" @click="cancel">
        Cancel
      </b-button>
      <b-button variant="warning" @click="renege">
        Unpromise
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import modal from '@/mixins/modal'
import Ratings from '~/components/Ratings'

const NoticeMessage = () => import('~/components/NoticeMessage')

export default {
  components: {
    NoticeMessage,
    Ratings
  },
  mixins: [modal],
  props: {
    messages: {
      validator: prop => typeof prop === 'object' || prop === null,
      required: true
    },
    selectedMessage: {
      type: Number,
      required: false,
      default: 0
    },
    users: {
      validator: prop => typeof prop === 'object' || prop === null,
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
      removeTryst: true
    }
  },
  computed: {
    messageOptions() {
      const options = []

      if (this.messages) {
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
      }

      return options
    },
    userOptions() {
      const options = []

      if (this.users) {
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
    },
    tryst() {
      return this.selectedUser
        ? this.$store.getters['tryst/getByUser'](this.selectedUser)
        : null
    },
    trystdate() {
      return this.tryst
        ? this.$dayjs(this.tryst.arrangedfor).format('dddd Do HH:mm a')
        : null
    }
  },
  methods: {
    async renege() {
      await this.$store.dispatch('messages/renege', {
        id: this.selectedMessage,
        userid: this.selectedUser
      })

      if (this.tryst && this.removeTryst) {
        await this.$store.dispatch('tryst/delete', {
          id: this.tryst.id
        })
      }

      this.hide()
    }
  }
}
</script>

this.$store.dispatch('message/renege', {
id: this.message.id,
userid: this.message.promises[0].userid
})
