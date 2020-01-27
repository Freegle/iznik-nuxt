<template>
  <client-only>
    <b-row class="m-0">
      <b-col id="chatlist" cols="12" md="3" xl="2" :class="'chatlist p-0 bg-white ' + (selectedChatId ? 'd-none d-md-block' : '') + ' ' + selectedChatId">
        <b-card class="p-0">
          <b-card-body class="p-0">
            <b-row>
              <b-col>
                <b-form-input v-model="search" placeholder="Search chats" @update="searchChange" />
              </b-col>
              <b-col>
                <b-btn class="float-right" variant="white" @click="markAllRead">
                  <v-icon name="check" /> Mark all read
                </b-btn>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
        <ul v-for="chat in sortedChats" :key="'chat-' + chat.id" class="p-0 pt-1 list-unstyled mb-1">
          <li :class="{ active: chat && parseInt(activeChat) === parseInt(chat.id) }">
            <ChatListEntry :id="chat.id" />
          </li>
        </ul>
        <client-only>
          <infinite-loading force-use-infinite-wrapper="#chatlist" :distance="distance" @infinite="loadMore">
            <span slot="no-results" />
            <span slot="no-more" />
          </infinite-loading>
        </client-only>
      </b-col>
      <b-col cols="12" md="9" xl="7" :class="'chatback ' + (selectedChatId ? 'd-block' : 'd-none d-md-block')">
        <ChatPane v-if="activeChat" :id="activeChat" />
      </b-col>
      <b-col cols="0" xl="3" class="d-none d-xl-block p-0 pl-1">
        <SidebarRight :show-volunteer-opportunities="false" :show-job-opportunities="true" />
      </b-col>
    </b-row>
  </client-only>
</template>

<style scoped lang="scss">
@import 'color-vars';

.chatback {
  background-color: $color-yellow--light;
}

.active {
  background-color: $color-gray--lighter;
}

.chatlist {
  max-height: calc(100vh - 74px);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import SidebarRight from '../../components/SidebarRight'
import buildHead from '@/mixins/buildHead'
import loginRequired from '@/mixins/loginRequired.js'

// We can't use async on ChatListEntry else the infinite scroll kicks in and tries to load everything while we are
// still waiting for the import to complete.
import ChatListEntry from '~/components/ChatListEntry.vue'
const ChatPane = () => import('~/components/ChatPane.vue')
const requestIdleCallback = () => import('~/assets/js/requestIdleCallback')

export default {
  components: {
    InfiniteLoading,
    SidebarRight,
    ChatPane,
    ChatListEntry
  },
  mixins: [loginRequired, buildHead],

  validate({ params }) {
    // Must be a number if present
    return !params.id || /^\d+$/.test(params.id)
  },

  data() {
    return {
      selectedChatId: null,
      search: null,
      searching: null,
      searchlast: null,
      distance: 100,
      showChats: 5,
      clientSearch: true
    }
  },

  computed: {
    sortedChats() {
      // We sort chats by unread first, then
      let chats = Object.values(this.$store.getters['chats/list'])

      chats.sort(function(a, b) {
        if (b.unseen !== a.unseen) {
          return b.unseen - a.unseen
        } else {
          return new Date(b.lastdate) - new Date(a.lastdate)
        }
      })

      if (this.search && this.clientSearch) {
        // We apply the search on names in here so that we can respond on the client rapidly while the background server
        // search is more thorough.
        const l = this.search.toLowerCase()
        chats = chats.filter(chat => {
          if (
            chat.name.toLowerCase().indexOf(l) !== -1 ||
            (chat.snippet && chat.snippet.toLowerCase().indexOf(l) !== -1)
          ) {
            // Found in the name of the chat (which may include a user
            return true
          }

          return false
        })
      }

      return chats.slice(0, this.showChats)
    },

    activeChat() {
      // Selected chat if present, otherwise first chat if we have one.
      let ret = null

      if (this.selectedChatId) {
        // We have selected one - try to find it
        return this.selectedChatId
      } else if (this.sortedChats && this.sortedChats.length) {
        // None selected - use the first if we have some.
        ret = this.sortedChats[0].id
      }

      return ret
    }
  },

  async asyncData({ app, params, store }) {
    let chats = Object.values(store.getters['chats/list'])

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

    chats = Object.values(store.getters['chats/list'])

    return {
      chats: chats
    }
  },

  created() {
    this.selectedChatId = parseInt(this.$route.params.id) || null
  },
  methods: {
    async markAllRead() {
      for (const chat of this.sortedChats) {
        if (chat.unseen) {
          await this.$store.dispatch('chats/markSeen', {
            id: chat.id
          })
        }
      }
    },
    async searchChange(val) {
      // Trigger a server search
      if (this.searching) {
        // Queue until we've finished.
        this.searchlast = val
      } else {
        this.searching = val
        this.clientSearch = true

        await this.$store.dispatch('chats/listChats', {
          search: val,
          summary: true
        })

        this.chats = Object.values(this.$store.getters['chats/list'])
        this.clientSearch = false

        while (this.searchlast) {
          // We have another search queued.
          const val2 = this.searchlast
          this.searchlast = null
          await this.$store.dispatch('chats/listChats', {
            search: val2,
            summary: true
          })

          this.chats = Object.values(this.$store.getters['chats/list'])
        }

        this.searching = null
      }
    },

    loadMore: function($state) {
      // We use an infinite scroll on the list of chats because even though we have all the data in hand, the less
      // we render onscreen the faster vue is to do so.
      const chats = Object.values(this.$store.getters['chats/list'])

      this.showChats += 5

      if (this.showChats > chats.length) {
        this.showChats = chats.length
        $state.complete()
      } else {
        $state.loaded()
      }
    }
  },
  head() {
    return this.buildHead(
      'Chats',
      "See the conversations you're having with other freeglers."
    )
  }
}
</script>
