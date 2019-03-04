<template>
  <div>
    <button
      class="btn btn-danger float-right mt-2"
      @click="del"
    >
      Delete
    </button>
    <h1>Edit {{ item && item['@id'] }}</h1>

    <div
      v-if="created"
      class="alert alert-success"
      role="status"
    >
      {{ created['@id'] }} created.
    </div>
    <div
      v-if="updated"
      class="alert alert-success"
      role="status"
    >
      {{ updated['@id'] }} updated.
    </div>
    <div
      v-if="isLoading || deleteLoading"
      class="alert alert-info"
      role="status"
    >
      Loading...
    </div>
    <div
      v-if="error"
      class="alert alert-danger"
      role="alert"
    >
      <span
        class="fa fa-exclamation-triangle"
        aria-hidden="true"
      /> {{ error }}
    </div>
    <div
      v-if="deleteError"
      class="alert alert-danger"
      role="alert"
    >
      <span
        class="fa fa-exclamation-triangle"
        aria-hidden="true"
      /> {{ deleteError }}
    </div>

    <PersonForm
      v-if="item"
      :handle-submit="onSendForm"
      :handle-update-field="updateField"
      :values="item"
      :errors="violations"
      :initial-values="retrieved"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import PersonForm from './Form.vue'

export default {
  components: {
    PersonForm
  },

  data() {
    return {
      item: {}
    }
  },

  computed: {
    ...mapGetters({
      isLoading: 'person/update/isLoading',
      error: 'person/update/error',
      deleteError: 'person/del/error',
      deleteLoading: 'person/del/isLoading',
      created: 'person/create/created',
      deleted: 'person/del/deleted',
      retrieved: 'person/update/retrieved',
      updated: 'person/update/updated',
      violations: 'person/update/violations'
    })
  },

  watch: {
    // eslint-disable-next-line object-shorthand,func-names
    deleted: function(deleted) {
      if (!deleted) {
        return
      }

      this.$router.push({ name: 'PersonList' })
    }
  },

  beforeDestroy() {
    this.reset()
  },

  created() {
    this.retrieve(decodeURIComponent(this.$route.params.id))
  },

  methods: {
    ...mapActions({
      createReset: 'person/create/reset',
      deleteItem: 'person/del/del',
      delReset: 'person/del/reset',
      retrieve: 'person/update/retrieve',
      updateReset: 'person/update/reset',
      update: 'person/update/update',
      updateRetrieved: 'person/update/updateRetrieved'
    }),

    del() {
      if (window.confirm('Are you sure you want to delete this person ?')) {
        this.deleteItem(this.retrieved)
      }
    },

    reset() {
      this.updateReset()
      this.delReset()
      this.createReset()
    },

    onSendForm() {
      this.update()
    },

    updateField(field, value) {
      this.updateRetrieved({ [field]: value })
    }
  }
}
</script>
