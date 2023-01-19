<template>
  <div>
    <client-only>
      <ScrollToTop />
      <ModHelpComments />
      <GroupSelect v-model="groupid" modonly all />
      <ModCommentUser v-for="comment in visibleComments" :key="'commentlist-' + comment.id" :comment="comment" class="p-0 mt-2" />
      <NoticeMessage v-if="!comments.length && !busy" class="mt-2">
        There are no comments to show at the moment.
      </NoticeMessage>

      <infinite-loading :key="bump" force-use-infinite-wrapper="body" :distance="distance" @infinite="loadMore">
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
import loginRequired from '@/mixins/loginRequired'
import ScrollToTop from '~/components/ScrollToTop'
import ModHelpComments from '~/components/ModHelpComments'
import ModCommentUser from '~/components/ModCommentUser'
import NoticeMessage from '~/components/NoticeMessage'
import GroupSelect from '~/components/GroupSelect'

export default {
  components: {
    ModCommentUser,
    ModHelpComments,
    ScrollToTop,
    NoticeMessage,
    InfiniteLoading,
    GroupSelect
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
      complete: false,
      groupid: null,
      bump: 1
    }
  },
  computed: {
    filteredComments() {
      return this.comments.filter(c => {
        return (
          this.groupid === null ||
          this.groupid === c.groupid ||
          c.flag ||
          c.byuser?.id === this.myid
        )
      })
    },
    visibleComments() {
      return this.filteredComments.slice(0, this.show)
    },
    comments() {
      return this.$store.getters['comments/sortedList']
    }
  },
  watch: {
    groupid() {
      this.bump++
      this.context = null
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
            context: this.context,
            groupid: this.groupid
          })

          this.context = this.$store.getters['comments/getContext']

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
