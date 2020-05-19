<template>
  <div>
    <b-modal
      v-if="message"
      id="modEmailMessageModal"
      v-model="showModal"
      size="lg"
    >
      <template slot="modal-title" class="w-100">
        Message received by email
      </template>
      <template slot="default">
        <NoticeMessage variant="info" class="mb-1">
          This is the raw email we received.  It may have had large attachments removed for space reasons.  The body
          of the email is sometimes encoded, and you might not be able to read it.  If you need help, ask on Tech.
        </NoticeMessage>
        <!-- eslint-disable-next-line-->
        <pre>{{ message.message }}</pre>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="white" @click="cancel">
          Close
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import NoticeMessage from './NoticeMessage'
export default {
  components: { NoticeMessage },
  props: {
    id: {
      type: Number,
      required: true
    },
    collection: {
      type: String,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      showModal: false
    }
  },
  computed: {
    message() {
      return this.$store.getters['messages/get'](this.id)
    }
  },
  methods: {
    async show() {
      await this.$store.dispatch('messages/fetch', {
        id: this.id,
        messagehistory: true,
        collection: this.collection
      })

      this.showModal = true
    },
    hide() {
      this.showModal = false
    }
  }
}
</script>
