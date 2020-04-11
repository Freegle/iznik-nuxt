<template>
  <div>
    <b-modal
      id="addMemberModal"
      v-model="showModal"
      title="Add Member"
      size="lg"
      no-stacking
    >
      <template slot="default">
        <div v-if="merged">
          We've merged them.
        </div>
        <div v-else>
          <NoticeMessage variant="danger">
            Please be careful!  You can't undo this without geek help (and even then it is imperfect).  So please be
            completely sure that these are the same users.
          </NoticeMessage>
          <p class="mt-2">
            This will merge from the first email into the second email.  The second user's
            preferred email will be the preferred email of the merged user, so make sure you get
            this the right way round.
          </p>
          <div class="d-flex justify-content-between flex-wrap">
            <b-input v-model="email1" type="email" placeholder="First email" class="mt-2 mb-2" />
            <b-input v-model="email2" type="email" placeholder="Second email" class="mt-2 mb-2" />
          </div>
          <b-input v-model="reason" placeholder="Enter a reason for the logs" class="mt-2 mb-2" />
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="white" @click="cancel">
          Close
        </b-button>
        <b-button v-if="!merged" variant="success" :disabled="!email1 || !email2 || !reason" @click="merge">
          Merge
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import NoticeMessage from './NoticeMessage'

export default {
  components: { NoticeMessage },
  data: function() {
    return {
      showModal: false,
      email1: null,
      email2: null,
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
    async merge() {
      await this.$store.dispatch('user/merge', {
        email1: this.email1,
        email2: this.email2,
        reason: this.reason
      })

      this.merged = true
    }
  }
}
</script>
