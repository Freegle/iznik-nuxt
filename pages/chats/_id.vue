<template>
  <b-col>
    <b-row class="m-0">
      <b-col cols="3" class="chatlist p-0">
        <ul v-for="(chat, $index) in sortedChats" :key="'chat-' + $index" class="p-0 pt-1 list-unstyled mb-1">
          <li :class="{ active: activeChat && chat.id == activeChat.id }">
            <chatListEntry :key="'chatlistentry-' + chat.id" v-bind="chat" />
          </li>
        </ul>
      </b-col>
      <b-col cols="6" class="chatback">
        <chatPane v-if="activeChat" :key="'activechat-' + (activeChat ? activeChat.id : null)" v-bind="activeChat" />
      </b-col>
      <b-col cols="3">
        Ads go here
      </b-col>
    </b-row>
  </b-col>
</template>
<style>
.chatback {
  background-color: #f3f0da;
}

.active {
  background-color: rgb(245, 245, 245);
}
</style>
<script>
import chatPane from '~/components/chatPane.vue'
import chatListEntry from '~/components/chatListEntry.vue'
import requestIdleCallback from '~/assets/js/requestIdleCallback'

export default {
  components: {
    chatPane,
    chatListEntry
  },

  validate({ params }) {
    // Must be a number if present
    return !params.id || /^\d+$/.test(params.id)
  },

  data() {
    return {
      id: null
    }
  },

  computed: {
    sortedChats() {
      // We sort chats by unread first, then
      const chats = Object.values(this.$store.getters['chats/list']())

      chats.sort(function(a, b) {
        if (b.unseen !== a.unseen) {
          return b.unseen - a.unseen
        } else {
          return new Date(b.lastdate) - new Date(a.lastdate)
        }
      })

      return chats
    },

    activeChat() {
      // Selected chat if present, otherwise first chat if we have one.
      return this.selectedChat
        ? this.selectedChat
        : this.sortedChats
          ? this.sortedChats[0]
          : null
    }
  },

  async asyncData({ app, params, store }) {
    console.log('Async data')
    let selected = null
    let chats = Object.values(store.getters['chats/list']())

    console.log('Currently got', chats)

    if (!store.$auth.loggedIn) {
      console.log('Not logged in')
    } else {
      if (chats) {
        // Got some - can start rendering.  Fire off an update to refresh us later if they've changed.  No rush, so
        // wait for idle.
        requestIdleCallback(() => {
          console.log('Fetch latest chats')
          store.dispatch('chats/listChats')
        })
      } else {
        // Not got any - need to get them before we can proceed.
        await store.dispatch('chats/listChats')
      }

      chats = Object.values(store.getters['chats/list']())

      if (params.id) {
        selected = chats.find(chat => parseInt(chat.id) === parseInt(params.id))
      }
    }

    return {
      chats: chats,
      selectedChat: selected
    }
  },

  created() {
    this.id = this.$route.params.id
  },
  methods: {}
}
</script>
