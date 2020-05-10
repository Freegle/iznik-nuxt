<template>
  <b-modal
    id="forgetsucceedmodal"
    v-model="showModal"
    title="Thanks for freegling"
    no-stacking
  >
    <template slot="default">
      <b-row>
        <b-col>
          <p>
            We've cleared all your data.  You're welcome back in the future if you change your mind.
          </p>
          <p>
            Occasionally you may receive emails for upto a few more hours - emails may have been sent to you but
            not yet reached your mailbox.  If you receive any more emails after 24 hours please forward the entire
            mail to support@ilovefreegle.org.
          </p>
        </b-col>
      </b-row>
    </template>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <b-button variant="white" @click="cancel">
        Close
      </b-button>
    </template>
  </b-modal>
</template>
<script>
export default {
  data: function() {
    return {
      showModal: false
    }
  },
  methods: {
    show(type) {
      this.showModal = true
    },

    hide() {
      this.showModal = false
    },

    confirm() {
      this.$emit('confirm')
      this.hide()
    }
  }
}
</script>
