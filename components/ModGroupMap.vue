<template>
  <div>
    <client-only>
      <div class="maptools d-flex mb-1 justify-content-between">
        <div class="d-flex">
          <!--          TODO MAPS AUTOCOMPLETE-->
          <gmap-autocomplete
            v-if="false"
            id="autocomplete"
            v-focus
            class="form-control max"
            placeholder="Enter a location"
            :options="gb"
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
        <b-col ref="mapcont" cols="12" md="8" lg="9" class="p-0">
          <l-map
            ref="map"
            :zoom="5"
            :center="center"
            :style="'width: ' + mapWidth + '; height: ' + mapHeight + 'px'"
            :min-zoom="5"
            :max-zoom="17"
            @update:bounds="boundsChanged"
            @update:zoom="boundsChanged"
            @ready="idle"
          >
            <l-tile-layer :url="osmtile" :attribution="attribution" />
            <l-control position="topright" />
            <div v-if="cga">
              <l-geojson v-for="(c, i) in CGAs" :key="'cga-' + i" :geojson="c.json" :options="cgaOptions" @click="selectCGA(c.group)" />
            </div>
            <div v-if="dpa">
              <l-geojson v-for="(d, i) in DPAs" :key="'dpa-' + i" :geojson="d.json" :options="dpaOptions" @click="selectDPA(d.group)" />
            </div>
            <div v-if="groupid">
              <l-feature-group>
                <ModGroupMapLocation
                  v-for="l in locationsInBounds"
                  :key="'location-' + l.id"
                  :ref="'location-' + l.id"
                  :location="l"
                  :selected="selectedObj === l"
                  :shade="shade"
                  @click="selectLocation(l)"
                />
              </l-feature-group>
            </div>
            <div v-if="groups && zoom > 7">
              <l-circle-marker v-for="g in allgroups" :key="'groupcentre-' + g.id" :lat-lng="[g.lat, g.lng]" :options="{ radius: zoom, color: 'darkgreen', fill: true, fillColor: 'darkgreen', fillOpacity: 1 }" />
            </div>
          </l-map>
        </b-col>
        <b-col cols="12" md="4" lg="3">
          <b-card v-if="selectedWKT" class="mb-2" no-body>
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
            <b-card-footer v-if="groupid" class="d-flex justify-content-between flex-wrap">
              <SpinButton
                variant="primary"
                name="save"
                label="Save"
                spinclass="text-white"
                :handler="saveArea"
                :disabled="!selectedName || !selectedWKT"
              />
              <SpinButton variant="white" name="times" label="Cancel" :handler="clearSelection" />
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
import Postcode from './Postcode'
import SpinButton from './SpinButton'
import ModGroupMapLocation from './ModGroupMapLocation'
import map from '@/mixins/map.js'

let Wkt = null
let L = null

if (process.browser) {
  Wkt = require('wicket')
  require('wicket/wicket-leaflet')
  L = require('leaflet')
  require('leaflet-draw')
}

// const GROUP_FILL_COLOUR = '#EEFFCC'
const AREA_FILL_COLOUR = 'darkgreen'
const FILL_OPACITY = 0.6
const CGA_BOUNDARY_COLOUR = 'darkgreen'
const DPA_BOUNDARY_COLOUR = 'darkblue'
// const CENTRE_FILL_COLOUR = 'darkgreen'
// const CENTRE_BORDER_COLOUR = 'darkgrey'

export default {
  components: { ModGroupMapLocation, SpinButton, Postcode },
  mixins: [map],
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
      cgas: [],
      dpas: [],
      initialGroupZoomed: false,

      // TODO MAPS AUTOCOMPLETE
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
      let height = 0

      if (process.browser) {
        height = window.innerHeight - 150
      }

      return height
    },
    allgroups() {
      return Object.values(this.$store.getters['group/list'])
    },
    group() {
      console.log('Compute group', this.groupid)
      return this.groupid
        ? this.$store.getters['group/get'](this.groupid)
        : null
    },
    groupsInBounds() {
      const ret = []

      if (this.bounds) {
        for (const group in this.allgroups) {
          if (this.bounds.contains([group.lat, group.lng])) {
            ret.push(group)
          }
        }
      }

      return ret
    },
    CGAs() {
      const ret = []

      this.allgroups.forEach(g => {
        if (g.polyofficial) {
          const wkt = new Wkt.Wkt()
          wkt.read(g.polyofficial)
          ret.push({
            json: wkt.toJson(),
            group: g
          })
        }
      })

      return ret
    },
    DPAs() {
      const ret = []

      this.allgroups.forEach(g => {
        if (g.poly) {
          const wkt = new Wkt.Wkt()
          wkt.read(g.poly)
          ret.push({
            json: wkt.toJson(),
            group: g
          })
        }
      })

      return ret
    },
    locationsInBounds() {
      const locations = Object.values(this.$store.getters['locations/list'])
      const ret = []

      if (this.bounds) {
        for (const location of locations) {
          if (
            location.polygon &&
            this.bounds.contains([location.lat, location.lng])
          ) {
            const wkt = new Wkt.Wkt()
            try {
              wkt.read(location.polygon)
              location.json = wkt.toJson()
              ret.push(location)
            } catch (e) {
              console.log('WKT error', location)
            }
          }
        }
      }

      return ret
    },
    cgaOptions() {
      return {
        fillColor: AREA_FILL_COLOUR,
        fillOpacity: this.shade ? FILL_OPACITY : 0,
        color: CGA_BOUNDARY_COLOUR
      }
    },
    dpaOptions() {
      return {
        fillColor: AREA_FILL_COLOUR,
        fillOpacity: this.shade ? FILL_OPACITY : 0,
        color: DPA_BOUNDARY_COLOUR
      }
    }
  },
  mounted() {
    // Add the draw toolbar as per https://github.com/vue-leaflet/Vue2Leaflet/issues/331
    this.$nextTick(() => {
      const map = this.$refs.map.mapObject
      console.log('L', L)

      // Last layer is drawn items.  Seems to be, anyway.  Need to use this so that we can turn on editing for
      // the locations we've already got, as well as any new ones we draw.
      let drawnItems = null

      map.eachLayer(l => {
        drawnItems = l
      })

      if (drawnItems) {
        const drawControl = new L.Control.Draw({
          edit: {
            featureGroup: drawnItems,
            remove: false,
            edit: false
          },
          position: 'topright',
          draw: {
            polyline: false,
            polygon: true,
            rectangle: false,
            circle: false,
            marker: false,
            circlemarker: false
          }
        })

        map.addControl(drawControl)

        map.on(L.Draw.Event.CREATED, e => {
          // const type = e.layerType;
          const layer = e.layer
          layer.editing.enable()
          layer.addTo(drawnItems)

          const wkt = new Wkt.Wkt()
          wkt.fromObject(layer)
          this.selectedWKT = wkt.write()
          console.log('Created', this.selectedWKT)
        })

        map.on(L.Draw.Event.DRAWVERTEX, this.shapeChanged)
        map.on(L.Draw.Event.EDITVERTEX, this.shapeChanged)
      }
    })
  },
  methods: {
    getAddressData: function(addressData, placeResultData, id) {
      // TODO MAPS AUTOCOMPLETE
      if (
        addressData &&
        addressData.geometry &&
        addressData.geometry.location
      ) {
        this.$refs.gmap.$mapObject.setCenter(addressData.geometry.location)
        this.$refs.gmap.$mapObject.setZoom(11)
      }
    },
    clearSelection() {
      this.selectedObj = null
      this.selectedId = null
      this.selectedName = null
      this.selectedWKT = null

      if (this.$refs.map) {
        // Re-enable map movement.
        const mapobj = this.$refs.map.mapObject
        mapobj._handlers.forEach(function(handler) {
          handler.enable()
        })
      }
    },
    selectCGA(g) {
      this.selectedObj = g
      this.selectedName = g.nameshort + ' CGA'
      this.selectedWKT = g.polyofficial
    },
    selectDPA(g) {
      this.selectedObj = g
      this.selectedName = g.nameshort + ' DPA'
      this.selectedWKT = g.poly
    },
    selectLocation(l) {
      this.selectedId = l.id
      this.selectedObj = l
      this.selectedName = l.name
      this.selectedWKT = l.polygon

      // Disable map movement to avoid triggering location reload.
      const mapobj = this.$refs.map.mapObject
      mapobj._handlers.forEach(function(handler) {
        handler.disable()
      })
    },
    shapeChanged(e) {
      if (e.poly) {
        const wkt = new Wkt.Wkt()
        wkt.fromObject(e.poly)
        this.selectedWKT = wkt.write()
      }
    },
    postcodeSelect(pc) {
      this.postcode = pc
    },
    postcodeClear() {
      this.postcode = null
    },
    async idle() {
      if (this.groupid && this.group) {
        const group = this.$store.getters['group/get'](this.groupid)

        if (group) {
          let bounds

          if (!this.initialGroupZoomed) {
            // Zoom the map to fit the DPA/CGA of the group.  We need to do this before fetching the locations so that
            // we don't fetch them for the whole country.
            this.initialGroupZoomed = true
            const area = this.group.dpa || this.group.cga

            const wkt = new Wkt.Wkt()
            wkt.read(area)
            const mapobj = this.$refs.map.mapObject
            const obj = wkt.toObject(mapobj.defaults)
            bounds = obj.getBounds()
            mapobj.fitBounds(bounds)
          } else {
            // Get the locations in this area
            bounds = this.$refs.map.mapObject.getBounds()
          }

          this.busy = true

          const data = {
            swlat: bounds.getSouthWest().lat,
            swlng: bounds.getSouthWest().lng,
            nelat: bounds.getNorthEast().lat,
            nelng: bounds.getNorthEast().lng
          }

          await this.$store.dispatch('locations/fetch', data)

          this.busy = false
        }
      }
    },
    async boundsChanged() {
      this.bounds = this.$refs.map.mapObject.getBounds()
      this.zoom = this.$refs.map.mapObject.getZoom()
      this.busy = true

      const data = {
        swlat: this.bounds.getSouthWest().lat,
        swlng: this.bounds.getSouthWest().lng,
        nelat: this.bounds.getNorthEast().lat,
        nelng: this.bounds.getNorthEast().lng
      }

      await this.$store.dispatch('locations/fetch', data)

      this.busy = false
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
      this.boundsChanged()

      this.busy = false
    },
    async deleteArea() {
      this.busy = true

      await this.$store.dispatch('locations/delete', {
        id: this.selectedId,
        groupid: this.groupid
      })

      this.clearSelection()
      this.busy = false
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

/* Having trouble getting the CSS in here, so inlined.  Also added images. */
::v-deep .leaflet-draw-section {
  position: relative;
}
::v-deep .leaflet-draw-toolbar {
  margin-top: 12px;
}
::v-deep .leaflet-draw-toolbar-top {
  margin-top: 0;
}
::v-deep .leaflet-draw-toolbar-notop a:first-child {
  border-top-right-radius: 0;
}
::v-deep .leaflet-draw-toolbar-nobottom a:last-child {
  border-bottom-right-radius: 0;
}
::v-deep .leaflet-draw-toolbar a {
  background-image: url('/drawtoolbar/spritesheet.png');
  background-image: linear-gradient(transparent, transparent),
    url('/drawtoolbar/spritesheet.svg');
  background-repeat: no-repeat;
  background-size: 300px 30px;
  background-clip: padding-box;
}
::v-deep .leaflet-retina .leaflet-draw-toolbar a {
  background-image: url('/drawtoolbar/spritesheet-2x.png');
  background-image: linear-gradient(transparent, transparent),
    url('/drawtoolbar/spritesheet.svg');
}
::v-deep .leaflet-draw a {
  display: block;
  text-align: center;
  text-decoration: none;
}
::v-deep .leaflet-draw a .sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
::v-deep .leaflet-draw-actions {
  display: none;
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  left: 26px;
  top: 0;
  white-space: nowrap;
}
::v-deep .leaflet-touch .leaflet-draw-actions {
  left: 32px;
}
::v-deep .leaflet-right .leaflet-draw-actions {
  right: 26px;
  left: auto;
}
::v-deep .leaflet-touch .leaflet-right .leaflet-draw-actions {
  right: 32px;
  left: auto;
}
::v-deep .leaflet-draw-actions li {
  display: inline-block;
}
::v-deep .leaflet-draw-actions li:first-child a {
  border-left: 0;
}
::v-deep .leaflet-draw-actions li:last-child a {
  -webkit-border-radius: 0 4px 4px 0;
  border-radius: 0 4px 4px 0;
}
::v-deep .leaflet-right .leaflet-draw-actions li:last-child a {
  -webkit-border-radius: 0;
  border-radius: 0;
}
::v-deep .leaflet-right .leaflet-draw-actions li:first-child a {
  -webkit-border-radius: 4px 0 0 4px;
  border-radius: 4px 0 0 4px;
}
::v-deep .leaflet-draw-actions a {
  background-color: #919187;
  border-left: 1px solid #aaa;
  color: #fff;
  font: 11px/19px 'Helvetica Neue', Arial, Helvetica, sans-serif;
  line-height: 28px;
  text-decoration: none;
  padding-left: 10px;
  padding-right: 10px;
  height: 28px;
}
::v-deep .leaflet-touch .leaflet-draw-actions a {
  font-size: 12px;
  line-height: 30px;
  height: 30px;
}
::v-deep .leaflet-draw-actions-bottom {
  margin-top: 0;
}
::v-deep .leaflet-draw-actions-top {
  margin-top: 1px;
}
::v-deep .leaflet-draw-actions-top a,
.leaflet-draw-actions-bottom a {
  height: 27px;
  line-height: 27px;
}
::v-deep .leaflet-draw-actions a:hover {
  background-color: #a0a098;
}
::v-deep .leaflet-draw-actions-top.leaflet-draw-actions-bottom a {
  height: 26px;
  line-height: 26px;
}
::v-deep .leaflet-draw-toolbar .leaflet-draw-draw-polyline {
  background-position: -2px -2px;
}
::v-deep .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-draw-polyline {
  background-position: 0 -1px;
}
::v-deep .leaflet-draw-toolbar .leaflet-draw-draw-polygon {
  background-position: -31px -2px;
}
::v-deep .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-draw-polygon {
  background-position: -29px -1px;
}
::v-deep .leaflet-draw-toolbar .leaflet-draw-draw-rectangle {
  background-position: -62px -2px;
}
::v-deep .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-draw-rectangle {
  background-position: -60px -1px;
}
::v-deep .leaflet-draw-toolbar .leaflet-draw-draw-circle {
  background-position: -92px -2px;
}
::v-deep .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-draw-circle {
  background-position: -90px -1px;
}
::v-deep .leaflet-draw-toolbar .leaflet-draw-draw-marker {
  background-position: -122px -2px;
}
::v-deep .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-draw-marker {
  background-position: -120px -1px;
}
::v-deep .leaflet-draw-toolbar .leaflet-draw-draw-circlemarker {
  background-position: -273px -2px;
}
::v-deep .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-draw-circlemarker {
  background-position: -271px -1px;
}
::v-deep .leaflet-draw-toolbar .leaflet-draw-edit-edit {
  background-position: -152px -2px;
}
::v-deep .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-edit-edit {
  background-position: -150px -1px;
}
::v-deep .leaflet-draw-toolbar .leaflet-draw-edit-remove {
  background-position: -182px -2px;
}
::v-deep .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-edit-remove {
  background-position: -180px -1px;
}
::v-deep .leaflet-draw-toolbar .leaflet-draw-edit-edit.leaflet-disabled {
  background-position: -212px -2px;
}
::v-deep
  .leaflet-touch
  .leaflet-draw-toolbar
  .leaflet-draw-edit-edit.leaflet-disabled {
  background-position: -210px -1px;
}
::v-deep .leaflet-draw-toolbar .leaflet-draw-edit-remove.leaflet-disabled {
  background-position: -242px -2px;
}
::v-deep
  .leaflet-touch
  .leaflet-draw-toolbar
  .leaflet-draw-edit-remove.leaflet-disabled {
  background-position: -240px -2px;
}
::v-deep .leaflet-mouse-marker {
  background-color: #fff;
  cursor: crosshair;
}
::v-deep .leaflet-draw-tooltip {
  background: #363636;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid transparent;
  -webkit-border-radius: 4px;
  border-radius: 4px;
  color: #fff;
  font: 12px/18px 'Helvetica Neue', Arial, Helvetica, sans-serif;
  margin-left: 20px;
  margin-top: -21px;
  padding: 4px 8px;
  position: absolute;
  visibility: hidden;
  white-space: nowrap;
  z-index: 6;
}
::v-deep .leaflet-draw-tooltip:before {
  border-right: 6px solid black;
  border-right-color: rgba(0, 0, 0, 0.5);
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  content: '';
  position: absolute;
  top: 7px;
  left: -7px;
}
::v-deep .leaflet-error-draw-tooltip {
  background-color: #f2dede;
  border: 1px solid #e6b6bd;
  color: #b94a48;
}
::v-deep .leaflet-error-draw-tooltip:before {
  border-right-color: #e6b6bd;
}
::v-deep .leaflet-draw-tooltip-single {
  margin-top: -12px;
}
::v-deep .leaflet-draw-tooltip-subtext {
  color: #f8d5e4;
}
::v-deep .leaflet-draw-guide-dash {
  font-size: 1%;
  opacity: 0.6;
  position: absolute;
  width: 5px;
  height: 5px;
}
::v-deep .leaflet-edit-marker-selected {
  background-color: rgba(254, 87, 161, 0.1);
  border: 4px dashed rgba(254, 87, 161, 0.6);
  -webkit-border-radius: 4px;
  border-radius: 4px;
  box-sizing: content-box;
}
::v-deep .leaflet-edit-move {
  cursor: move;
}
::v-deep .leaflet-edit-resize {
  cursor: pointer;
}
::v-deep .leaflet-oldie .leaflet-draw-toolbar {
  border: 1px solid #999;
}
</style>
