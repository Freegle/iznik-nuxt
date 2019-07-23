<template>
  <div>
    <b-alert show variant="info" class="mt-2">
      <groupSelect id="mygroups" @change="groupChange" />
    </b-alert>
    <groupHeader v-if="group" :key="groupid" v-bind="group" />

    <div v-for="(message, $index) in messages" :key="$index" class="p-0">
      <message v-bind="message" />
    </div>

    <infinite-loading :key="groupid" @infinite="loadMore" />
  </div>
</template>
<script>
import groupSelect from '~/components/groupSelect.vue'
import groupHeader from '~/components/groupHeader.vue'
import message from '~/components/message.vue'

export default {
  components: {
    groupHeader,
    groupSelect,
    message
  },
  data() {
    return {
      id: null,
      messages: [],
      busy: false,
      context: null
    }
  },
  computed: {
    group: function() {
      // We remember any previously selected group.
      const remembered = this.$store.getters['group/remembered']('mygroups')
      const ret = remembered
        ? this.$store.getters['group/get'](remembered)
        : null

      return ret
    },

    messageCount: function() {
      const count = this.messages ? this.messages.length : 0
      return count
    },

    groupid: function() {
      return this.group ? this.group.id : null
    }
  },
  methods: {
    groupChange: function() {
      this.messages = []
    },

    loadMore: function($state) {
      this.busy = true

      this.$store
        .dispatch('messages/fetch', {
          groupid: this.group ? this.group.id : null,
          collection: 'Approved',
          summary: true,
          types: ['Offer', 'Wanted'],
          context: this.context
        })
        .then(() => {
          this.busy = false

          if (this.group) {
            this.messages = this.$store.getters['messages/getByGroup'](
              this.group.id
            )
          } else {
            this.messages = this.$store.getters['messages/getAll']()
          }

          this.context = this.$store.getters['messages/getContext']()
          $state.loaded()
        })
        .catch(() => {
          $state.complete()
        })
    }
  }
}
</script>
