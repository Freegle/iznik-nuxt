<template>
  <b-modal
    id="chatrsvpmodal"
    v-model="showModal"
    title="Do you expect a reply?"
    no-stacking
    no-close-on-backdrop
    hide-header-close
    no-close-on-esc
  >
    <template slot="default">
      <p>
        Please let us know if you're expecting to talk to this freegler again soon.
      </p>
      <p>
        If you're not, we can hide the chat from your list for now.
      </p>
    </template>
    <template slot="modal-footer">
      <div class="d-flex justify-content-between w-100">
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
    }
  },
  data: function() {
    return {
      showModal: false
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

      console.log('Messages', this.chatmessages)
      for (const msg of this.chatmessages) {
        console.log('Message', parseInt(msg.userid), parseInt(myid))
        if (parseInt(msg.userid) === parseInt(myid)) {
          ret = msg
        }
      }

      console.log('My last', ret)
      return ret
    }
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
    },

    async no() {
      if (this.mylast) {
        await this.$store.dispatch('chatmessages/rsvp', {
          id: this.mylast.id,
          roomid: this.mylast.chatid,
          value: 0
        })
      }

      await this.$store.dispatch('chats/hide', {
        id: this.id
      })

      this.hide()
    }
  }
}
</script>
