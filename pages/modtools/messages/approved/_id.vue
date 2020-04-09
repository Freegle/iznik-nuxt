<template>
  <div>
    <client-only>
      <div class="d-flex justify-content-between flex-wrap">
        <GroupSelect v-model="groupid" all modonly />
        <ModFindMessage />
      </div>
      <div>
        <div v-for="message in visibleMessages" :key="'messagelist-' + message.id" class="p-0 mt-2">
          <ModMessage :message="message" />
        </div>

        <NoticeMessage v-if="!messages.length && !busy" class="mt-2">
          There are no messages at the moment.  This will refresh automatically.
        </NoticeMessage>

        <infinite-loading :key="'infinite-' + groupid" force-use-infinite-wrapper="body" :distance="distance" @infinite="loadMore">
          <span slot="no-results" />
          <span slot="no-more" />
          <span slot="spinner">
            <b-img-lazy src="~/static/loader.gif" alt="Loading" />
          </span>
        </infinite-loading>
      </div>
    </client-only>
  </div>
</template>
<script>
import NoticeMessage from '../../../../components/NoticeMessage'
import ModMessage from '../../../../components/ModMessage'
import GroupSelect from '../../../../components/GroupSelect'
import ModFindMessage from '../../../../components/ModFindMessage'
import loginRequired from '@/mixins/loginRequired'
import modMessagesPage from '@/mixins/modMessagesPage'
import createGroupRoute from '@/mixins/createGroupRoute'

export default {
  components: { ModFindMessage, GroupSelect, ModMessage, NoticeMessage },
  layout: 'modtools',
  mixins: [
    loginRequired,
    createGroupRoute('modtools/messages/approved'),
    modMessagesPage
  ],
  data: function() {
    return {
      collection: 'Approved'
    }
  }
}
</script>
