<template>
  <b-modal
    id="spamreportmodal"
    v-model="showModal"
    :title="(whitelist ? 'Request Whitelist ' : 'Report Spammer ') + user.displayname"
    size="lg"
    no-stacking
  >
    <template slot="default">
      <div v-if="whitelist">
        <p>
          We will only whitelist people who have a legitimate reason to join many communities.  Usually this is
          because they are doing something for Freegle across the UK.
        </p>
      </div>
      <div v-else>
        <p class="text-error">
          Please don't report someone as a spammer just because they have sent a single spam message.
        </p>
        <ul>
          <li>Members may join many groups because they are over-enthusiastic or have relatives in different places.</li>
          <li>Mail can be spoofed or accounts can be hacked - so a member can appear to send spam but not be a spammer.</li>
        </ul>
        <p>Spammers must have <strong>clear intent to deliberately spam/scam</strong>, or be a massive multijoiner.</p>
      </div>
      <p>This reason will be visible to other moderators, so please make sure it's helpful.</p>
      <b-textarea v-model="reason" placeholder="Enter a reason" />
    </template>
    <template slot="modal-footer" slot-scope="{ cancel }">
      <b-button variant="white" @click="cancel">
        Cancel
      </b-button>
      <b-button v-if="whitelist" variant="danger" @click="send">
        Request Whitelist
      </b-button>
      <b-button v-else variant="success" @click="send">
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
    },
    whitelist: {
      type: Boolean,
      required: false,
      default: false
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
        if (this.whitelist) {
          await this.$store.dispatch('spammers/whitelist', {
            userid: this.user.userid,
            reason: this.reason
          })
        } else {
          await this.$store.dispatch('spammers/report', {
            userid: this.user.userid,
            reason: this.reason
          })
        }

        this.hide()
      }
    }
  }
}
</script>
