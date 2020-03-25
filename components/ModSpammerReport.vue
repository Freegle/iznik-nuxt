<template>
  <b-modal
    id="spamreportmodal"
    v-model="showModal"
    :title="'Report Spammer ' + user.displayname"
    size="lg"
    no-stacking
  >
    <template slot="default">
      <p class="text-error">
        Please don't report someone as a spammer just because they have sent a single spam message.
      </p>
      <ul>
        <li>Members may join many groups because they are over-enthusiastic or have relatives in different places.</li>
        <li>Mail can be spoofed or accounts can be hacked - so a member can appear to send spam but not be a spammer.</li>
      </ul>
      <p>Spammers must have <strong>clear intent to deliberately spam/scam</strong>, or be a massive multijoiner.</p>
      <p>This reason will be visible to other moderators, so please make sure it's helpful.</p>
      <b-textarea v-model="reason" placeholder="Enter a reason" />
    </template>
    <template slot="modal-footer" slot-scope="{ cancel }">
      <b-button variant="white" @click="cancel">
        Close
      </b-button>
      <b-button variant="success" @click="send">
        Send Report
      </b-button>
    </template>
  </b-modal>
</template>
<style scoped lang="scss">
</style>

<script>
export default {
  props: {
    user: {
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
    show(type) {
      this.showModal = true
    },

    hide() {
      this.showModal = false
    },

    async send() {
      if (this.reason) {
        await this.$store.dispatch('spammers/report', {
          userid: this.user.userid,
          reason: this.reason
        })

        this.hide()
      }
    }
  }
}
</script>
