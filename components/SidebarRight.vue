<template>
  <div class="d-flex flex-column sidebar__wrapper">
    <VolunteerOpportunitySidebar v-if="showVolunteerOpportunities" class="justify-content-start flex-grow-1" style="overflow-y: auto" />
    <div v-if="showJobOpportunities">
      Job ads go here
    </div>
  </div>
</template>

<script>
const VolunteerOpportunitySidebar = () =>
  import('~/components/VolunteerOpportunitySidebar')

export default {
  components: {
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
