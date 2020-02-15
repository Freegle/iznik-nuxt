<template>
  <div>
    <client-only>
      <GroupSelect v-model="groupid" all modonly />
      <div v-for="message in messages" :key="'messagelist-' + message.id" class="p-0 mt-2">
        <ModMessage :message="message" />
      </div>

      <infinite-loading :key="'infinite-' + groupid" force-use-infinite-wrapper="body" :distance="distance" @infinite="loadMore">
        <span slot="no-results">
          There are no messages at the moment.
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
import loginRequired from '@/mixins/loginRequired'
import modMessagesPage from '@/mixins/modMessagesPage'
import createGroupRoute from '@/mixins/createGroupRoute'

export default {
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
