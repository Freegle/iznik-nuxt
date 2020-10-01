<template>
  <b-modal
    id="confirmmodal"
    v-model="showModal"
    :title="title"
  >
    <template slot="default">
      <!-- eslint-disable-next-line -->
      <div v-html="message" />
    </template>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <b-button variant="white" @click="cancel">
        Cancel
      </b-button>
      <b-button variant="primary" @click="confirm">
        Confirm
      </b-button>
    </template>
  </b-modal>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: 'Are you sure?'
    },
    message: {
      type: String,
      required: false,
      default: '<p>Are you sure you want to do this?</p>'
    }
  },
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
    },

    confirm() {
      this.$emit('confirm')
      this.hide()
    }
  }
}
</script>
