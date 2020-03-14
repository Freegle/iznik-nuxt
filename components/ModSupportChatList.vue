<template>
  <div>
    <ModSupportChat v-for="chat in chatsShown" :key="'chathistory-' + chat.id" :chat="chat" />
    <infinite-loading key="infinitechats" :distance="1000" @infinite="loadMoreChats">
      <span slot="no-results">
        <p class="text-left">
          No chats.
        </p>
      </span>
      <span slot="no-more" />
      <span slot="spinner" />
    </infinite-loading>
  </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import ModSupportChat from './ModSupportChat'

export default {
  components: {
    ModSupportChat,
    InfiniteLoading
  },
  props: {
    chats: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      showChats: 0
    }
  },
  computed: {
    chatsShown() {
      return this.chats ? this.chats.slice(0, this.showChats) : []
    }
  },
  methods: {
    loadMoreChats($state) {
      // We use an infinite load for the list because it's a lot of DOM to add at initial page load.
      if (this.showChats < this.chats.length) {
        this.showChats += 10
        $state.loaded()
      } else {
        $state.complete()
      }

      console.log('Load more', this.showChats)
    }
  }
}
</script>
