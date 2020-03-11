<template>
  <div>
    <client-only>
      <GroupSelect v-model="groupid" all modonly :work="['spam', 'spamother']" />
      <NoticeMessage v-if="!messages.length && !busy" class="mt-2">
        There are no messages at the moment.  This will refresh automatically.
      </NoticeMessage>
      <div v-for="message in visibleMessages" :key="'messagelist-' + message.id" class="p-0 mt-2">
        <ModMessage :message="message" />
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
import NoticeMessage from '../../../../components/NoticeMessage'
import GroupSelect from '../../../../components/GroupSelect'
import loginRequired from '@/mixins/loginRequired'
import modMessagesPage from '@/mixins/modMessagesPage'
import createGroupRoute from '@/mixins/createGroupRoute'

export default {
  components: { GroupSelect, NoticeMessage },
  layout: 'modtools',
  mixins: [
    loginRequired,
    createGroupRoute('modtools/messages/review'),
    modMessagesPage
  ],
  data: function() {
    return {
      collection: 'Spam',
      workType: 'spam'
    }
  }
}
</script>
