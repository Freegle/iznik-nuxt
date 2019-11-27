<template>
  <b-modal
    id="confirmmodal"
    v-model="showModal"
    title="Are you sure?"
    no-stacking
  >
    <template slot="default">
      <b-row>
        <b-col>
          <p>Are you sure you want to do this?</p>
        </b-col>
      </b-row>
    </template>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <b-button variant="white" @click="cancel">
        Cancel
      </b-button>
      <b-button variant="success" @click="confirm">
        Confirm
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
