<template>
  <b-modal
    id="nudgewarningmodal"
    v-model="showModal"
    title="Nudging"
    no-stacking
  >
    <template slot="default">
      <p>
        Nudging is a gentle way to let the other person know that you're waiting for a reply.
      </p>
      <p>
        Before you use it, please remember that not everyone is online all the time.  Some people are only able
        to check their messages every day or two.
      </p>
    </template>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <b-button variant="white" @click="cancel">
        Cancel
      </b-button>
      <b-button variant="primary" @click="confirm">
        Got it - please nudge them
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
