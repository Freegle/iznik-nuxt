import InfiniteLoading from 'vue-infinite-loading'
import ModMessage from '@/components/ModMessage'
import GroupSelect from '@/components/GroupSelect'

export default {
  layout: 'modtools',
  components: { ModMessage, GroupSelect, InfiniteLoading },
  data: function() {
    return {
      context: null,
      // We fetch less stuff at once for MT.  This is because for slow devices and networks the time to fetch and
      // render is significant, and each of these consumes a lot of screen space.  So by fetching and rendering less,
      // we increase how fast it feels.
      distance: 1000,
      limit: 2,
      workType: null,
      show: 0,
      busy: false
    }
  },
  computed: {
    visibleMessages() {
      return this.messages.slice(0, this.show)
    },
    messages() {
      let messages

      if (this.groupid) {
        messages = this.$store.getters['messages/getByGroup'](this.groupid)
      } else {
        messages = this.$store.getters['messages/getAll']
      }

      // We need to sort as otherwise new messages may appear at the end.
      messages.sort((a, b) => {
        if (a.groups && b.groups) {
          return (
            new Date(b.groups[0].arrival).getTime() -
            new Date(a.groups[0].arrival).getTime()
          )
        } else {
          return new Date(b.arrival).getTime() - new Date(a.arrival).getTime()
        }
      })

      return messages
    },
    work() {
      // Count for the type of work we're interested in.
      const work = this.$store.getters['auth/work']
      const count = this.workType ? work[this.workType] : 0
      return count
    }
  },
  watch: {
    groupid() {
      this.context = null
      this.show = 0
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
    },
    work(newVal, oldVal) {
      if (newVal > oldVal) {
        // There's new stuff to fetch.
        this.$store.dispatch('messages/clearContext')

        this.$store.dispatch('messages/fetchMessages', {
          groupid: this.groupid,
          collection: this.collection,
          modtools: true,
          summary: false,
          limit: Math.max(this.limit, newVal)
        })

        // Force them to show.
        let messages

        if (this.groupid) {
          messages = this.$store.getters['messages/getByGroup'](this.groupid)
        } else {
          messages = this.$store.getters['messages/getAll']
        }

        this.show = messages.length
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
      this.busy = true

      if (this.show < this.messages.length) {
        // This means that we will gradually add the messages that we have fetched from the server into the DOM.
        // Doing that means that we will complete our initial render more rapidly and thus appear faster.
        this.show++
        $state.loaded()
      } else {
        const currentCount = this.messages.length

        this.$store
          .dispatch('messages/fetchMessages', {
            groupid: this.groupid,
            collection: this.collection,
            modtools: true,
            summary: false,
            context: this.context,
            limit: this.limit
          })
          .then(() => {
            this.context = this.$store.getters['messages/getContext']

            if (currentCount === this.messages.length) {
              this.complete = true
              this.busy = false
              $state.complete()
            } else {
              $state.loaded()
              this.busy = false
              this.show++
            }
          })
          .catch(e => {
            $state.complete()
            console.log('Complete on error', e)
            this.busy = false
          })
      }
    }
  }
}
