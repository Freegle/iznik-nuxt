<template>
  <b-modal
    id="forgetfailmodal"
    v-model="showModal"
    title="Sorry, that didn't work"
    no-stacking
  >
    <template slot="default">
      <b-row>
        <b-col>
          <p>Please contact <a href="mailto:support@ilovefreegle.org">support@ilovefreegle.org</a> if you need further help.</p>
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
