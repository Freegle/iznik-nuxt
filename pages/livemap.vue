<template>
  <div>
    <b-row class="text-center m-0">
      <b-col cols="12" md="6" offset-md="3">
        <h1>Live Map</h1>
        <h3>See freegling happen across the UK.</h3>
        <p>This shows posts as freeglers make them. There'll usually be something along in a minute or two.</p>
        <p>
          You might also like our <nuxt-link to="/stats/heatmap">
            heatmap
          </nuxt-link> showing where people freegle.
        </p>
        <client-only>
          <GmapMap
            ref="gmap"
            :center="{lat:53.9450, lng:-2.5209}"
            :zoom="5"
            :style="'width: ' + mapWidth + '; height: ' + mapWidth + 'px'"
            :options="{
              zoomControl: true,
              mapTypeControl: false,
              scaleControl: false,
              streetViewControl: false,
              rotateControl: false,
              fullscreenControl: true,
              disableDefaultUi: false,
              gestureHandling: 'greedy'
            }"
            @idle="mapIdle"
          >
            <div v-for="m in messagesToShow" :key="'marker-' + m.id">
              <RichMarker v-if="m.group.lat || m.group.lng" :position="{ lat: m.group.lat, lng: m.group.lng }">
                <!--                TODO DESIGN This could have more pizzazz.-->
                <b-card variant="white" class="text-left" style="max-width: 300px" @click="openIt(m.message.id)">
                  <b-card-title>
                    <span class="small">{{ m.message.subject }}</span>
                  </b-card-title>
                  <b-card-sub-title>
                    On {{ m.group.namedisplay }}
                  </b-card-sub-title>
                </b-card>
              </RichMarker>
            </div>
          </GmapMap>
        </client-only>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { gmapApi } from 'vue2-google-maps'
import RichMarker from '~/components/RichMarker.vue'
import loginOptional from '@/mixins/loginOptional.js'

export default {
  components: {
    RichMarker
  },
  mixins: [loginOptional],
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
    google: gmapApi,
    mapHeight() {
      const contWidth = this.$refs.mapcont ? this.$refs.mapcont.$el.width : 0
      return contWidth
    },
    mapWidth() {
      let height = Math.floor(window.innerHeight - 250)
      height = height < 200 ? 200 : height
      return height
    },
    messagesToShow() {
      const messages = this.$store.getters['activity/listRecentMessages']()
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
    mapIdle() {
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
        const messages = this.$store.getters['activity/listRecentMessages']()

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
      const messages = this.$store.getters['activity/listRecentMessages']()

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
    },

    openIt(id) {
      console.log('Open', id)
      window.open(process.env.USER_SITE + '/message/' + id)
    }
  }
}
</script>
