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
          <b-card variant="success" no-body>
            <b-card-title class="bg-info pl-2 mb-0 pt-2 pb-2 text-truncate">
              {{ event.title }}
            </b-card-title>
            <b-card-body class="p-1 pt-0">
              <div v-if="dates && dates[event.id]" class="media clickme">
                <div class="media-left">
                  <div class="media-object pl-1 text-muted">
                    <v-icon name="clock" class="fa-fw" />
                  </div>
                </div>
                <div class="media-body ml-2">
                  {{ dates[event.id].start }} - {{ dates[event.id].end }}
                </div>
              </div>
              <div class="media clickme">
                <div class="media-left">
                  <div class="media-object pl-1 text-muted">
                    <v-icon name="map-marker-alt" class="fa-fw" />
                  </div>
                </div>
                <div class="media-body ml-2 small">
                  {{ event.location }}
                </div>
              </div>
              <b-img-lazy v-if="event.photo" fluid :src="event.photo.path" />
              <div class="text-center mt-2 mb-2">
                <b-btn variant="white" size="sm">
                  <v-icon name="info-circle" /> More info
                </b-btn>
              </div>
              <div v-if="event.groups" class="small text-muted text-center">
                Posted on {{ event.groups[0].namedisplay }}
              </div>
            </b-card-body>
          </b-card>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
export default {
  data: function() {
    return {}
  },
  computed: {
    events() {
      return this.$store.getters['communityevents/sortedList']()
    },

    dates() {
      // Similar code to NewsCommunityEvent
      const retdates = []
      const Moment = this.$dayjs

      for (const eventid in this.events) {
        let ret = null

        const event = this.events[eventid]

        if (event.earliestDate) {
          if (
            new Moment().diff(event.earliestDate.end) < 0 ||
            new Moment().isSame(event.earliestDate.end, 'day')
          ) {
            const startm = new Moment(event.earliestDate.start)
            let endm = new Moment(event.earliestDate.end)
            endm = endm.isSame(startm, 'day')
              ? endm.format('HH:mm')
              : endm.format('ddd, Do MMM HH:mm')
            ret = {
              start: startm.format('ddd, Do MMM HH:mm'),
              end: endm
            }
          }
        }

        retdates[event.id] = ret
      }

      return retdates
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
