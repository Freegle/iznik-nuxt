<template>
  <div>
    <div v-if="!simple" class="sidebar__wrapper">
      <div class="d-flex flex-column justify-content-between mh-100">
        <div>
          <DonationMonthly v-if="false && supporter && !donor" class="w-100" variant="sidebar" />
          <VolunteerOpportunitySidebar v-if="showVolunteerOpportunities && false" :class="itemclass" />
        </div>
        <JobsSidebar v-if="showJobOpportunities" :class="itemclass" :shown-love-junk="shown" />
      </div>
    </div>
  </div>
</template>

<script>
import JobsSidebar from './JobsSidebar'
import DonationMonthly from '~/components/DonationMonthly'

const VolunteerOpportunitySidebar = () =>
  import('~/components/VolunteerOpportunitySidebar')

export default {
  components: {
    DonationMonthly,
    JobsSidebar,
    VolunteerOpportunitySidebar
  },
  props: {
    showVolunteerOpportunities: {
      type: Boolean,
      required: false
    },
    showJobOpportunities: {
      type: Boolean,
      required: false
    }
  },
  data: function() {
    return {
      shown: false
    }
  },
  computed: {
    both() {
      return this.showJobOpportunities && this.showVolunteerOpportunities
    },
    itemclass() {
      return (this.both ? 'sidebar__item' : 'sidebar__full') + ' mt-2'
    }
  }
}
</script>

<style scoped>
.sidebar__item {
  flex: 0 1 50%;
  overflow-y: auto;
}
.sidebar__full {
  flex: 0 1 100%;
  overflow-y: auto;
}
</style>
