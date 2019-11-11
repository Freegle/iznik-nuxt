<template>
  <b-modal
    id="emailConfirmModal"
    ref="emailConfirmModal"
    v-model="showModal"
    title="Please check your mailbox"
    no-stacking
    visible
    size="lg"
  >
    <p>We've sent you a verification mail.</p>
    <p>Don't forget to check your spam folder!</p>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <b-button variant="success" @click="cancel">
        Close
      </b-button>
    </template>
  </b-modal>
</template>
<style scoped>
</style>
<script>
export default {
  data: function() {
    return {
      showModal: false
    }
  },

  methods: {
    show() {
      this.showModal = true
    },
    hide() {
      this.showModal = false
    }
  }
}
</script>
