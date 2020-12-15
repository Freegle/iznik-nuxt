<template>
  <div>
    <client-only>
      <ScrollToTop />
      <ModHelpComments />
      <ModCommentUser v-for="comment in visibleComments" :key="'commentlist-' + comment.id" :comment="comment" class="p-0 mt-2" />
      <NoticeMessage v-if="!comments.length && !busy" class="mt-2">
        There are no comments to show at the moment.
      </NoticeMessage>

      <infinite-loading force-use-infinite-wrapper="body" :distance="distance" @infinite="loadMore">
        <span slot="no-results" />
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
import NoticeMessage from '@/components/NoticeMessage'
import loginRequired from '@/mixins/loginRequired'
import ScrollToTop from '../../../../components/ScrollToTop'
import ModHelpComments from '../../../../components/ModHelpComments'
import ModCommentUser from '../../../../components/ModCommentUser'

export default {
  components: {
    ModCommentUser,
    ModHelpComments,
    ScrollToTop,
    NoticeMessage,
    InfiniteLoading
  },
  layout: 'modtools',
  mixins: [loginRequired],
  data: function() {
    return {
      context: null,
      distance: 1000,
      limit: 2,
      show: 0,
      busy: false,
      complete: false
    }
  },
  computed: {
    visibleComments() {
      return this.comments.slice(0, this.show)
    },
    comments() {
      return this.$store.getters['comments/sortedList']
    }
  },
  mounted() {
    this.$store.dispatch('comments/clear')
  },
  methods: {
    async loadMore($state) {
      this.busy = true

      if (this.show < this.comments.length) {
        // This means that we will gradually add the members that we have fetched from the server into the DOM.
        // Doing that means that we will complete our initial render more rapidly and thus appear faster.
        this.show++
        $state.loaded()
      } else {
        const currentCount = this.comments.length

        try {
          await this.$store.dispatch('comments/fetch', {
            context: this.context
          })

          this.context = this.$store.getters['comments/getContext']
          console.log('Context', this.context)

          if (currentCount === this.comments.length) {
            this.complete = true
            this.busy = false
            $state.complete()
          } else {
            $state.loaded()
            this.busy = false
            this.show++
          }
        } catch (e) {
          $state.complete()
          this.busy = false
          console.log('Complete on error', e)
        }
      }
    }
  }
}
</script>
<style scoped>
select {
  max-width: 300px;
}
</style>
