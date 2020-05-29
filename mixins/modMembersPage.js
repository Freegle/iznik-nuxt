import InfiniteLoading from 'vue-infinite-loading'
import ModMember from '@/components/ModMember'
import GroupSelect from '@/components/GroupSelect'

export default {
  layout: 'modtools',
  components: { ModMember, GroupSelect, InfiniteLoading },
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
      busy: false,
      collection: 'Approved',
      search: null,
      filter: 0,
      modalOpen: false
    }
  },
  computed: {
    visibleMembers() {
      return this.members.slice(0, this.show)
    },
    members() {
      let members

      if (this.groupid) {
        members = this.$store.getters['members/getByGroup'](this.groupid)
      } else {
        members = this.$store.getters['members/getAll']
      }

      return members
    },
    work() {
      // Count for the type of work we're interested in.
      const work = this.$store.getters['auth/work']
      const count = this.workType ? work[this.workType] : 0
      return count
    },
    group() {
      return this.$store.getters['group/get'](this.groupid)
    }
  },
  watch: {
    groupid(oldValue, newValue) {
      this.context = null
      this.show = 0
      this.$store.dispatch('members/clear')
    },
    filter() {
      this.context = null
      this.show = 0
      this.$store.dispatch('members/clear')
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
      if (!this.modalOpen) {
        if (newVal > oldVal) {
          // There's new stuff to do.  Reload.
          this.$store.dispatch('members/clear')
          this.show = 0
          this.context = null
        } else {
          const visible = this.$store.getters['misc/get']('visible')

          if (!visible) {
            // If we're not visible, then clear what we have in the store.  We don't want to do that under our own
            // feet, but if we do this then we will pick up changes from other people and avoid confusion.
            this.$store.dispatch('members/clear')
            this.show = 0
            this.context = null
          }
        }
      }
    }
  },
  mounted() {
    // Ensure we have no cached members for other searches/groups
    this.$store.dispatch('members/clear')

    // Get our list of groups
    this.$store.dispatch('auth/fetchUser', {
      components: ['me', 'groups']
    })

    if (process.client && this.groupid) {
      this.$store.dispatch('group/fetch', {
        id: this.groupid
      })
    }

    // Keep track of whether we have a modal open, so that we don't clear messages under its feet.
    this.$root.$on('bv::modal::show', (bvEvent, modalId) => {
      this.modalOpen = true
    })

    this.$root.$on('bv::modal::hidden', (bvEvent, modalId) => {
      this.modalOpen = false
    })
  },
  methods: {
    loadMore: function($state) {
      this.busy = true

      if (this.show < this.members.length) {
        // This means that we will gradually add the members that we have fetched from the server into the DOM.
        // Doing that means that we will complete our initial render more rapidly and thus appear faster.
        this.show++
        $state.loaded()
      } else {
        const currentCount = this.members.length

        this.$store
          .dispatch('members/fetchMembers', {
            groupid: this.groupid,
            collection: this.collection,
            modtools: true,
            summary: false,
            context: this.context,
            limit: this.limit,
            search: this.search,
            filter: this.filter
          })
          .then(() => {
            this.context = this.$store.getters['members/getContext']

            if (currentCount === this.members.length) {
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
            this.busy = false
            console.log('Complete on error', e)
          })
      }
    }
  }
}
