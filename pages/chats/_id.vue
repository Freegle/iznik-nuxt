<template>
  <b-row class="m-0">
    <b-col cols="12" md="3" class="chatlist p-0 bg-white">
      <b-card class="p-0">
        <b-card-body class="p-0">
          <b-row>
            <b-col>
              <b-form-input placeholder="Search chats" />
            </b-col>
            <b-col>
              <b-btn class="float-right" variant="white" @click="markAllRead">
                <v-icon name="check" /> Mark all read
              </b-btn>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
      <ul v-for="(chat, $index) in sortedChats" :key="'chat-' + $index" class="p-0 pt-1 list-unstyled mb-1">
        <li :class="{ active: activeChat && parseInt(activeChat.id) === parseInt(chat.id) }">
          <ChatListEntry :key="'ChatListEntry-' + chat.id" v-bind="chat" />
        </li>
      </ul>
    </b-col>
    <b-col cols="12" md="6" class="chatback">
      <chatPane v-if="activeChat" v-bind="activeChat" />
    </b-col>
    <b-col cols="0" md="3">
      Ads go here
    </b-col>
  </b-row>
</template>
<style scoped>
.chatback {
  background-color: #f9f7ec;
}

.active {
  background-color: rgb(245, 245, 245);
}
</style>
<script>
import loginRequired from '@/mixins/loginRequired.js'
const ChatPane = () => import('~/components/ChatPane.vue')
const ChatListEntry = () => import('~/components/ChatListEntry.vue')
const requestIdleCallback = () => import('~/assets/js/requestIdleCallback')

export default {
  components: {
    ChatPane,
    ChatListEntry
  },
  mixins: [loginRequired],

  validate({ params }) {
    // Must be a number if present
    return !params.id || /^\d+$/.test(params.id)
  },

  data() {
    return {
      selectedChatId: null
    }
  },

  computed: {
    sortedChats() {
      console.log('Compute sorted')
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
      let ret = null

      if (this.selectedChatId) {
        // We have selected one - try to find it
        ret = this.sortedChats.find(
          chat => parseInt(chat.id) === parseInt(this.selectedChatId)
        )
      } else if (this.sortedChats) {
        // None selected - use the first if we have some.
        ret = this.sortedChats[0]
      }

      return ret
    }
  },

  async asyncData({ app, params, store }) {
    let chats = Object.values(store.getters['chats/list']())

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

    return {
      chats: chats
    }
  },

  created() {
    this.selectedChatId = this.$route.params.id
  },
  methods: {
    async markAllRead() {
      for (const chat of this.sortedChats) {
        if (chat.unseen) {
          await this.$store.dispatch('chat/markSeen', {
            id: chat.id
          })
        }
      }
    }
  }
}
</script>
