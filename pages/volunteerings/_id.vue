<template>
  <div>
    <b-row class="m-0">
      <b-col cols="12" lg="6" class="p-0" offset-lg="3">
        <div>
          <h1>Volunteer Opportunities</h1>
          <CovidWarning />
          <p>Are you a charity or good cause that needs volunteers? Ask our lovely community of freeglers to help.</p>
          <div class="d-flex justify-content-between mb-3">
            <groupSelect v-if="me" v-model="groupid" class="pr-2" all />
            <b-btn variant="primary" class="float-right" @click="showEventModal">
              <v-icon name="plus" /> Add an opportunity
            </b-btn>
          </div>
        </div>
        <div v-for="volunteering in volunteerings" :key="'volunteering-' + volunteering.id" class="mt-2">
          <VolunteerOpportunity v-if="!volunteering.pending" :summary="false" :item="volunteering" />
        </div>
        <client-only>
          <infinite-loading :key="'infinite-' + groupid" :identifier="infiniteId" force-use-infinite-wrapper="body" @infinite="loadMore">
            <span slot="no-results">
              <notice-message v-if="!volunteerings || !volunteerings.length">
                There are no volunteer opportunities to show.  Why not add one?
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
    <VolunteerOpportunityModal ref="volunteermodal" :start-edit="true" />
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import CovidWarning from '../../components/CovidWarning'
import loginOptional from '@/mixins/loginOptional.js'
import createGroupRoute from '@/mixins/createGroupRoute'
import buildHead from '@/mixins/buildHead.js'
const GroupSelect = () => import('~/components/GroupSelect')
const VolunteerOpportunity = () =>
  import('~/components/VolunteerOpportunity.vue')
const VolunteerOpportunityModal = () =>
  import('~/components/VolunteerOpportunityModal')
const NoticeMessage = () => import('~/components/NoticeMessage')

export default {
  components: {
    CovidWarning,
    InfiniteLoading,
    GroupSelect,
    VolunteerOpportunity,
    VolunteerOpportunityModal,
    NoticeMessage
  },
  mixins: [loginOptional, createGroupRoute('volunteerings'), buildHead],
  data: function() {
    return {
      context: null,
      infiniteId: +new Date(),
      complete: false
    }
  },
  computed: {
    volunteerings() {
      return this.$store.getters['volunteerops/sortedList']
    }
  },
  async asyncData({ app, params, store }) {
    await store.dispatch('volunteerops/fetch', {
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
    this.$store.dispatch('volunteerops/clear')
  },
  methods: {
    loadMore: async function($state) {
      let volunteerings = this.$store.getters['volunteerops/list']
      const currentCount =
        volunteerings && volunteerings.length ? volunteerings.length : 0

      this.context = this.$store.getters['volunteerops/getContext']

      await this.$store.dispatch('volunteerops/fetch', {
        groupid: this.groupid ? this.groupid : null,
        context: this.context
      })

      volunteerings = this.$store.getters['volunteerops/list']

      const newCount =
        volunteerings && volunteerings.length ? volunteerings.length : 0
      if (currentCount === newCount) {
        this.complete = true
        $state.complete()
      } else {
        $state.loaded()
      }
    },

    showEventModal() {
      if (this.me) {
        this.$refs.volunteermodal.show()
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

      name = 'Volunteer Opportunities for ' + group.namedisplay
      image = group.profile
    } else {
      name = 'Volunteer Opportunities'
      image = null
    }

    return this.buildHead(
      name,
      'Are you a charity or good cause that needs volunteers? Ask our lovely community of freeglers to help.',
      image
    )
  }
}
</script>
