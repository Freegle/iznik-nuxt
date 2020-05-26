<template>
  <b-modal
    id="blockmodal"
    v-model="showModal"
    :title="'Hide chat with ' + user.displayname"
    no-stacking
  >
    <template slot="default">
      <b-row>
        <b-col>
          <p>If you do this, this chat won't show in your list until there are new messages from them.</p>
          <p>Are you sure?</p>
        </b-col>
      </b-row>
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
    id: {
      type: Number,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  },
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
