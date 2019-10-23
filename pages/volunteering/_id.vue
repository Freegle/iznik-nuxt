<template>
  <div>
    <b-row class="m-0">
      <b-col cols="0" md="3" class="d-none d-md-block" />
      <b-col cols="12" md="6" class="p-0">
        <div>
          <h1>Volunteer Opportunities</h1>
          <p>Are you a charity or good cause that needs volunteers? Ask our lovely community of freeglers to help.</p>
          <b-row>
            <b-col>
              <groupSelect id="volunteering" class="float-left" all @change="groupChange" />
            </b-col>
            <b-col>
              <b-btn variant="success" class="float-right" @click="showEventModal">
                <v-icon name="plus" /> Add an opportunity
              </b-btn>
            </b-col>
          </b-row>
        </div>
        <div v-for="(volunteering, $index) in events" :key="$index" class="mt-2">
          <VolunteerOpportunity v-if="!volunteering.pending" :summary="false" :volunteering="volunteering" />
        </div>
        <infinite-loading :key="'infinite-' + groupid" :identifier="infiniteId" force-use-infinite-wrapper="body" @infinite="loadMore">
          <span slot="no-results">
            <b-alert v-if="!events.length" variant="info" class="mt-2" show>
              There are no volunteer opportunities to show.  Why not add one?
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
    <VolunteerOpportunityModal ref="volunteermodal" :volunteering="{}" :start-edit="true" />
  </div>
</template>
<script>
import loginOptional from '@/mixins/loginOptional.js'
const GroupSelect = () => import('~/components/GroupSelect.vue')
const VolunteerOpportunity = () =>
  import('~/components/VolunteerOpportunity.vue')
const VolunteerOpportunityModal = () =>
  import('~/components/VolunteerOpportunityModal')

export default {
  components: {
    GroupSelect,
    VolunteerOpportunity,
    VolunteerOpportunityModal
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
      return this.$store.getters['volunteerops/sortedList']()
    }
  },
  created() {
    this.groupid = this.$route.params.id
  },
  mounted() {
    this.$store.dispatch('volunteerops/clear')

    if (this.groupid) {
      // Ensure our select is set to the right value
      this.$store.commit('group/remember', {
        id: 'volunteering',
        val: this.groupid
      })
    }
  },

  methods: {
    groupChange: function(newGroup) {
      if (newGroup) {
        this.$router.push('/volunteering/' + newGroup)
      } else {
        this.$router.push('/volunteering')
      }
    },
    loadMore: async function($state) {
      let events = this.$store.getters['volunteerops/list']()
      const currentCount = events && events.length ? events.length : 0

      this.context = this.$store.getters['volunteerops/getContext']()

      await this.$store.dispatch('volunteerops/fetch', {
        groupid: this.groupid ? this.groupid : null,
        context: this.context
      })

      events = this.$store.getters['volunteerops/list']()

      const newCount = events && events.length ? events.length : 0
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
