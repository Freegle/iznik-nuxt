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
          Please let us know if you want <em>{{ user.displayname }}</em> to reply.
        </p>
        <p v-if="dohide">
          If not, we will hide the chat from your list for now.  You can still find it from My Posts.
        </p>
      </div>
    </template>
    <template slot="modal-footer">
      <div v-if="chaseup" class="d-flex justify-content-between w-100">
        <b-button variant="secondary" @click="no">
          No thanks
        </b-button>
        <b-button variant="primary" @click="yes">
          Yes please
        </b-button>
      </div>
      <div v-else class="d-flex justify-content-between w-100">
        <b-button variant="secondary" @click="no">
          No reply expected
        </b-button>
        <b-button variant="primary" @click="yes">
          Yes, I expect a reply
        </b-button>
      </div>
    </template>
  </b-modal>
</template>
<script>
import modal from '@/mixins/modal'

export default {
  components: {},
  mixins: [modal],
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
      chaseup: false,
      dohide: false
    }
  },
  computed: {
    chatmessages() {
      return this.$store.getters['chatmessages/getMessages'](this.id)
    },
    mylast() {
      let ret = null

      for (const msg of this.chatmessages) {
        if (parseInt(msg.userid) === parseInt(this.myid)) {
          ret = msg
        }
      }

      return ret
    }
  },
  methods: {
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

      if (this.dohide) {
        await this.$store.dispatch('chats/hide', {
          id: this.id
        })
      }

      this.hide()
    }
  }
}
</script>
