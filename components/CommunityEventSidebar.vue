<template>
  <div>
    <b-card variant="white" no-body>
      <b-card-body class="p-0">
        <div class="px-1 pt-1">
          <div class="d-flex align-items-start justify-content-between">
            <h4>
              <nuxt-link to="/communityevents" class="community__link">
                <v-icon name="calendar-alt" scale="2" /> Community Events
              </nuxt-link>
            </h4>
            <b-btn variant="white" aria-label="Add community event" @click="showEventModal">
              <v-icon name="plus" /> Add
            </b-btn>
          </div>
          <div v-if="events.length">
            <p class="text-center small">
              These are local events, posted by other freeglers like you.
            </p>
            <div v-for="event in events" :key="'event-' + event.id" class="">
              <CommunityEvent v-if="!event.pending" :summary="true" :event="event" />
            </div>
          </div>
          <p v-else class="text-center p-1">
            No community events to show yet.  Do you know of any you could add?
          </p>
        </div>
      </b-card-body>
    </b-card>
    <CommunityEventModal ref="eventmodal" :start-edit="true" />
  </div>
</template>
<script>
import CommunityEvent from './CommunityEvent'
const CommunityEventModal = () => import('~/components/CommunityEventModal')

export default {
  components: {
    CommunityEvent,
    CommunityEventModal
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
  },
  methods: {
    showEventModal() {
      this.$refs.eventmodal.show()
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.community__link {
  color: $colour-header;
}
</style>
