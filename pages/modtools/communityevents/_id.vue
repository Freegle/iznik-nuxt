<template>
  <div>
    <div v-for="event in events" :key="'eventlist-' + event.id" class="p-0 mt-2">
      <ModCommunityEvent :event="event" />
    </div>
    <NoticeMessage v-if="!Object.keys(events).length && !busy" class="mt-2">
      There are no community events to review at the moment.  This will refresh automatically.
    </NoticeMessage>

    <infinite-loading force-use-infinite-wrapper="body" :distance="distance" @infinite="loadMore">
      <span slot="no-results" />
      <span slot="no-more" />
      <span slot="spinner">
        <b-img-lazy src="~/static/loader.gif" alt="Loading" />
      </span>
    </infinite-loading>
  </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import ModCommunityEvent from '../../../components/ModCommunityEvent'
import NoticeMessage from '../../../components/NoticeMessage'
import loginRequired from '@/mixins/loginRequired.js'

export default {
  layout: 'modtools',
  components: { NoticeMessage, ModCommunityEvent, InfiniteLoading },
  mixins: [loginRequired],
  data: function() {
    return {
      distance: 1000,
      limit: 2,
      show: 0,
      busy: false
    }
  },
  computed: {
    events() {
      return this.$store.getters['communityevents/list']
    },
    work() {
      // Count for the type of work we're interested in.
      const work = this.$store.getters['auth/work']
      return work.pendingevents
    },
    context() {
      return this.$store.getters['communityevents/getContext']
    }
  },
  watch: {
    work(newVal, oldVal) {
      if (newVal > oldVal) {
        // There's new stuff to do.  Reload.
        this.$store.dispatch('communityevents/clear')
      } else {
        const visible = this.$store.getters['misc/get']('visible')

        if (!visible) {
          this.$store.dispatch('communityevents/clear')
        }
      }
    }
  },
  mounted() {
    // We don't want to pick up any approved events.
    this.$store.dispatch('communityevents/clear')
  },
  methods: {
    loadMore: function($state) {
      this.busy = true

      if (this.show < this.events.length) {
        // This means that we will gradually add the events that we have fetched from the server into the DOM.
        // Doing that means that we will complete our initial render more rapidly and thus appear faster.
        this.show++
        $state.loaded()
      } else {
        const currentCount = this.events.length

        this.$store
          .dispatch('communityevents/fetch', {
            context: this.context,
            limit: this.limit,
            pending: true
          })
          .then(() => {
            if (currentCount === this.events.length) {
              this.complete = true
              $state.complete()
            } else {
              $state.loaded()
              this.show++
            }
          })
          .catch(e => {
            $state.complete()
            console.log('Complete on error', e)
          })
          .finally(() => {
            this.busy = false
          })
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
</style>
