<template>
  <div>
    <client-only>
      <ScrollToTop />
      <GroupSelect v-model="groupid" all modonly :work="['editreview']" remember="edits" />
      <NoticeMessage v-if="!messages.length && !busy" class="mt-2">
        There are no messages at the moment.  This will refresh automatically.
      </NoticeMessage>
      <div v-for="message in visibleMessages" :key="'messagelist-' + message.id" class="p-0 mt-2">
        <ModMessage :message="message" editreview />
      </div>

      <infinite-loading :key="'infinite-' + groupid + '-' + messages.length" force-use-infinite-wrapper="body" :distance="distance" @infinite="loadMore">
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
import modMessagesPage from '@/mixins/modMessagesPage'
import createGroupRoute from '@/mixins/createGroupRoute'
import ScrollToTop from '../../../../components/ScrollToTop'
import NoticeMessage from '../../../../components/NoticeMessage'

export default {
  components: { ScrollToTop, NoticeMessage },
  layout: 'modtools',
  mixins: [
    loginRequired,
    createGroupRoute('modtools/messages/edits'),
    modMessagesPage
  ],
  data: function() {
    return {
      collection: 'Edit',
      workType: 'editreview',
      limit: 20
    }
  }
}
</script>
