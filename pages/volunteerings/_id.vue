<template>
  <div>
    <b-row class="m-0">
      <b-col cols="0" md="3" class="d-none d-md-block" />
      <b-col cols="12" md="6" class="p-0">
        <div>
          <h1>Volunteer Opportunities</h1>
          <p>Are you a charity or good cause that needs volunteers? Ask our lovely community of freeglers to help.</p>
          <b-row class="mb-3">
            <b-col>
              <groupSelect v-model="groupid" class="float-left" all />
            </b-col>
            <b-col>
              <b-btn variant="success" class="float-right" @click="showEventModal">
                <v-icon name="plus" /> Add an opportunity
              </b-btn>
            </b-col>
          </b-row>
        </div>
        <div v-for="volunteering in volunteerings" :key="'volunteering-' + volunteering.id" class="mt-2">
          <VolunteerOpportunity v-if="!volunteering.pending" :summary="false" :volunteering="volunteering" />
        </div>
        <infinite-loading :key="'infinite-' + groupid" :identifier="infiniteId" force-use-infinite-wrapper="body" @infinite="loadMore">
          <span slot="no-results">
            <notice-message v-if="!volunteerings.length">
              There are no volunteer opportunities to show.  Why not add one?
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
    <VolunteerOpportunityModal ref="volunteermodal" :start-edit="true" />
  </div>
</template>

<script>
import loginOptional from '@/mixins/loginOptional.js'
import createGroupRoute from '@/mixins/createGroupRoute'
const GroupSelect = () => import('~/components/GroupSelect')
const VolunteerOpportunity = () =>
  import('~/components/VolunteerOpportunity.vue')
const VolunteerOpportunityModal = () =>
  import('~/components/VolunteerOpportunityModal')
const NoticeMessage = () => import('~/components/NoticeMessage')

export default {
  components: {
    GroupSelect,
    VolunteerOpportunity,
    VolunteerOpportunityModal,
    NoticeMessage
  },
  mixins: [loginOptional, createGroupRoute('volunteerings')],
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
      this.$refs.volunteermodal.show()
    }
  }
}
</script>
