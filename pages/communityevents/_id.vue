<template>
  <div>
    <b-row class="m-0">
      <b-col cols="12" lg="6" class="p-0" offset-lg="3">
        <div>
          <h1>Community Events</h1>
          <p>These are local events, posted by other freeglers like you.</p>
          <b-row class="mb-3">
            <b-col>
              <groupSelect v-if="me" v-model="groupid" class="float-left" all />
            </b-col>
            <b-col>
              <b-btn variant="success" class="float-right" @click="showEventModal">
                <v-icon name="plus" /> Add an event
              </b-btn>
            </b-col>
          </b-row>
        </div>
        <div v-for="event in events" :key="'event-' + event.id" class="mt-2">
          <CommunityEvent v-if="!event.pending" :summary="false" :event="event" />
        </div>
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

const GroupSelect = () => import('~/components/GroupSelect')
const CommunityEvent = () => import('~/components/CommunityEvent.vue')
const CommunityEventModal = () => import('~/components/CommunityEventModal')
const NoticeMessage = () => import('~/components/NoticeMessage')

export default {
  components: {
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
    },
    me() {
      return this.$store.getters['auth/user']
    }
  },
  async asyncData({ app, params, store }) {
    await store.dispatch('communityevents/fetch', {
      groupid: params.id ? params.id : null
    })

    if (params.id) {
      await store.dispatch('group/fetch', {
        id: params.id
      })
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
        // TODO MINOR If we have a groupid but they're not a member, which can happen for
        // people who are logged out or just get sent to the page, then we ought to sign them up.  Or we should
        // provide a way for people to select and join a group that they're not a member of.  Same for volunteer ops.
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
