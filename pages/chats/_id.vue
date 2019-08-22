<template>
  <b-col>
    <b-row class="m-0">
      <b-col cols="12" md="3" class="chatlist p-0 bg-white">
        <ul v-for="(chat, $index) in sortedChats" :key="'chat-' + $index" class="p-0 pt-1 list-unstyled mb-1">
          <li :class="{ active: activeChat && chat.id == activeChat.id }">
            <ChatListEntry :key="'ChatListEntry-' + chat.id" v-bind="chat" />
          </li>
        </ul>
      </b-col>
      <b-col cols="12" md="6" class="chatback">
        <chatPane v-if="activeChat" :key="'activechat-' + (activeChat ? activeChat.id : null)" v-bind="activeChat" />
      </b-col>
      <b-col cols="0" md="3">
        Ads go here
      </b-col>
    </b-row>
  </b-col>
</template>
<style scoped>
.chatback {
  background-color: #f3f0da;
}

.active {
  background-color: rgb(245, 245, 245);
}
</style>
<script>
import ChatPane from '~/components/ChatPane.vue'
import ChatListEntry from '~/components/ChatListEntry.vue'
import requestIdleCallback from '~/assets/js/requestIdleCallback'

export default {
  middleware: 'auth',

  components: {
    ChatPane,
    ChatListEntry
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
    let selected = null
    let chats = Object.values(store.getters['chats/list']())

    if (!store.$auth.loggedIn) {
      console.log('Not logged in')
    } else {
      if (chats) {
        // Got some - can start rendering.  Fire off an update to refresh us later if they've changed.  No rush, so
        // wait for idle.
        requestIdleCallback(() => {
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
