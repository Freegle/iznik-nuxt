<template>
  <div class="mb-2">
    <b-card v-if="opportunities.length" variant="white" no-body>
      <b-card-body class="p-0">
        <div class="px-1 pt-1">
          <div class="d-flex align-items-start">
            <h4>
              <nuxt-link to="/volunteerings" class="volunteer__link">
                <v-icon name="hands-helping" scale="2" /> Volunteer Opportunities
              </nuxt-link>
            </h4>
            <b-btn variant="white" aria-label="Add volunteer opportunity" @click="showVolunteerModal">
              <v-icon name="plus" /> Add
            </b-btn>
          </div>
          <p class="text-center small">
            Are you a charity or good cause that needs volunteers?
          </p>
        </div>
        <div v-for="opportunity in opportunities" :key="'volunteering-' + opportunity.id" class="">
          <VolunteerOpportunity v-if="!opportunity.pending" :summary="true" :volunteering="opportunity" />
        </div>
      </b-card-body>
    </b-card>
    <VolunteerOpportunityModal ref="volunteermodal" :start-edit="true" />
  </div>
</template>
<script>
import VolunteerOpportunity from './VolunteerOpportunity'
const VolunteerOpportunityModal = () =>
  import('~/components/VolunteerOpportunityModal')

export default {
  components: {
    VolunteerOpportunity,
    VolunteerOpportunityModal
  },
  data: function() {
    return {}
  },
  computed: {
    opportunities() {
      return this.$store.getters['volunteerops/sortedList']
    }
  },
  mounted() {
    this.$store.dispatch('volunteerops/clear')

    // Delay a little bit to give the main pane a chance to load.
    setTimeout(() => {
      this.$store.dispatch('volunteerops/fetch')
    }, 1000)
  },
  methods: {
    showVolunteerModal() {
      this.$refs.volunteermodal.show()
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.volunteer__link {
  color: $colour-header;
}
</style>
