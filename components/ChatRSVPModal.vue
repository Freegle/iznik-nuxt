<template>
  <b-modal
    id="chatrsvpmodal"
    v-model="showModal"
    :title="chaseup ? 'Shall we chase them up?' : 'Do you expect a reply?'"
    no-stacking
    no-close-on-backdrop
    hide-header-close
    no-close-on-esc
  >
    <template slot="default">
      <div v-if="chaseup">
        <p>Shall we remind <em>{{ user.displayname }}</em> if they don't reply?</p>
      </div>
      <div v-else>
        <p>
          Please let us know if you're expecting to talk to <em>{{ user.displayname }}</em> again soon.
        </p>
        <p>
          If you're not, we will hide the chat from your list for now.  You can still find it from My Posts.
        </p>
      </div>
    </template>
    <template slot="modal-footer">
      <div v-if="chaseup" class="d-flex justify-content-between w-100">
        <b-button variant="info" @click="no">
          No thanks
        </b-button>
        <b-button variant="success" @click="yes">
          Yes please
        </b-button>
      </div>
      <div v-else class="d-flex justify-content-between w-100">
        <b-button variant="info" @click="no">
          No reply expected
        </b-button>
        <b-button variant="success" @click="yes">
          Yes, I expect a reply
        </b-button>
      </div>
    </template>
  </b-modal>
</template>
<script>
export default {
  components: {},
  props: {
    id: {
      type: Number,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      showModal: false,
      chaseup: false,
      variant: null
    }
  },
  computed: {
    chatmessages() {
      return this.$store.getters['chatmessages/getMessages'](this.id)
    },
    mylast() {
      let ret = null
      const me = this.$store.getters['auth/user']
      const myid = me ? me.id : null

      for (const msg of this.chatmessages) {
        if (parseInt(msg.userid) === parseInt(myid)) {
          ret = msg
        }
      }

      return ret
    }
  },
  async mounted() {
    const variant = await this.$api.bandit.choose({
      uid: 'askrsvp'
    })

    this.chaseup = variant.variant === 'chaseup'

    this.$api.bandit.shown({
      uid: 'askrsvp',
      variant: variant.variant
    })

    this.variant = variant.variant
  },
  methods: {
    show() {
      this.showModal = true
    },

    hide() {
      this.showModal = false
    },

    async yes() {
      if (this.mylast) {
        await this.$store.dispatch('chatmessages/rsvp', {
          id: this.mylast.id,
          roomid: this.mylast.chatid,
          value: 1
        })
      }

      this.hide()

      this.$api.bandit.chosen({
        uid: 'askrsvp',
        variant: this.variant
      })
    },

    async no() {
      if (this.mylast) {
        await this.$store.dispatch('chatmessages/rsvp', {
          id: this.mylast.id,
          roomid: this.mylast.chatid,
          value: 0
        })
      }

      if (!this.chaseup) {
        await this.$store.dispatch('chats/hide', {
          id: this.id
        })
      }

      this.hide()

      this.$api.bandit.chosen({
        uid: 'askrsvp',
        variant: this.variant
      })
    }
  }
}
</script>
