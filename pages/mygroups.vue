<template>
  <div>
    <b-alert show variant="info" class="mt-2">
      <groupSelect id="mygroups" />
    </b-alert>
    <groupHeader v-if="group" :key="'group-' + (group ? group.id : null)" v-bind="group" />

    <div :key="'messages-' + (group ? group.id : null)" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="200">
      <b-list-group>
        <b-list-group-item v-for="message in messages" :key="message.id" class="p-0">
          <message v-bind="message" />
        </b-list-group-item>
      </b-list-group>
    </div>
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
      messages: null,
      busy: false,
      context: null
    }
  },
  computed: {
    group: function() {
      // We remember any previously selected group.
      const remembered = this.$store.getters['group/remembered']('mygroups')

      return remembered ? this.$store.getters['group/get'](remembered) : null
    }
  },
  async asyncData({ app, params, store }) {},
  created() {},
  methods: {
    loadMore: function() {
      this.busy = true
      console.log('loadMore', this.group)

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
        })
    }
  }
}
</script>
