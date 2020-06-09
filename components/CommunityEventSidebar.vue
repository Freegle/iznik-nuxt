<template>
  <CommunityFeature
    :items="events"
    title="Community Events"
    link="/communityevents"
    icon-name="calendar-alt"
    add-button-label="Add community event"
    event-description="These are local events, posted by other freeglers like you."
    no-items-message="No community events to show yet.  Do you know of any you could add?"
    add-event-name="CommunityEvent"
    add-event-modal-name="CommunityEventModal"
  />
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
    events() {
      return this.$store.getters['communityevents/sortedList']
    }
  },
  mounted() {
    this.$store.dispatch('communityevents/clear')

    // Delay a little bit to give the main pane a chance to load.
    setTimeout(() => {
      this.$store.dispatch('communityevents/fetch')
    }, 1000)
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.community__link {
  color: $colour-header;
}
</style>
