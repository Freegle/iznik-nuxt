<template>
  <aside>
    <CommunityFeature
      :items="events"
      title="Community Events"
      link="/communityevents"
      icon-name="calendar-alt"
      add-button-label="Add community event"
      item-description="These are local events, posted by other freeglers like you."
      no-items-message="No community events to show yet.  Do you know of any you could add?"
      feature-component="CommunityEvent"
      add-event-modal-component="CommunityEventModal"
      item-key="event-"
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
