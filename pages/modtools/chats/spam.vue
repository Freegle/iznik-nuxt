<template>
  <div>
    <client-only>
      <div v-for="message in visibleMessages" :key="'messagelist-' + message.id" class="p-0 mt-2">
        <ModChatReview :message="message" />
      </div>
      <infinite-loading force-use-infinite-wrapper="body" :distance="distance" @infinite="loadMore">
        <span slot="no-results">
          There are no chat messages to review at the moment.
        </span>
        <span slot="no-more" />
        <span slot="spinner">
          <b-img-lazy src="~/static/loader.gif" alt="Loading" />
        </span>
      </infinite-loading>
    </client-only>
  </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import ModChatReview from '../../../components/ModChatReview'
import loginRequired from '@/mixins/loginRequired.js'

// We need an id for the store.  This is as good as any.
const REVIEWCHAT = 0

export default {
  layout: 'modtools',
  components: {
    ModChatReview,
    InfiniteLoading
  },
  mixins: [loginRequired],
  data: function() {
    return {
      context: null,
      // We fetch less stuff at once for MT.  This is because for slow devices and networks the time to fetch and
      // render is significant, and each of these consumes a lot of screen space.  So by fetching and rendering less,
      // we increase how fast it feels.
      distance: 1000,
      limit: 5,
      show: 0
    }
  },
  computed: {
    visibleMessages() {
      return this.messages.slice(0, this.show)
    },
    messages() {
      const ret = this.$store.getters['chatmessages/getMessages'](REVIEWCHAT)
      console.log('Got messages', ret)
      return ret
    },
    work() {
      // Count for the type of work we're interested in.
      const work = this.$store.getters['auth/work']
      return work.chatreview
    }
  },
  watch: {
    work(newVal, oldVal) {
      console.log('Work change', newVal, oldVal)
      if (newVal > oldVal) {
        // There's new stuff to do.  Reload.
        this.$store.dispatch('chatmessages/clearContext', {
          id: REVIEWCHAT
        })
        this.$store.dispatch('chatmessages/clearMessages')
      }
    }
  },
  mounted() {
    // We don't want to pick up any real chat messages.
    this.$store.dispatch('chatmessages/clearContext', {
      id: REVIEWCHAT
    })
    this.$store.dispatch('chatmessages/clearMessages')
  },
  methods: {
    loadMore: function($state) {
      if (this.show < this.messages.length) {
        // This means that we will gradually add the messages that we have fetched from the server into the DOM.
        // Doing that means that we will complete our initial render more rapidly and thus appear faster.
        this.show++
        $state.loaded()
      } else {
        const currentCount = this.messages.length

        this.$store
          .dispatch('chatmessages/fetch', {
            chatid: REVIEWCHAT,
            context: this.context,
            limit: this.limit
          })
          .then(() => {
            this.context = this.$store.getters['chatmessages/getContext']

            if (currentCount === this.messages.length) {
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
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
</style>
