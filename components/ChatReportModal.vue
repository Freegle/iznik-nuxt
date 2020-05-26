<template>
  <b-modal
    id="chatreportmodal"
    v-model="showModal"
    title="Oh dear..."
    size="lg"
    no-stacking
  >
    <template slot="default">
      <b-row>
        <b-col>
          <p>Sorry you're having trouble.</p>
          <h4>Which community is this about?</h4>
          <GroupSelect v-model="groupid" class="mt-1 mb-1" />
          <h4>Why are you reporting this?</h4>
          <b-select v-model="reason" class="mt-1 mb-1">
            <option value="null">
              -- Please choose --
            </option>
            <option value="Spam">
              It's Spam
            </option>
            <option value="Other">
              Something else
            </option>
          </b-select>
          <h4>What's wrong?</h4>
          <b-textarea v-model="comments" placeholder="Please tell us what's wrong.  This will go to our lovely volunteers, who will try to help you." />
        </b-col>
      </b-row>
    </template>
    <template slot="modal-footer" slot-scope="{ cancel }">
      <b-button variant="white" @click="cancel">
        Close
      </b-button>
      <b-button variant="primary" @click="send">
        Send Report
      </b-button>
    </template>
  </b-modal>
</template>
<style scoped lang="scss">
</style>

<script>
import GroupSelect from './GroupSelect'

export default {
  components: {
    GroupSelect
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    chatid: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      showModal: false,
      groupid: null,
      reason: null,
      comments: null
    }
  },
  methods: {
    show(type) {
      this.showModal = true
    },

    hide() {
      this.showModal = false
    },

    async send() {
      if (this.groupid && this.reason && this.comments) {
        const chatid = await this.$store.dispatch('chats/openChatToMods', {
          groupid: this.groupid
        })

        await this.$store.dispatch('popupchats/popup', {
          id: chatid
        })

        await this.$store.dispatch('chatmessages/send', {
          roomid: chatid,
          reportreason: this.reason,
          message: this.comments,
          refchatid: this.chatid
        })

        this.hide()
      }
    }
  }
}
</script>
