<template>
  <div>
    <b-modal
      :id="'alertModal-' + alert.id"
      v-model="showModal"
      size="lg"
      no-stacking
    >
      <template slot="modal-title" class="w-100">
        {{ alert.subject }}
      </template>
      <template slot="default">
        <label>Text version</label>
        <b-textarea v-model="alert.text" rows="10" readonly />
        <div v-if="alert.html" class="bg-light mt-2">
          <label>HTML version (optional)</label>
          <!-- eslint-disable-next-line -->
          <div v-html="alert.html" class="bg-info" />
        </div>
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
    alert() {
      return this.$store.getters['alert/get'](this.id)
    }
  },
  methods: {
    async show() {
      await this.$store.dispatch('alert/fetch', {
        id: this.id
      })

      this.showModal = true
    },
    hide() {
      this.showModal = false
    }
  }
}
</script>
<style scoped>
label {
  font-weight: bold;
}
</style>
