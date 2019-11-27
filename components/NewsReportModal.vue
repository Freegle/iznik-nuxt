<template>
  <div>
    <b-modal
      :id="'newsReportModal-' + id"
      v-model="showModal"
      title="Report a post"
      size="lg"
      no-stacking
    >
      <template slot="default">
        <p>What don't you like about this?</p>
        <b-form-textarea v-model="reason" rows="2" placeholder="Please let us know what you don't like, and one of our volunteers will review it." />
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
    id: {
      type: Number,
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
      await this.$store.dispatch('newsfeed/report', {
        id: this.id,
        reason: this.reason
      })

      this.hide()
    }
  }
}
</script>
