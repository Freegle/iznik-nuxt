<template>
  <div>
    <p>Here's a map showing the approximate location of recently active volunteers.  Hello us!</p>
    <client-only>
      <GmapMap
        ref="gmap"
        :center="{lat:53.9450, lng:-2.5209}"
        :zoom="zoom"
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
        @zoom_changed="zoomChanged"
        @bounds_changed="boundsChanged"
      >
        <div v-for="m in membersInBounds" :key="'marker-' + m.userid">
          <UserMarker :user="m" :size="largeMarkers ? 'rich' : 'poor'" />
        </div>
      </GmapMap>
    </client-only>
  </div>
</template>

<script>
import { gmapApi } from 'vue2-google-maps'
import UserMarker from '../../components/UserMarker'
import loginRequired from '@/mixins/loginRequired.js'

export default {
  components: { UserMarker },
  layout: 'modtools',
  mixins: [loginRequired],
  data: function() {
    return {
      zoom: 8,
      bounds: null
    }
  },
  computed: {
    browser() {
      return process.browser
    },
    mapHeight() {
      const contWidth = this.$refs.mapcont ? this.$refs.mapcont.$el.width : 0
      return contWidth
    },
    mapWidth() {
      let height = 0

      if (process.browser) {
        height = window.innerHeight - 66 - 100
        height = height < 200 ? 200 : height
      }

      return height
    },
    largeMarkers() {
      return this.zoom > 10
    },
    members() {
      return this.$store.getters['members/getAll']
    },
    membersInBounds() {
      const members = this.members
      const ret = []

      if (!process.browser) {
        // SSR - return all for SRO.
        for (const ix in members) {
          const member = members[ix]
          ret.push(member)
        }
      } else if (this.bounds) {
        for (const ix in members) {
          const member = members[ix]

          if (
            member.lat >= this.bounds.sw.lat &&
            member.lng >= this.bounds.sw.lng &&
            member.lat <= this.bounds.ne.lat &&
            member.lng <= this.bounds.ne.lng
          ) {
            ret.push(member)
          }
        }
      }

      return ret
    }
  },
  async mounted() {
    await this.$store.dispatch('members/clear')
    await this.$store.dispatch('members/fetchMembers', {
      collection: 'Nearby'
    })
  },
  methods: {
    google() {
      const google = gmapApi()

      // No getBounds on polygon by default.
      google.maps.Polygon.prototype.getBounds = function() {
        const bounds = new google.maps.LatLngBounds()
        const paths = this.getPaths()
        let path
        for (let i = 0; i < paths.getLength(); i++) {
          path = paths.getAt(i)
          for (let ii = 0; ii < path.getLength(); ii++) {
            bounds.extend(path.getAt(ii))
          }
        }
        return bounds
      }

      return google
    },
    zoomChanged: function(zoom) {
      this.zoom = zoom
    },
    boundsChanged: function(bounds) {
      if (bounds) {
        this.bounds = {
          ne: {
            lat: bounds.getNorthEast().lat(),
            lng: bounds.getNorthEast().lng()
          },
          sw: {
            lat: bounds.getSouthWest().lat(),
            lng: bounds.getSouthWest().lng()
          }
        }
      }
    }
  }
}
</script>
<style scoped>
.maptools {
  max-height: 38px;
}

.max {
  max-width: 300px;
}
</style>
