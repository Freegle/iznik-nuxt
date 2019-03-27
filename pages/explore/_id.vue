<template>
  <div>
    <groupHeader v-if="group" :key="'group-' + (group ? group.id : null)" v-bind="group" />
    <b-list-group>
      <b-list-group-item v-for="message in messages" :key="message.id">
        <message v-bind="message" />
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script>
import groupHeader from '~/components/groupheader.vue'
import message from '~/components/message.vue'

export default {
  components: {
    groupHeader,
    message
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
      groupid: group.id
    })

    const messages = store.getters['messages/getByGroup'](group.id)

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
