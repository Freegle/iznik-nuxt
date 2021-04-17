<template>
  <div v-if="!simple" class="d-flex flex-column sidebar__wrapper">
    <DonationMonthly v-if="supporter && !donor" class="mb-2 w-100" variant="sidebar" />
    <VolunteerOpportunitySidebar v-if="showVolunteerOpportunities && false" :class="itemclass" />
    <JobsSidebar v-if="showJobOpportunities" :class="itemclass" />
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
  computed: {
    both() {
      return this.showJobOpportunities && this.showVolunteerOpportunities
    },
    itemclass() {
      return this.both ? 'sidebar__item' : 'sidebar__full'
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
