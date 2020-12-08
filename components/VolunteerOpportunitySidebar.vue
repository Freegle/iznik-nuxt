<template>
  <aside>
    <CommunityFeature
      :items="opportunities"
      title="Volunteer Opportunities"
      link="/volunteerings"
      icon-name="hands-helping"
      add-button-label="Add volunteer opportunity"
      item-description="Are you a charity or good cause that needs volunteers?"
      no-items-message="Are you a charity or good cause that needs volunteers?  Why not add your volunteer opportunities here?"
      feature-component="VolunteerOpportunity"
      add-event-modal-component="VolunteerOpportunityModal"
      item-key="volunteering-"
    />
  </aside>
</template>

<script>
import CommunityFeature from './CommunityFeature'

export default {
  components: {
    CommunityFeature
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
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.volunteer__link {
  color: $colour-header;
}
</style>
