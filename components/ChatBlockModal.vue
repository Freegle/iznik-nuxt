<template>
  <b-modal
    id="blockmodal"
    v-model="showModal"
    :title="'Block ' + user.displayname"
    no-stacking
  >
    <template slot="default">
      <b-row>
        <b-col>
          <p>If you do this, you won't ever get any more chat messages or emails from them.</p>
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
