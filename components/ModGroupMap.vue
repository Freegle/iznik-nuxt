<template>
  <div>
    <client-only>
      <div class="maptools d-flex mb-1 justify-content-between">
        <div class="d-flex">
          <gmap-autocomplete
            id="autocomplete"
            v-focus
            class="form-control max"
            placeholder="Enter a location"
            :options="gb"
            :types="['(cities)']"
            @place_changed="getAddressData"
          />
          <v-icon name="sync" :class="busy ? 'text-success fa-spin ml-4 mt-1' : 'text-faded ml-4 mt-1'" scale="2" />
        </div>
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
          <b-card v-if="selectedObj" class="mb-2" no-body>
            <b-card-header class="bg-info">
              Area Details
            </b-card-header>
            <b-card-body>
              <div v-if="groupid">
                <b-input v-model="selectedName" placeholder="Enter area name" size="lg" class="mb-1" />
                <b-textarea v-model="selectedWKT" rows="4" />
              </div>
              <div v-else>
                <h5>{{ selectedName }}</h5>
                <b-textarea v-model="selectedWKT" rows="4" readonly />
              </div>
            </b-card-body>
            <b-card-footer class="d-flex justify-content-between flex-wrap">
              <SpinButton
                variant="success"
                name="save"
                label="Save"
                spinclass="text-white"
                :handler="saveArea"
                :disabled="!selectedName || !selectedWKT"
              />
              <SpinButton variant="white" name="times" label="Cancel" :handler="cancelArea" />
              <SpinButton v-if="selectedId" variant="danger" name="trash-alt" label="Delete" :handler="deleteArea" />
            </b-card-footer>
          </b-card>
          <b-card no-body>
            <b-card-header class="bg-info">
              Postcode Tester
            </b-card-header>
            <b-card-body>
              <p>
                You can see which community and area a postcode will map to. It may take upto an hour after changing a polygon
                before postcodes will map to it.
              </p>
              <Postcode :find="false" @selected="postcodeSelect" />
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
            </b-card-body>
          </b-card>
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
import SpinButton from './SpinButton'

const GROUP_FILL_COLOUR = '#EEFFCC'
const AREA_FILL_COLOUR = 'darkgreen'
const FILL_OPACITY = 0.6
const CGA_BOUNDARY_COLOUR = 'darkgreen'
const DPA_BOUNDARY_COLOUR = 'darkblue'
const AREA_BOUNDARY_COLOUR = 'darkblue'
const CENTRE_FILL_COLOUR = 'darkgreen'
const CENTRE_BORDER_COLOUR = 'darkgrey'
const SELECTED = '#990000'

export default {
  components: { SpinButton, Postcode },
  props: {
    groups: {
      type: Boolean,
      required: false,
      default: false
    },
    groupid: {
      type: Number,
      required: false,
      default: null
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
      areaMapped: [],
      dpa: false,
      cga: true,
      shade: true,
      selectedName: null,
      selectedWKT: null,
      selectedObj: null,
      selectedId: null,
      savedName: null,
      savedWKT: null,
      selectOldColour: null,
      postcode: null,
      busy: false
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
    },
    locationsInBounds() {
      const locations = Object.values(this.$store.getters['locations/list'])
      const ret = []

      if (this.bounds) {
        for (const location of locations) {
          if (
            location.lat >= this.bounds.sw.lat &&
            location.lng >= this.bounds.sw.lng &&
            location.lat <= this.bounds.ne.lat &&
            location.lng <= this.bounds.ne.lng
          ) {
            ret.push(location)
          }
        }
      }

      return ret
    }
  },
  watch: {
    cga() {
      this.addAreas(true)
    },
    dpa() {
      this.addAreas(true)
    },
    shade(newval) {
      if (this.groups) {
        this.addAreas(true)
      } else {
        this.areaMapped.forEach(a => {
          a.obj.setOptions({
            fillOpacity: newval ? FILL_OPACITY : 0
          })
        })
      }
    },
    locationsInBounds(newlocs) {
      // Map all locations which are new
      newlocs.forEach(l => {
        if (!this.areaMapped[l.id] && l.polygon) {
          const obj = this.mapPoly(l.polygon, {
            strokeColor: AREA_BOUNDARY_COLOUR,
            fillColor: AREA_FILL_COLOUR,
            fillOpacity: FILL_OPACITY
          })

          this.areaMapped[l.id] = {
            id: l.id,
            obj: obj
          }

          const google = this.google()
          google.maps.event.addListener(obj, 'click', () => {
            this.selectArea(l.id, obj, l.name, '', l.polygon)
          })
        }
      })
    }
  },
  async mounted() {
    if (this.groups) {
      // We want to show all groups
      await this.$store.dispatch('group/list', {
        grouptype: 'Freegle'
      })

      this.addAreas()
    } else {
      // Areas for a specific group.
      await this.$store.dispatch('group/fetch', {
        id: this.groupid,
        polygon: true
      })

      const group = this.$store.getters['group/get'](this.groupid)

      // We want to find the area for this group.  Convert the CGA into an object so that we can get
      // bounds from it.  Need to wait for the map to be loaded before we can start messing with google.
      this.$refs.gmap.$mapPromise.then(map => {
        const google = this.google()

        // Set up idle handler for map
        google.maps.event.addListener(map, 'idle', this.idle)

        // Now change the bounds of the map, which will cause that handler to kick in.
        const wkt = new Wkt.Wkt()
        wkt.read(group.cga)

        const obj = wkt.toObject()
        const bounds = obj.getBounds()
        map.fitBounds(bounds)

        if (this.groupid) {
          // Can modify areas.
          this.drawingManager = new google.maps.drawing.DrawingManager({
            drawingControlOptions: {
              position: google.maps.ControlPosition.TOP_RIGHT,
              drawingModes: [google.maps.drawing.OverlayType.POLYGON]
            },
            markerOptions: map.defaults,
            polygonOptions: map.defaults,
            polylineOptions: map.defaults,
            rectangleOptions: map.defaults
          })

          this.drawingManager.setMap(map)
          google.maps.event.addListener(
            this.drawingManager,
            'overlaycomplete',
            this.shapeAdded
          )
        }
      })
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

        this.addAreas()
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
    clearSelection() {
      if (this.selectedObj) {
        this.selectedObj.setOptions({
          strokeColor: AREA_BOUNDARY_COLOUR,
          editable: false
        })
      }

      this.selectedObj = null
      this.selectedId = null
      this.selectedName = null
      this.selectedWKT = null
    },
    selectArea(id, obj, name, tag, poly) {
      if (this.selectedObj) {
        // Remove any colouring or changes to the previous selection.
        this.cancelArea()
      }

      this.selectedName = name + ' ' + tag
      this.selectedWKT = poly
      this.savedName = name
      this.savedWKT = poly
      this.selectedObj = obj
      this.selectedId = id
      this.selectOldColour = obj.strokeColor

      obj.setOptions({ strokeColor: SELECTED })

      if (this.groupid) {
        // Allow them to edit it.
        obj.setOptions({ editable: true })
        this.setHandlers()
      }
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
    addAreas(clear) {
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

        this.areaMapped.forEach(g => {
          g.obj.setMap(null)
        })

        this.cgaMapped = []
        this.dpaMapped = []
        this.groupCentres = []
        this.areaMapped = []
      }

      let options

      if (this.groups) {
        this.groupsInBounds.forEach(g => {
          if (this.cga && g.polyofficial && !this.cgaMapped[g.id]) {
            if (this.shade) {
              options = {
                strokeColor: CGA_BOUNDARY_COLOUR,
                fillColor: GROUP_FILL_COLOUR,
                fillOpacity: FILL_OPACITY
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
              this.selectArea(g.id, obj, g.namedisplay, 'CGA', g.polyofficial)
            })
          }

          if (this.dpa && g.poly && !this.dpaMapped[g.id]) {
            if (this.shade) {
              options = {
                strokeColor: DPA_BOUNDARY_COLOUR,
                fillColor: GROUP_FILL_COLOUR,
                fillOpacity: FILL_OPACITY
              }
            } else {
              options = {
                strokeColor: DPA_BOUNDARY_COLOUR,
                fillOpacity: 0
              }
            }

            const obj = this.mapPoly(g.poly, options)
            this.dpaMapped[g.id] = obj

            google.maps.event.addListener(obj, 'click', () => {
              this.selectArea(g.id, obj, g.namedisplay, 'DPA', g.poly)
            })
          }

          this.groupCentres[g.id] = new google.maps.Marker({
            position: new google.maps.LatLng(g.lat, g.lng),
            map: mapobj,
            title: g.namedisplay,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: CENTRE_FILL_COLOUR,
              fillOpacity: 1,
              strokeColor: CENTRE_BORDER_COLOUR,
              strokeOpacity: 1,
              strokeWeight: 1,
              scale: 7
            }
          })
        })
      }
    },
    postcodeSelect(pc) {
      this.postcode = pc
    },
    postcodeClear() {
      this.postcode = null
    },
    async idle() {
      this.busy = true

      if (this.$refs.gmap) {
        const bounds = this.$refs.gmap.$mapObject.getBounds()

        const data = {
          swlat: bounds.getSouthWest().lat(),
          swlng: bounds.getSouthWest().lng(),
          nelat: bounds.getNorthEast().lat(),
          nelng: bounds.getNorthEast().lng()
        }

        await this.$store.dispatch('locations/fetch', data)
      }

      this.busy = false
    },
    setHandlers() {
      const google = this.google()

      // New vertex is inserted
      google.maps.event.addListener(
        this.selectedObj.getPath(),
        'insert_at',
        this.changeHandler
      )

      // Existing vertex is removed (insertion is undone)
      google.maps.event.addListener(
        this.selectedObj.getPath(),
        'remove_at',
        this.changeHandler
      )

      // Existing vertex is moved (set elsewhere)
      google.maps.event.addListener(
        this.selectedObj.getPath(),
        'set_at',
        this.changeHandler
      )

      // Allow us to change this object.
      this.selectedObj.setOptions({ editable: true })
    },
    shapeAdded(event) {
      const google = this.google()

      // We have drawn a new shape.
      console.log('Shape added', event)

      // Polygon drawn
      const obj = event.overlay

      // Set the drawing mode to "pan" (the hand) so users can immediately edit
      this.drawingManager.setDrawingMode(null)

      if (
        event.type === google.maps.drawing.OverlayType.POLYGON ||
        event.type === google.maps.drawing.OverlayType.POLYLINE
      ) {
        this.selectedObj = obj
        this.selectedId = null
        this.selectedName = null
        this.savedName = null
        this.savedWKT = null
        this.setHandlers()
        this.changeHandler()
      }
    },
    changeHandler() {
      // Get the data from the object and turn it into WKT.
      console.log('Change on', this.selectedObj)
      const wkt = new Wkt.Wkt()
      wkt.fromObject(this.selectedObj)
      const newwkt = wkt.write()
      console.log('Got new WKT', newwkt)
      this.selectedWKT = newwkt
    },
    async saveArea() {
      this.busy = true

      if (!this.selectedId) {
        // This is a new area.
        await this.$store.dispatch('locations/add', {
          name: this.selectedName,
          polygon: this.selectedWKT
        })
      } else {
        // This is an existing area
        await this.$store.dispatch('locations/update', {
          id: this.selectedId,
          name: this.selectedName,
          polygon: this.selectedWKT
        })
      }

      this.clearSelection()
      this.busy = false
    },
    async deleteArea() {
      this.busy = true

      await this.$store.dispatch('locations/delete', {
        id: this.selectedId,
        groupid: this.groupid
      })

      // Remove from map
      this.selectedObj.setMap(null)

      this.clearSelection()
      this.busy = false
    },
    cancelArea() {
      // Delete the currently selected area from the map.
      this.selectedObj.setMap(null)

      // Restore data
      this.selectedName = this.savedName
      this.selectedWKT = this.savedWKT

      if (this.selectedWKT) {
        // Remap the restored data
        this.mapPoly(this.selectedWKT)
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
