<template>
  <div class="d-flex flex-column sidebar__wrapper">
    <VolunteerOpportunitySidebar v-if="showVolunteerOpportunities" class="sidebar__item" />
    <JobsSidebar v-if="showJobOpportunities" class="sidebar__item" />
  </div>
</template>

<script>
import JobsSidebar from './JobsSidebar'
const VolunteerOpportunitySidebar = () =>
  import('~/components/VolunteerOpportunitySidebar')

export default {
  components: {
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
  }
}
</script>

<style scoped>
.sidebar__item {
  flex: 0 1 50%;
  overflow-y: auto;
  border-bottom: 2px solid rgba(0, 0, 0, 0.125);
}
</style>
