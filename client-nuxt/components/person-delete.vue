<template>
  <b-modal
    v-if="id"
    id="delete"
    ok-title="Delete"
    :title="'Delete ' + name + '?'"
    @ok="destroy"
  >
    <p>Are you sure?</p>
  </b-modal>
</template>
<script>
export default {
  props: {
    id: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      default: ''
    },
    comments: {
      type: String,
      default: ''
    }
  },
  methods: {
    destroy() {
      this.$store
        .dispatch('people/delete', { id: this.id })
        .then(() => this.$store.dispatch('people/get'))
    }
  }
}
</script>
