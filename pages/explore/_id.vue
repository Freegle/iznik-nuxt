<template>
  <div>
    <div v-if="group">
      <h1>{{ group.namedisplay }}</h1>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      id: null,
      group: null,
      messages: null
    }
  },
  async asyncData({ app, params, store }) {
    // We have the group id or name in params.id.  Fetch the group.
    await store.dispatch('group/fetch', {
      id: params.id
    })

    const group = store.getters['group/get'](params.id)
    console.log('Got group', group.nameshort)
    return {
      group: group
    }
  },
  created() {
    this.id = this.$route.params.id
  }
}
</script>
