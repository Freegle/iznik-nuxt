<template>
  <div>
    <groupHeader v-if="group" :key="'group-' + (group ? group.id : null)" v-bind="group" />
  </div>
</template>
<script>
import groupHeader from '~/components/groupheader.vue'

export default {
  components: {
    groupHeader
  },
  data() {
    return {
      id: null,
      group: null,
      messages: null
    }
  },
  computed: {},
  async asyncData({ app, params, store }) {
    // We have the group id or name in params.id.  Fetch the group.
    await store.dispatch('group/fetch', {
      id: params.id
    })

    const group = store.getters['group/get'](params.id)

    await store.dispatch('messages/fetch', {
      groupid: params.id
    })

    const messages = store.getters['messages/getByGroup'](params.id)

    return {
      group: group,
      messages: messages
    }
  },
  created() {
    this.id = this.$route.params.id
  }
}
</script>
