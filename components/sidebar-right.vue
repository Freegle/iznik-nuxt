<template>
  <div class="d-flex flex-column sidebar__wrapper">
    <VolunteerOpportunitySidebar class="justify-content-start flex-grow-1" style="overflow-y: auto" />
    Job ads go here
  </div>
</template>

<script>
const VolunteerOpportunitySidebar = () =>
  import('~/components/VolunteerOpportunitySidebar')

export default {
  components: {
    VolunteerOpportunitySidebar
  }
}
</script>

<style scoped>
.sidebar__wrapper {
  height: calc(100vh - 100px);
}
</style>
