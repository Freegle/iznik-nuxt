<template>
  <div>
    <b-modal
      id="modNoteModal "
      v-model="showModal"
      size="lg"
      no-stacking
    >
      <template slot="modal-title" class="w-100">
        <div v-if="chat && user1 && user2">
          Add Mod Note to chat between {{ user1.displayname }} and {{ user2.displayname }}
        </div>
      </template>
      <template slot="default">
        <p>
          This will add a note from the moderators, which will be visible to everyone in this chat.
        </p>
        <p>
          Please include your name and the relevant group (if any).  It's also good to explain that
          only some messages are reviewed, so that people don't wrongly think we read all their messages.
        </p>
        <p>
          Please use a general phrase like "our automated checks flagged this for review" - don't provide really precise
          details about what caused a message to be held for review, because people will then just find ways
          around that.
        </p>
        <b-form-textarea v-model="note" placeholder="Add your note here" />
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="white" @click="cancel">
          Close
        </b-button>
        <b-button variant="primary" :disabled="!note" @click="addit">
          Add Mod Message
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import modal from '@/mixins/modal'
import twem from '~/assets/js/twem'

export default {
  mixins: [modal],
  props: {
    chatid: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      chat: null,
      note: null
    }
  },
  computed: {
    user1() {
      return this.chat ? this.chat.user1 : null
    },
    user2() {
      return this.chat ? this.chat.user2 : null
    }
  },
  methods: {
    async show() {
      await this.$store.dispatch('chats/fetch', {
        id: this.chatid
      })

      // Take a copy rather than use computed as it isn't ours and will vanish from the store.
      this.chat = this.$store.getters['chats/get'](this.chatid)

      this.showModal = true
    },
    async addit() {
      // Encode up any emojis.
      const msg = twem.untwem(this.$twemoji, this.note)

      // Send it
      await this.$store.dispatch('chatmessages/send', {
        roomid: this.chatid,
        message: msg,
        modnote: true
      })

      this.hide()
    }
  }
}
</script>
