<template>
  <div ref="mapcont" class="w-100">
    <client-only>
      <l-map
        ref="map"
        :zoom="8"
        :center="center"
        :style="'width: ' + mapWidth + '; height: ' + mapHeight + 'px'"
        :options="{ zoomControl: false, scrollWheelZoom: false}"
        :min-zoom="8"
        :max-zoom="15"
        @moveend="moveend"
        @ready="idle"
      >
        <l-tile-layer :url="osmtile" :attribution="attribution" />
        <VisualiseUser
          v-if="showFrom"
          :id="item.from.id"
          ref="fromuser"
          :lat="item.fromlat"
          :lng="item.fromlng"
          :icon="item.from.icon"
        />
        <VisualiseUser
          v-if="showTo"
          :id="item.to.id"
          ref="touser"
          :lat="item.tolat"
          :lng="item.tolng"
          :icon="item.to.icon"
        >
          <l-popup
            v-if="showThanks"
          >
            Thanks!
          </l-popup>
        </VisualiseUser>
        <div v-if="showOthers">
          <VisualiseUser
            v-for="other in item.others"
            :id="other.id"
            :key="'other-' + other.id"
            :lat="other.lat"
            :lng="other.lng"
            :icon="other.icon"
          />
        </div>
        <VisualiseMessage
          v-if="showMessage"
          :id="item.msgid"
          ref="message"
          :icon="item.attachment.path"
          :lat="item.fromlat"
          :lng="item.fromlng"
        />
        <l-marker
          v-if="item"
          :lat-lng="[item.tolat, item.tolng]"
          :options="{ opacity: 0 }"
        >
          <l-popup
            :options="{ closeButton: false, position: [15,100] }"
          >
            Hello!
          </l-popup>
        </l-marker>
      </l-map>
    </client-only>
  </div>
</template>

<script>
// TODO Make profile images and post image bounce on appearance.
import map from '@/mixins/map.js'

const VisualiseUser = () => import('./VisualiseUser')
const VisualiseMessage = () => import('./VisualiseMessage')

export default {
  components: { VisualiseMessage, VisualiseUser },
  mixins: [map],
  data: function() {
    return {
      running: true,
      index: 0,
      list: [],
      delayBeforePost: 1000,
      delayBeforeReply: 1000,
      delayBeforeCollect: 2000,
      delayBeforeReturn: 2000,
      delayBeforeThanks: 1000,
      delayBeforeNext: 2000,
      showFrom: false,
      showMessage: false,
      showTo: false,
      showOthers: false,
      showThanks: true
    }
  },
  computed: {
    mapHeight() {
      let height = 0

      if (process.browser) {
        height = window.innerHeight - 70
        height = height < 200 ? 200 : height
      }

      return height
    },
    item() {
      return this.list.length ? this.list[0] : null
    }
  },
  methods: {
    async idle(map) {
      this.boundsChanged()

      if (this.running && this.bounds) {
        if (this.list.length === 0) {
          // Get some more.
          const ret = await this.$api.visualise.fetch({
            swlat: this.bounds.getSouthWest().lat,
            swlng: this.bounds.getSouthWest().lng,
            nelat: this.bounds.getNorthEast().lat,
            nelng: this.bounds.getNorthEast().lng
          })

          if (ret.ret === 0) {
            console.log('Fetched more')
            this.list = ret.list
            this.flyToFromUser()
          } else {
            this.running = false
          }
        }
      }
    },
    moveend() {
      console.log('Move end', this.state)
      switch (this.state) {
        case 0: {
          // We have flown to the from location.  Show the posting user.
          console.log('Flown to from')
          this.showFrom = true
          setTimeout(() => {
            console.log('Show message')
            this.showMessage = true
            setTimeout(() => {
              // Show all the replies.
              console.log('Show to')
              this.showTo = true
              this.showOthers = true
              setTimeout(() => {
                // Collect - move the touser to the fromuser's location, stop showing the other replies.
                console.log('Collect')
                this.showOthers = false
                this.$refs.touser.setLatLng(
                  this.item.fromlat,
                  this.item.fromlng
                )
                setTimeout(() => {
                  console.log('Return')
                  this.$refs.touser.setLatLng(this.item.tolat, this.item.tolng)
                  this.$refs.message.setLatLng(this.item.tolat, this.item.tolng)
                  setTimeout(() => {
                    console.log('Thank')
                    this.showMessage = false
                    this.showThanks = true
                  }, this.delayBeforeThanks + 2000)
                }, this.delayBeforeReturn)
              }, this.delayBeforeCollect)
            }, this.delayBeforeReply)
          }, this.delayBeforePost)
          break
        }
      }
    },
    flyToFromUser() {
      this.state = 0
      console.log('Fly to', this.list[0])
      this.$refs.map.mapObject.flyToBounds(this.itemBounds(this.list[0]), 14)
    },
    itemBounds(item) {
      // Calculate the bounds which show all the people who replied.
      const lats = []
      const lngs = []

      lats.push(item.fromlat)
      lats.push(item.tolat)
      lngs.push(item.fromlng)
      lngs.push(item.tolng)

      item.others.forEach(o => {
        // Get distance from the poster.  Sometimes we get replies from far away which makes the map look silly, so
        // exclude those.
        const dist = this.getDistance(
          [item.fromlat, item.fromlng],
          [o.lat, o.lng]
        )

        if (dist < 20000) {
          lats.push(o.lat)
          lngs.push(o.lng)
        }
      })

      const minlat = Math.min.apply(null, lats) - 0.01
      const maxlat = Math.max.apply(null, lats) + 0.01
      const minlng = Math.min.apply(null, lngs) - 0.01
      const maxlng = Math.max.apply(null, lngs) + 0.01

      return [[minlat, minlng], [maxlat, maxlng]]
    }
  }
}
</script>
