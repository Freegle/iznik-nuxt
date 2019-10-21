<template>
  <div>
    <b-card v-if="events.length" variant="white" no-body>
      <b-card-body class="p-0">
        <h4 class="pl-1 pt-1">
          <v-icon name="calendar-alt" scale="2" /> Community Events
          <b-btn variant="white" class="float-right">
            <v-icon name="plus" /> Add
          </b-btn>
        </h4>
        <div v-for="(event, $index) in events" :key="$index" class="">
          <CommunityEvent :summary="true" :event="event" />
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
// TODO Add
// TODO Details
import CommunityEvent from './CommunityEvent'
export default {
  components: { CommunityEvent },
  data: function() {
    return {}
  },
  computed: {
    events() {
      return this.$store.getters['communityevents/sortedList']()
    }
  },
  mounted() {
    // Delay a little bit to give the main pane a chance to load.
    setTimeout(() => {
      this.$store.dispatch('communityevents/fetch')
    }, 1000)
  }
}
</script>
