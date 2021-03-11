<template>
  <div>
    <client-only>
      <ModCakeModal />
      <ScrollToTop />
      <div class="d-flex justify-content-between">
        <GroupSelect v-model="groupid" all modonly :work="['pending', 'pendingother']" remember="pending" />
        <b-btn variant="link" @click="loadAll">
          Load all
        </b-btn>
      </div>
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
      <div ref="end" />
    </client-only>
  </div>
</template>
<script>
import loginRequired from '@/mixins/loginRequired'
import modMessagesPage from '@/mixins/modMessagesPage'
import createGroupRoute from '@/mixins/createGroupRoute'
import ModCakeModal from '@/components/ModCakeModal'
import NoticeMessage from '../../../../components/NoticeMessage'
import ScrollToTop from '../../../../components/ScrollToTop'
import GroupSelect from '../../../../components/GroupSelect'
import ModMessage from '../../../../components/ModMessage'

export default {
  components: {
    ModCakeModal,
    ModMessage,
    GroupSelect,
    ScrollToTop,
    NoticeMessage
  },
  layout: 'modtools',
  mixins: [
    loginRequired,
    createGroupRoute('modtools/messages/pending'),
    modMessagesPage
  ],
  data: function() {
    return {
      collection: 'Pending',
      workType: 'pending'
    }
  },
  methods: {
    async loadAll() {
      // This is a bit of a hack - we clear the store and fetch 1000 messages, which is likely to be all of them.
      this.limit = 1000
      await this.$store.dispatch('messages/clearContext')
      await this.$store.dispatch('messages/clear')
      const self = this

      this.loadMore({
        loaded() {
          self.show = self.messages.length
          self.$nextTick(() => {
            self.$refs.end.scrollIntoView()
          })
        },
        complete() {
          self.show = self.messages.length
          self.$nextTick(() => {
            self.$refs.end.scrollIntoView()
          })
        }
      })
    }
  }
}
</script>
