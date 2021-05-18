<template>
  <div>
    <client-only>
      <ScrollToTop />
      <ModCakeModal />
      <PreCovidModeration />
      <NoticeMessage variant="info" class="mb-2 d-block d-md-none">
        ZoomStock <span class="font-weight-bold">Thursdays @ 10am</span>.  Join other volunteers for a natter -
        <!-- eslint-disable-next-line-->
        <ExternalLink href="https://zoom.us/j/97817491680?pwd=VVh2eW1LL2JhbnB5MllQbHoyRUJ6UT09" class="text-info">click here</ExternalLink>.
      </NoticeMessage>
      <div class="d-flex justify-content-between">
        <GroupSelect v-model="groupid" all modonly :work="['pending', 'pendingother']" remember="pending" />
        <b-btn variant="link" @click="loadAll">
          Load all
        </b-btn>
      </div>
      <NoticeMessage v-if="!messages.length && !busy" class="mt-2">
        There are no messages at the moment.  This will refresh automatically.
      </NoticeMessage>
      <div v-for="(message, ix) in visibleMessages" :key="'messagelist-' + message.id" class="p-0 mt-2">
        <div :ref="'top' + message.id" />
        <ModMessage :message="message" :next="ix < visibleMessages.length - 1 ? visibleMessages[ix + 1].id : null" :next-after-removed="nextAfterRemoved" @destroy="destroy" />
        <div :ref="'bottom' + message.id" />
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
import ExternalLink from '@/components/ExternalLink'
import NoticeMessage from '../../../../components/NoticeMessage'
import GroupSelect from '../../../../components/GroupSelect'
import ModMessage from '../../../../components/ModMessage'
import ModCakeModal from '~/components/ModCakeModal'
import PreCovidModeration from '~/components/PreCovidModeration'
import ScrollToTop from '~/components/ScrollToTop'

export default {
  components: {
    ExternalLink,
    ScrollToTop,
    PreCovidModeration,
    ModCakeModal,
    ModMessage,
    GroupSelect,
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
    },
    destroy(oldid, nextid) {
      this.nextAfterRemoved = nextid
    }
  }
}
</script>
