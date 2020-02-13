<template>
  <div>
    <client-only>
      <GroupSelect v-model="groupid" all modonly />
      <div v-for="message in messages" :key="'messagelist-' + message.id" class="p-0 mt-2">
        <ModMessage :message="message" />
      </div>

      <infinite-loading :key="'infinite-' + groupid" force-use-infinite-wrapper="body" :distance="distance" @infinite="loadMore">
        <span slot="no-results" />
        <span slot="no-more" />
        <span slot="spinner">
          <b-img-lazy src="~/static/loader.gif" alt="Loading" />
        </span>
      </infinite-loading>
    </client-only>
  </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import ModMessage from '../../../../components/ModMessage'
import GroupSelect from '@/components/GroupSelect'
import loginRequired from '@/mixins/loginRequired'
import createGroupRoute from '@/mixins/createGroupRoute'

export default {
  layout: 'modtools',
  components: { ModMessage, GroupSelect, InfiniteLoading },
  mixins: [loginRequired, createGroupRoute('modtools/messages/pending')],
  data: function() {
    return {
      collection: 'Pending',
      context: null,
      distance: 1000
    }
  },
  computed: {
    messages: function() {
      let messages

      if (this.groupid) {
        messages = this.$store.getters['messages/getByGroup'](this.groupid)
      } else {
        messages = this.$store.getters['messages/getAll']
      }

      return messages
    }
  },
  watch: {
    groupid() {
      this.context = null
      this.$store.dispatch('messages/clear')
    },
    async group(newValue, oldValue) {
      // We have this watch because we may need to fetch a group that we have remembered.  The mounted()
      // call may happen before we have restored the persisted state, so we can't initiate the fetch there.
      if (oldValue === null || oldValue.id !== this.groupid) {
        await this.$store.dispatch('group/fetch', {
          id: this.groupid
        })
      }
    }
  },
  mounted() {
    // Ensure we have no cached messages for other searches/groups
    this.$store.dispatch('messages/clear')

    // Get our list of groups
    this.$store.dispatch('auth/fetchUser', {
      components: ['me', 'groups']
    })

    if (process.client && this.groupid) {
      this.$store.dispatch('group/fetch', {
        id: this.groupid
      })
    }
  },
  methods: {
    loadMore: function($state) {
      const currentCount = this.messages.length

      this.$store
        .dispatch('messages/fetchMessages', {
          groupid: this.groupid,
          collection: this.collection,
          modtools: true,
          summary: false,
          context: this.context
        })
        .then(() => {
          this.context = this.$store.getters['messages/getContext']

          if (currentCount === this.messages.length) {
            this.complete = true
            $state.complete()
          } else {
            $state.loaded()
          }
        })
        .catch(e => {
          $state.complete()
          console.log('Complete on error', e)
        })
    }
  }
}
</script>
