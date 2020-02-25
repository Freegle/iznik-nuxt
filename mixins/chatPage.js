const requestIdleCallback = () => import('~/assets/js/requestIdleCallback')

export default {
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

  validate({ params }) {
    // Must be a number if present
    return !params.id || /^\d+$/.test(params.id)
  },

  computed: {
    sortedChats() {
      // We sort chats by RSVP first, then unread, then last time.
      let chats = Object.values(this.$store.getters['chats/list'])

      chats.sort(function(a, b) {
        const aexpected = a.replyexpected
        const bexpected = b.replyexpected
        let ret = null

        if (aexpected !== bexpected) {
          ret = bexpected - aexpected
        } else {
          const aunseen = Math.max(0, a.unseen)
          const bunseen = Math.max(0, b.unseen)
          if (bunseen !== aunseen) {
            ret = bunseen - aunseen
          } else {
            ret = new Date(b.lastdate) - new Date(a.lastdate)
          }
        }

        return ret
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

      requestIdleCallback(() => this.listChats)
    } else {
      // Not got any - need to get them before we can proceed.
      await this.listChats()
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
    async listChats() {
      const modtools = this.$store.getters['misc/get']('modtools')
      await this.$store.dispatch('chats/listChats', {
        chattypes: modtools ? ['User2Mod'] : ['User2User', 'User2Mod']
      })
    },

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

        const modtools = this.$store.getters['misc/get']('modtools')

        await this.$store.dispatch('chats/listChats', {
          search: val,
          summary: true,
          chattypes: modtools ? ['User2Mod'] : ['User2User', 'User2Mod']
        })

        this.clientSearch = false

        while (this.searchlast) {
          // We have another search queued.
          const val2 = this.searchlast
          this.searchlast = null
          await this.$store.dispatch('chats/listChats', {
            search: val2,
            summary: true
          })
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
  }
}
