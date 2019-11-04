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
          We've cleared all your data.  You're welcome back in the future if you change your mind.
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
