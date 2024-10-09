<template>
  <div>
    <client-only>
      <ScrollToTop />
      <ModCakeModal />
      <ModAimsModal ref="aims" />
      <!--      <ModFreeStock class="mb-2" />-->
      <!--      <NoticeMessage variant="info" class="mb-2 d-block d-md-none">-->
      <!--        <ModZoomStock color-class="text-black" />-->
      <!--      </NoticeMessage>-->
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

      <ModAffiliationConfirmModal v-if="affiliationGroup" ref="affiliation" :groupid="affiliationGroup" />

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
import shuffle from '@/mixins/shuffle'
import loginRequired from '@/mixins/loginRequired'
import modMessagesPage from '@/mixins/modMessagesPage'
import createGroupRoute from '@/mixins/createGroupRoute'
import ModZoomStock from '@/components/ModZoomStock'
// import ModFreeStock from '@/components/ModFreeStock'
import ModAimsModal from '@/components/ModAimsModal'
import NoticeMessage from '../../../../components/NoticeMessage'
import GroupSelect from '../../../../components/GroupSelect'
import ModMessage from '../../../../components/ModMessage'
import ModCakeModal from '~/components/ModCakeModal'
import ScrollToTop from '~/components/ScrollToTop'
import ModAffiliationConfirmModal from '~/components/ModAffiliationConfirmModal'

export default {
  components: {
    ModAffiliationConfirmModal,
    ModZoomStock,
    // ModFreeStock,
    ScrollToTop,
    ModCakeModal,
    ModMessage,
    GroupSelect,
    NoticeMessage,
    ModAimsModal
  },
  layout: 'modtools',
  mixins: [
    loginRequired,
    createGroupRoute('modtools/messages/pending'),
    modMessagesPage,
    shuffle
  ],
  data: function() {
    return {
      collection: 'Pending',
      workType: 'pending',
      affiliationGroup: null
    }
  },
  mounted() {
    // Consider affiliation ask.
    const lastask = this.$store.getters['misc/get']('lastaffiliationask')
    const now = new Date().getTime()

    // Ask for affiliation not too frequently.
    if (!lastask || now - lastask > 7 * 24 * 60 * 60 * 1000) {
      const myGroups = this.shuffle(this.myGroups)

      for (const group of myGroups) {
        if (
          group.type === 'Freegle' &&
          (group.role === 'Owner' || group.role === 'Moderator')
        ) {
          const postdate = this.$dayjs(group.affiliationconfirmed)
          const daysago = this.$dayjs().diff(postdate, 'day')

          if (!group.affiliationconfirmed || daysago > 365) {
            this.affiliationGroup = group.id
            this.waitForRef('affiliation', () => {
              this.$refs.affiliation.show()
            })

            break
          }
        }
      }

      this.$store.dispatch('misc/set', {
        key: 'lastaffiliationask',
        value: now
      })
    }

    console.log('refs', this.$refs)
    this.waitForRef('aims', () => {
      this.$refs.aims.show()
    })
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
