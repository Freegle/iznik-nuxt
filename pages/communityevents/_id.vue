<template>
  <div>
    <b-row class="m-0">
      <b-col cols="12" lg="6" class="p-0" offset-lg="3">
        <div>
          <h1>Community Events</h1>
          <CovidWarning />
          <p>These are local events, posted by other freeglers like you.</p>
          <div class="d-flex justify-content-between mb-3">
            <groupSelect v-if="me" v-model="groupid" class="pr-2" all />
            <b-btn variant="primary" class="float-right" @click="showEventModal">
              <v-icon name="plus" /> Add an event
            </b-btn>
          </div>
        </div>
        <h2 class="sr-only">
          List of community events
        </h2>
        <div v-for="event in events" :key="'event-' + event.id" class="mt-2">
          <CommunityEvent v-if="!event.pending" :summary="false" :item="event" />
        </div>
        <client-only>
          <infinite-loading :key="'infinite-' + groupid" :identifier="infiniteId" force-use-infinite-wrapper="body" @infinite="loadMore">
            <span slot="no-results">
              <notice-message v-if="!events || !events.length">
                There are no community events to show.  Why not add one?
              </notice-message>
            </span>
            <span slot="no-more" />
            <span slot="spinner">
              <b-img-lazy src="~/static/loader.gif" alt="Loading" />
            </span>
          </infinite-loading>
        </client-only>
      </b-col>
      <b-col cols="0" md="3" class="d-none d-md-block" />
    </b-row>
    <CommunityEventModal ref="eventmodal" :start-edit="true" />
  </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import loginOptional from '@/mixins/loginOptional.js'
import createGroupRoute from '@/mixins/createGroupRoute'
import buildHead from '@/mixins/buildHead.js'
import CovidWarning from '../../components/CovidWarning'

const GroupSelect = () => import('~/components/GroupSelect')
const CommunityEvent = () => import('~/components/CommunityEvent.vue')
const CommunityEventModal = () => import('~/components/CommunityEventModal')
const NoticeMessage = () => import('~/components/NoticeMessage')

export default {
  components: {
    CovidWarning,
    InfiniteLoading,
    GroupSelect,
    CommunityEvent,
    CommunityEventModal,
    NoticeMessage
  },
  mixins: [loginOptional, createGroupRoute('communityevents'), buildHead],
  data: function() {
    return {
      context: null,
      infiniteId: +new Date(),
      complete: false
    }
  },
  computed: {
    events() {
      return this.$store.getters['communityevents/sortedList']
    }
  },
  async asyncData({ app, params, store }) {
    const me = store.getters['auth/user']

    if (params.id) {
      // We can display these logged out.
      await store.dispatch('communityevents/fetch', {
        groupid: params.id
      })

      await store.dispatch('group/fetch', {
        id: params.id
      })
    } else if (me) {
      // We can fetch all the ones we're a member of.
      await store.dispatch('communityevents/fetch')
    } else {
      // We should force them to sign in and figure out what they want to do.
      await store.dispatch('auth/forceLogin', true)
    }

    return {
      asyncGroupId: params.id
    }
  },
  mounted() {
    this.$store.dispatch('communityevents/clear')
  },
  methods: {
    loadMore: async function($state) {
      let events = this.$store.getters['communityevents/list']
      const currentCount = events && events.length ? events.length : 0

      this.context = this.$store.getters['communityevents/getContext']

      await this.$store.dispatch('communityevents/fetch', {
        groupid: this.groupid ? this.groupid : null,
        context: this.context
      })

      events = this.$store.getters['communityevents/list']

      const newCount = events && events.length ? events.length : 0
      if (currentCount === newCount) {
        this.complete = true
        $state.complete()
      } else {
        $state.loaded()
      }
    },

    showEventModal() {
      if (this.me) {
        this.$refs.eventmodal.show()
      } else {
        this.$store.dispatch('auth/forceLogin', true)
      }
    }
  },
  head() {
    let name
    let image

    if (this.asyncGroupId) {
      const group = this.$store.getters['group/get'](this.asyncGroupId)

      name = 'Community Events for ' + group.namedisplay
      image = group.profile
    } else {
      name = 'Community Events'
      image = null
    }

    return this.buildHead(
      name,
      'These are local events, posted by other freeglers like you.',
      image
    )
  }
}
</script>
