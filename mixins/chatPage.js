export default {
  data() {
    return {
      search: null,
      searching: null,
      searchlast: null,
      distance: 100,
      showChats: 20,
      complete: false,
      bump: Date.now()
    }
  },

  validate({ params }) {
    // Must be a number if present
    return !params.id || /^\d+$/.test(params.id)
  },

  computed: {
    selectedChatId: {
      get() {
        return this.$store.getters['chats/currentChat']
      },
      async set(newVal) {
        await this.$store.dispatch('chats/currentChat', {
          chatid: newVal
        })

        if (newVal) {
          const chat = this.$store.getters['chats/get'](newVal)

          // We can only fetch the messages if this is one of our chats, otherwise we'll get an error.
          if (chat) {
            await this.$store.dispatch('chatmessages/clearContext', {
              chatid: newVal
            })
            await this.$store.dispatch('chatmessages/fetch', {
              chatid: newVal
            })
          }
        }

        this.bump = Date.now()
      }
    },
    sortedChats() {
      // We sort chats by RSVP first, then unread, then last time.
      const chats = Object.values(this.$store.getters['chats/list'])
      let ret = null

      chats.sort((a, b) => {
        if (!a.id || !b.id) {
          console.log('Invalid chats', a, b)
        }

        const aexpected = a.replyexpected && !a.replyreceived
        const bexpected = b.replyexpected && !b.replyreceived
        const aunseen = Math.max(0, a.unseen)
        const bunseen = Math.max(0, b.unseen)

        if (aexpected !== bexpected) {
          ret = bexpected - aexpected
        } else if (aunseen && !bunseen) {
          ret = -1
        } else if (bunseen && !aunseen) {
          ret = 1
        } else if (a.lastdate && !b.lastdate) {
          ret = -1
        } else if (b.lastdate && !a.lastdate) {
          ret = 1
        } else {
          ret = new Date(b.lastdate) - new Date(a.lastdate)
        }

        return ret
      })

      return chats
    },

    filteredChats() {
      let chats = this.sortedChats

      if (chats && this.search && this.searching) {
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

      const modtools = this.$store.getters['misc/get']('modtools')

      if (modtools) {
        // We want to filter out any chats which are between users - they shouldn't show on MT and can be in the store
        // if we are viewing reported chats.
        chats = chats.filter(chat => chat.chattype !== 'User2User')
      }

      return chats
    },

    visibleChats() {
      const chats = this.filteredChats
        ? this.filteredChats.slice(0, this.showChats)
        : []

      return chats
    }
  },

  mounted() {
    // Fetch up to date chats.  We may already have some in store, in which case we'll render them, but we want to
    // get the up to date ones.
    this.listChats()
  },

  created() {
    this.selectedChatId = parseInt(this.$route.params.id) || null
  },

  watch: {
    filteredChats(newVal, oldVal) {
      // We've changed what we're filtering on so reset what we show.
      this.complete = false
      this.bump = Date.now()
    },
    search(newVal, oldVal) {
      this.showChats = 0
      this.bump = Date.now()

      if (!newVal) {
        // Force a refresh to remove any old chats.
        this.listChats()
      } else {
        // Force a server search to pick up old chats or more subtle matches.
        this.searchMore()
      }
    }
  },

  methods: {
    async listChats(age) {
      const modtools = this.$store.getters['misc/get']('modtools')
      await this.$store.dispatch('chats/listChats', {
        chattypes: modtools
          ? ['User2Mod', 'Mod2Mod']
          : ['User2User', 'User2Mod'],
        age: age || null
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
    async searchMore() {
      if (this.searching) {
        // Queue until we've finished.
        this.searchlast = this.search
      } else {
        this.searching = this.search

        const modtools = this.$store.getters['misc/get']('modtools')

        await this.$store.dispatch('chats/listChats', {
          search: this.search,
          summary: true,
          chattypes: modtools
            ? ['User2Mod', 'Mod2Mod']
            : ['User2User', 'User2Mod']
        })

        this.showChats = 0

        while (this.searchlast) {
          // We have another search queued.
          const val2 = this.searchlast
          this.searching = this.searchlast
          this.searchlast = null
          await this.$store.dispatch('chats/listChats', {
            search: val2,
            summary: true,
            chattypes: modtools
              ? ['User2Mod', 'Mod2Mod']
              : ['User2User', 'User2Mod']
          })

          this.showChats = 0
        }

        this.searching = null
      }
    },

    loadMore: function($state) {
      // We use an infinite scroll on the list of chats because even though we have all the data in hand, the less
      // we render onscreen the faster vue is to do so.
      const chats = this.filteredChats
      this.showChats++

      if (this.showChats > chats.length) {
        this.showChats = chats.length
        $state.complete()
        this.complete = true
      } else {
        $state.loaded()
      }
    }
  },

  beforeRouteLeave(to, from, next) {
    if (to === '/chats' && this.selectedChatId) {
      // No longer have a chat selected.  This can happen because of the history element we add above.
      this.selectedChatId = null
      next(false)
    } else {
      next()
    }
  }
}
