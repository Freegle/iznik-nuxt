<template>
  <div>
    <client-only>
      <ScrollToTop />
      <ModHelpMemberReview />
      <ModPostcodeTester />
      <div v-for="member in visibleMembers" :key="'memberlist-' + member.id" class="p-0 mt-2">
        <ModMemberReview :member="member" />
      </div>

      <NoticeMessage v-if="!members.length && !busy" class="mt-2">
        There are no members at the moment.
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
import loginRequired from '@/mixins/loginRequired'
import modMembersPage from '@/mixins/modMembersPage'
import ScrollToTop from '~/components/ScrollToTop'
import ModHelpMemberReview from '~/components/ModHelpMemberReview'
import ModMemberReview from '~/components/ModMemberReview'
import NoticeMessage from '~/components/NoticeMessage'
import ModPostcodeTester from '~/components/ModPostcodeTester'

export default {
  components: {
    ModHelpMemberReview,
    ModPostcodeTester,
    ScrollToTop,
    NoticeMessage,
    ModMemberReview
  },
  layout: 'modtools',
  mixins: [loginRequired, modMembersPage],
  data: function() {
    return {
      collection: 'Spam'
    }
  }
}
</script>
