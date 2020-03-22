<template>
  <b-modal
    id="confirmmodal"
    v-model="showModal"
    title="Suggestions Preview"
    no-stacking
    size="lg"
  >
    <template slot="default">
      <CovidSuggestions :id="id" />
    </template>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <b-button variant="white" @click="cancel">
        Close
      </b-button>
    </template>
  </b-modal>
</template>
<script>
import CovidSuggestions from './CovidSuggestions'
export default {
  components: { CovidSuggestions },
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
