<template>
  <div>
    <client-only>
      <div class="maptools d-flex mb-1 justify-content-between">
        <gmap-autocomplete
          id="autocomplete"
          v-focus
          class="form-control max"
          placeholder="Enter a location"
          :options="gb"
          :types="['(cities)']"
          @place_changed="getAddressData"
        />
        <b-form-checkbox v-if="groups" v-model="cga" class="ml-2">
          <b style="color: darkgreen">Show CGAs</b>
        </b-form-checkbox>
        <b-form-checkbox v-if="groups" v-model="dpa" class="ml-2">
          <b style="color: darkblue">Show DPAs</b>
        </b-form-checkbox>
        <b-form-checkbox v-model="shade" class="ml-2">
          <b>Shade areas</b>
        </b-form-checkbox>
      </div>
      <b-row class="m-0">
        <b-col cols="12" md="8" lg="9" class="p-0">
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
          />
        </b-col>
        <b-col cols="12" md="4" lg="3">
          <div v-if="selectedName" class="mb-2">
            <h5>{{ selectedName }}</h5>
            <b-textarea v-model="selectedWKT" rows="4" />
          </div>
          <h5>Postcode Tester</h5>
          <p>
            You can see which community and area a postcode will map to. It may take upto an hour after changing a polygon
            before postcodes will map to it.
          </p>
          <Postcode :find="false" @selected="postcodeSelect" @cleared="postcodeCleared" />
          <div v-if="postcode" class="mt-2">
            <p>
              <b>Community:</b>
            </p>
            <p v-if="postcode.groupsnear && postcode.groupsnear.length">
              {{ postcode.groupsnear[0].namedisplay }}
            </p>
            <p v-else>
              No community found
            </p>
            <p>
              <b>Area:</b>
            </p>
            <p v-if="postcode.area">
              {{ postcode.area.name }}
            </p>
            <p v-else>
              No area found
            </p>
          </div>
        </b-col>
      </b-row>
    </client-only>
  </div>
</template>

<script>
import { gmapApi } from 'vue2-google-maps'
import Wkt from 'wicket'
import 'wicket/wicket-gmap3'
import Postcode from './Postcode'

export default {
  components: { Postcode },
  props: {
    groups: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      zoom: 8,
      bounds: null,
      gb: {
        componentRestrictions: {
          country: ['gb']
        }
      },
      cgaMapped: [],
      dpaMapped: [],
      groupCentres: [],
      dpa: false,
      cga: true,
      shade: true,
      selectedName: null,
      selectedWKT: null,
      selectedObj: null,
      selectOldColour: null,
      postcode: null
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
    groupsInBounds() {
      const groups = Object.values(this.$store.getters['group/list'])
      const ret = []

      if (this.bounds) {
        for (const ix in groups) {
          const group = groups[ix]
          if (
            group.lat >= this.bounds.sw.lat &&
            group.lng >= this.bounds.sw.lng &&
            group.lat <= this.bounds.ne.lat &&
            group.lng <= this.bounds.ne.lng
          ) {
            ret.push(group)
          }
        }
      }

      return ret
    }
  },
  watch: {
    cga() {
      this.addGroups(true)
    },
    dpa() {
      this.addGroups(true)
    },
    shade() {
      this.addGroups(true)
    }
  },
  async mounted() {
    if (this.groups) {
      await this.$store.dispatch('group/list', {
        grouptype: 'Freegle'
      })

      this.addGroups()
    }
  },
  methods: {
    getAddressData: function(addressData, placeResultData, id) {
      if (addressData) {
        this.$refs.gmap.$mapObject.setCenter(addressData.geometry.location)
        this.$refs.gmap.$mapObject.setZoom(11)
      }
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

        this.addGroups()
      }
    },
    mapPoly: function(poly, options) {
      const wkt = new Wkt.Wkt()
      wkt.read(poly)

      const mapobj = this.$refs.gmap.$mapObject
      const obj = wkt.toObject(mapobj.defaults)

      if (obj) {
        // This might be a multipolygon.
        if (Array.isArray(obj)) {
          for (const ent of obj) {
            ent.setMap(mapobj)
            ent.setOptions(options)
          }
        } else {
          obj.setMap(mapobj)
          obj.setOptions(options)
        }
      }

      return obj
    },
    selectArea(obj, name, tag, poly) {
      if (this.selectedObj) {
        // Reset the colour on a previously selected object.
        console.log('Old', this.selectedObj)
        this.selectedObj.setOptions({ strokeColor: this.selectOldColour })
      }

      this.selectedName = name + ' ' + tag
      this.selectedWKT = poly
      this.selectedObj = obj
      this.selectOldColour = obj.strokeColor
      obj.setOptions({ strokeColor: '#990000' })
    },
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
    addGroups(clear) {
      const google = gmapApi()
      const mapobj = this.$refs.gmap.$mapObject

      if (clear) {
        this.cgaMapped.forEach(g => {
          g.setMap(null)
        })

        this.dpaMapped.forEach(g => {
          g.setMap(null)
        })

        this.groupCentres.forEach(g => {
          g.setMap(null)
        })

        this.cgaMapped = []
        this.dpaMapped = []
        this.groupCentres = []
      }

      let options

      this.groupsInBounds.forEach(g => {
        if (this.cga && g.polyofficial && !this.cgaMapped[g.id]) {
          if (this.shade) {
            options = {
              strokeColor: 'darkgreen',
              fillColor: '#EEFFCC',
              fillOpacity: 0.6
            }
          } else {
            options = {
              strokeColor: 'darkgreen',
              fillOpacity: 0
            }
          }

          const obj = this.mapPoly(g.polyofficial, options)
          this.cgaMapped[g.id] = obj

          google.maps.event.addListener(obj, 'click', () => {
            this.selectArea(obj, g.namedisplay, 'CGA', g.polyofficial)
          })
        }

        if (this.dpa && g.poly && !this.dpaMapped[g.id]) {
          if (this.shade) {
            options = {
              strokeColor: 'darkblue',
              fillColor: '#EEFFCC',
              fillOpacity: 0.6
            }
          } else {
            options = {
              strokeColor: 'darkblue',
              fillOpacity: 0
            }
          }

          const obj = this.mapPoly(g.poly, options)
          this.dpaMapped[g.id] = obj

          google.maps.event.addListener(obj, 'click', () => {
            this.selectArea(obj, g.namedisplay, 'DPA', g.poly)
          })
        }

        this.groupCentres[g.id] = new google.maps.Marker({
          position: new google.maps.LatLng(g.lat, g.lng),
          map: mapobj,
          title: g.namedisplay,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: 'darkgreen',
            fillOpacity: 1,
            strokeColor: 'darkgrey',
            strokeOpacity: 1,
            strokeWeight: 1,
            scale: 7
          }
        })
      })
    },
    postcodeSelect(pc) {
      this.postcode = pc
    },
    postcodeClear() {
      this.postcode = null
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
