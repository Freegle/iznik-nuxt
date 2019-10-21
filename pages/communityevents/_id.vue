<template>
  <b-col>
    <b-row class="m-0">
      <b-col cols="0" md="3" class="d-none d-md-block" />
      <b-col cols="12" md="6" class="p-0">
        <div>
          <h1>Community Events</h1>
          <p>These are local events, posted by other freeglers like you.</p>
          <b-row>
            <b-col>
              <groupSelect id="communityevents" class="float-left" all @change="groupChange" />
            </b-col>
            <b-col>
              <b-btn variant="success" class="float-right">
                <v-icon name="plus" /> Add an event
              </b-btn>
            </b-col>
          </b-row>
        </div>
        <div v-for="(event, $index) in events" :key="$index" class="mt-2">
          <CommunityEvent :summary="false" :event="event" />
        </div>
        <infinite-loading :key="'infinite-' + groupid" :identifier="infiniteId" force-use-infinite-wrapper="body" @infinite="loadMore">
          <span slot="no-results">
            <b-alert v-if="!events.length" variant="info" class="mt-2" show>
              There are no community events to show.  Why not add one?
            </b-alert>
          </span>
          <span slot="no-more" />
          <span slot="spinner">
            <b-img-lazy src="~/static/loader.gif" />
          </span>
        </infinite-loading>
      </b-col>
      <b-col cols="0" md="3" class="d-none d-md-block" />
    </b-row>
  </b-col>
</template>
<script>
import loginOptional from '@/mixins/loginOptional.js'
const GroupSelect = () => import('~/components/GroupSelect.vue')
const CommunityEvent = () => import('~/components/CommunityEvent.vue')

export default {
  components: {
    GroupSelect,
    CommunityEvent
  },
  mixins: [loginOptional],
  data: function() {
    return {
      groupid: null,
      context: null,
      infiniteId: +new Date(),
      complete: false
    }
  },
  computed: {
    events() {
      return this.$store.getters['communityevents/sortedList']()
    }
  },
  created() {
    this.groupid = this.$route.params.id
  },
  mounted() {
    this.$store.dispatch('communityevents/clear')

    if (this.groupid) {
      // Ensure our select is set to the right value
      console.log('Remember')
      this.$store.commit('group/remember', {
        id: 'communityevents',
        val: this.groupid
      })
    }
  },

  methods: {
    groupChange: function(newGroup) {
      if (newGroup) {
        this.$router.push('/communityevents/' + newGroup)
      } else {
        this.$router.push('/communityevents')
      }
    },
    loadMore: async function($state) {
      let events = this.$store.getters['communityevents/list']()
      const currentCount = events && events.length ? events.length : 0

      this.context = this.$store.getters['communityevents/getContext']()

      await this.$store.dispatch('communityevents/fetch', {
        groupid: this.groupid ? this.groupid : null,
        context: this.context
      })

      events = this.$store.getters['communityevents/list']()

      const newCount = events && events.length ? events.length : 0
      if (currentCount === newCount) {
        this.complete = true
        $state.complete()
      } else {
        $state.loaded()
      }
    }
  }
}
</script>
