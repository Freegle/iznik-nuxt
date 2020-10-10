<template>
  <div ref="mapcont" class="d-flex">
    <client-only>
      <l-map
        ref="map"
        :zoom="8"
        :center="center"
        :options="{ zoomControl: false, scrollWheelZoom: false}"
        :min-zoom="8"
        :max-zoom="15"
        class="flex-grow-1"
        @moveend="moveend"
        @ready="idle"
      >
        <!--        :style="'width: ' + mapWidth + 'px; height: ' + mapWidth + 'px'"-->
        <l-tile-layer :url="osmtile" :attribution="attribution" />
        <div v-if="item">
          <VisualiseUser
            v-if="showFrom"
            :id="item.from.id"
            ref="fromuser"
            :lat="item.fromlat"
            :lng="item.fromlng"
            :icon="item.from.icon"
          />
          <l-marker
            v-if="showReplies"
            :lat-lng="[item.tolat, item.tolng]"
            :icon="replyIcon(item.touser)"
            :z-index-offset="1000"
          />
          <VisualiseUser
            v-if="showTo"
            :id="item.to.id"
            ref="touser"
            :lat="item.tolat"
            :lng="item.tolng"
            :icon="item.to.icon"
          />
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
          <div v-if="showReplies">
            <l-marker
              v-for="other in item.others"
              :key="'otherreply-' + other.id"
              :lat-lng="[other.lat, other.lng]"
              :icon="replyIcon(other.id)"
              :z-index-offset="1000"
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
            v-if="item && showThanks"
            :lat-lng="[item.tolat, item.tolng]"
            :icon="thanksIcon"
          />
        </div>
      </l-map>
    </client-only>
  </div>
</template>

<script>
import Vue from 'vue'
import VisualiseSpeech from './VisualiseSpeech'
import map from '@/mixins/map.js'
import waitForRef from '@/mixins/waitForRef'

const VisualiseUser = () => import('./VisualiseUser')
const VisualiseMessage = () => import('./VisualiseMessage')

let L = null

if (process.browser) {
  L = require('leaflet')
}

export default {
  components: { VisualiseMessage, VisualiseUser },
  mixins: [map, waitForRef],
  data: function() {
    return {
      context: null,
      running: true,
      index: 0,
      list: [],
      delayBeforePost: 1000,
      delayBeforeReply: 500,
      delayBeforeCollect: 2000,
      delayBeforeReturn: 2000,
      delayBeforeThanks: 1000,
      delayBeforeNext: 2000,
      showFrom: false,
      showMessage: false,
      showReplies: false,
      showTo: false,
      showOthers: false,
      showThanks: true,
      thanksText: [
        'Thanks!',
        'Cheers!',
        'Lovely!',
        'So kind!',
        'Ta very much!',
        'Nice one!',
        'Brilliant!'
      ],
      replyText: [
        'Yes please!',
        "I'd love that!",
        'Oooh, lovely!',
        'May I collect?',
        'Me please!',
        'Perfect!'
      ]
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
    },
    thanksIcon() {
      // Render the component off document.
      const Mine = Vue.extend(VisualiseSpeech)
      let re = new Mine({
        propsData: {
          text: this.thanksText[
            // Reference item.id so that we generate a different message each time.
            Math.floor(Math.random() * this.thanksText.length) +
              this.item.id -
              this.item.id
          ]
        }
      })

      re = re.$mount().$el

      return new L.DivIcon({
        html: re.outerHTML,
        popupAnchor: [-50, -50],
        className: 'clear'
      })
    }
  },
  methods: {
    idle(map) {
      this.boundsChanged()

      if (this.running && this.bounds) {
        if (this.list.length === 0) {
          this.doNext()
        }
      }
    },
    moveend() {
      switch (this.state) {
        case 0: {
          // We have flown to the from location.  Show the posting user.
          this.showFrom = true
          setTimeout(() => {
            this.showMessage = true
            setTimeout(() => {
              // Show all the repliers
              this.showTo = true
              this.showOthers = true
              setTimeout(() => {
                // Show the reply text.
                this.showReplies = true
                setTimeout(() => {
                  // Collect - move the touser to the fromuser's location, stop showing the other replies.
                  this.showOthers = false
                  this.showReplies = false
                  this.waitForRef('touser', () => {
                    this.$refs.touser.setLatLng(
                      this.item.fromlat,
                      this.item.fromlng
                    )
                    setTimeout(() => {
                      if (this.$refs.touser) {
                        this.$refs.touser.setLatLng(
                          this.item.tolat,
                          this.item.tolng
                        )
                        this.waitForRef('message', () => {
                          this.$refs.message.setLatLng(
                            this.item.tolat,
                            this.item.tolng
                          )
                          setTimeout(() => {
                            this.showMessage = false
                            this.showThanks = true
                            setTimeout(() => {
                              this.list.shift()
                              this.doNext()
                            }, this.delayBeforeNext)
                          }, this.delayBeforeThanks + 2000)
                        })
                      }
                    }, this.delayBeforeReturn)
                  })
                }, this.delayBeforeCollect)
              }, this.delayBeforeReply)
            }, this.delayBeforeReply)
          }, this.delayBeforePost)
          break
        }
      }
    },
    flyToFromUser() {
      this.state = 0

      if (this.list.length) {
        if (this.$refs.map) {
          this.$refs.map.mapObject.flyToBounds(
            this.itemBounds(this.list[0]),
            14
          )
        }
      }
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
    },
    async doNext() {
      this.showFrom = false
      this.showMessage = false
      this.showTo = false
      this.showOthers = false
      this.showThanks = false
      this.showReplies = false

      if (this.list.length === 0) {
        // Get some more.
        const ret = await this.$api.visualise.fetch({
          swlat: this.bounds.getSouthWest().lat,
          swlng: this.bounds.getSouthWest().lng,
          nelat: this.bounds.getNorthEast().lat,
          nelng: this.bounds.getNorthEast().lng,
          context: this.context
        })

        if (ret.ret === 0) {
          this.context = ret.context
          this.list = ret.list
        } else {
          this.running = false
        }
      }

      this.flyToFromUser()
    },
    replyIcon(id) {
      // Render the component off document.
      const Mine = Vue.extend(VisualiseSpeech)
      let re = new Mine({
        propsData: {
          text: this.replyText[
            // Reference id so that we generate a different message each time.
            (id % this.replyText.length) + this.item.id - this.item.id
          ]
        }
      })

      re = re.$mount().$el

      return new L.DivIcon({
        html: re.outerHTML,
        popupAnchor: [-50, -50],
        className: 'clear'
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.ourpopup {
  color: $colour-success;
  font-weight: bold;
}
</style>
