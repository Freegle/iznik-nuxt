<template>
  <div>
    <b-row class="text-center m-0">
      <b-col ref="mapcont" cols="12" md="6" offset-md="3">
        <h1>Live Map</h1>
        <h3>See freegling happen across the UK.</h3>
        <p>This shows posts as freeglers make them. There'll usually be something along in a minute or two.</p>
        <p>
          You might also like our <nuxt-link to="/stats/heatmap">
            heatmap
          </nuxt-link> showing where people freegle.
        </p>
        <client-only>
          <l-map
            ref="map"
            :zoom="5"
            :min-zoom="5"
            :max-zoom="13"
            :center="center"
            :style="'width: ' + mapWidth + '; height: ' + mapWidth + 'px'"
            :options="{ zoomControl: false, scrollWheelZoom: false}"
            @ready="idle"
          >
            <l-tile-layer :url="osmtile" :attribution="attribution" />
            <LiveMessageMarker v-for="m in messagesToShow" :key="'marker-' + m.id" :message="m" />
          </l-map>
        </client-only>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
import map from '@/mixins/map.js'
const LiveMessageMarker = () => import('../components/LiveMessageMarker')

export default {
  components: {
    LiveMessageMarker
  },
  mixins: [loginOptional, buildHead, map],
  data: function() {
    return {
      startTime: null,
      firstMessageTime: null,
      firstMessageDate: null,
      nowTime: Date.now(),
      pollTimer: null
    }
  },
  computed: {
    messagesToShow() {
      const messages = this.$store.getters['activity/listRecentMessages']
      const ret = []

      if (messages) {
        messages.forEach(message => {
          // We want to show a message if it is now due (correcting for when we started all this) and it's less
          // than five minutes old.
          const msgtime = new Date(message.message.arrival).getTime()
          if (
            this.nowTime - this.startTime >= msgtime - this.firstMessageTime &&
            msgtime - this.firstMessageTime < 300000
          ) {
            ret.push(message)
          }
        })
      }

      return ret
    }
  },
  mounted() {
    this.startTime = Date.now()
    this.poll()
  },
  methods: {
    idle() {
      if (!this.messagesToShow.length) {
        // Fetch the first set of activity.
        this.poll()
      }
    },

    async fetchRecentMessages() {
      await this.$store.dispatch('activity/clearRecentMessages')
      await this.$store.dispatch('activity/fetchRecentMessages')

      if (this.firstMessageTime === null) {
        // Very first messages we've fetched.  Get the oldest message.  We use this to time everything.
        const messages = this.$store.getters['activity/listRecentMessages']

        if (messages) {
          messages.forEach(message => {
            const thistime = new Date(message.message.arrival).getTime()
            if (
              this.firstMessageTime === null ||
              this.firstMessageTime > thistime
            ) {
              this.firstMessageTime = thistime
              this.firstMessageDate = message.message.arrival
            }
          })
        }
      }
    },

    poll() {
      this.pollTimer = null
      this.nowTime = Date.now()
      const messages = this.$store.getters['activity/listRecentMessages']

      if (messages.length < 10) {
        // Poll to ensure we have a queue to show.
        this.fetchRecentMessages().finally(() => {
          this.pollTimer = setTimeout(this.poll, 1000)
        })
      } else {
        this.pollTimer = setTimeout(this.poll, 1000)
      }
    },

    beforeDestroy() {
      if (this.pollTimer) {
        clearTimeout(this.pollTimer)
        this.pollTimer = null
      }
    }
  },

  head() {
    return this.buildHead(
      'Live Map',
      'See freegling happen across the UK in real time'
    )
  }
}
</script>
