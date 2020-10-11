<template>
  <b-modal
    id="spamreportmodal"
    v-model="showModal"
    :title="(whitelist ? 'Add to Whitelist ' : 'Report Spammer ') + user.displayname"
    size="lg"
    no-stacking
  >
    <template slot="default">
      <div v-if="whitelist">
        <p>
          You should only whitelist people who have a legitimate reason to join many communities.  Usually this is
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
        <p>
          Spammers must have <strong>clear intent to deliberately spam/scam</strong>, or be a multijoiner across
          communities a long way apart, without a good reason.
        </p>
        <p>
          See <ExternalLink href="https://wiki.ilovefreegle.org/Spammers#SPAM_checking_before_submission">
            the wiki
          </ExternalLink> for more details and advice.
        </p>
        <p>
          Spammer reports will be reviewed before they're added to the list.  They'll only be added if they meet those
          criteria.
        </p>
      </div>
      <p>This reason will be visible to other moderators, so please make sure it's helpful.</p>
      <b-textarea v-model="reason" placeholder="Enter a reason" />
    </template>
    <template slot="modal-footer" slot-scope="{ cancel }">
      <b-button variant="white" @click="cancel">
        Cancel
      </b-button>
      <b-button v-if="whitelist" variant="danger" @click="send">
        Add to Whitelist
      </b-button>
      <b-button v-else variant="primary" @click="send">
        Send Report
      </b-button>
    </template>
  </b-modal>
</template>
<style scoped lang="scss">
</style>

<script>
import ExternalLink from './ExternalLink'
export default {
  components: { ExternalLink },
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
