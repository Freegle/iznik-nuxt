<template>
  <div>
    <b-modal
      :id="'messageReportModal-' + message.id"
      v-model="showModal"
      :title="'Report ' + message.subject"
      size="lg"
      no-stacking
    >
      <template slot="default">
        <p>
          Thanks for reporting an inappropriate post. We'll send your comments to your local volunteers who will have
          a look and take suitable action.
        </p>
        <b-form-textarea v-model="reason" rows="2" placeholder="Please explain what's wrong with this post." />
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="white" @click="cancel">
          Close
        </b-button>
        <b-button variant="success" @click="report">
          Submit Report
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
export default {
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      showModal: false,
      reason: null
    }
  },
  methods: {
    show() {
      this.showModal = true
    },
    hide() {
      this.showModal = false
    },
    async report() {
      if (this.reason) {
        const chatid = await this.$store.dispatch('chats/openChatToMods', {
          groupid: this.message.groups[0].groupid
        })

        await this.$store.dispatch('popupchats/popup', {
          id: chatid
        })

        await this.$store.dispatch('chatmessages/send', {
          roomid: chatid,
          message:
            "I'm reporting " +
            process.env.USER_SITE +
            '/message/' +
            this.message.id +
            ' to you as inappropriate.\r\n\r\n"' +
            this.reason +
            '"',
          refmsgid: this.message.id
        })

        this.hide()
      }
    }
  }
}
</script>
