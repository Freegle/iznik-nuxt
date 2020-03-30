<template>
  <div>
    <b-modal
      id="modEmailMessageModal"
      v-model="showModal"
      size="lg"
      no-stacking
    >
      <template slot="modal-title" class="w-100">
        Message received by email
      </template>
      <template slot="default">
        <!-- eslint-disable-next-line-->
        <pre>{{ message.message }}</pre>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="white" @click="cancel">
          Close
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
      showModal: false
    }
  },
  computed: {
    message() {
      return this.$store.getters['messages/get'](this.id)
    }
  },
  methods: {
    async show() {
      await this.$store.dispatch('messages/fetch', {
        id: this.id,
        messagehistory: true
      })

      this.showModal = true
    },
    hide() {
      this.showModal = false
    }
  }
}
</script>
