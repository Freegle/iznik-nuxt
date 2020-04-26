<template>
  <div>
    <b-btn v-if="summary" variant="white" @click="toggleView">
      <v-icon name="th-list" /> Summary View
    </b-btn>
    <b-btn v-else variant="white" @click="toggleView">
      <v-icon name="th-list" /> Details View
    </b-btn>
  </div>
</template>
<script>
export default {
  computed: {
    summary() {
      const ret = this.$store.getters['misc/get'](
        'modtoolsMessagesApprovedSummary'
      )
      return typeof ret === 'undefined' ? false : ret
    }
  },
  methods: {
    toggleView() {
      this.$store.dispatch('misc/set', {
        key: 'modtoolsMessagesApprovedSummary',
        value: !this.summary
      })
    }
  }
}
</script>
