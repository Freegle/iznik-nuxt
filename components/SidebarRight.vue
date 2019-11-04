<template>
  <div class="d-flex flex-column sidebar__wrapper">
    <VolunteerOpportunitySidebar v-if="showVolunteerOpportunities" class="justify-content-start flex-grow-1" style="overflow-y: auto" />
    <JobsSidebar v-if="showJobOpportunities" class="justify-content-end flex-grow-1" style="overflow-y: auto" />
    <!--    TODO DESIGN make these equal height-->
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
.sidebar__wrapper {
  height: calc(100vh - 100px);
}
</style>
