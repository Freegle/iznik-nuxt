<template>
  <div>
    <client-only>
      <div class="maptools d-flex mb-1 justify-content-between">
        <div class="d-flex">
          <v-icon name="sync" :class="busy ? 'text-success fa-spin ml-4 mt-1' : 'text-faded ml-4 mt-1'" scale="2" />
        </div>
        <b-form-checkbox v-if="groups || groupid" v-model="cga" class="ml-2">
          <strong style="color: darkgreen">Show CGAs</strong>
        </b-form-checkbox>
        <b-form-checkbox v-if="groups || groupid" v-model="dpa" class="ml-2">
          <strong style="color: darkblue">Show DPAs</strong>
        </b-form-checkbox>
        <b-form-checkbox v-if="groupid" v-model="labels" class="ml-2 font-weight-bold">
          Labels
        </b-form-checkbox>
        <b-form-checkbox v-model="shade" class="ml-2 font-weight-bold">
          Shade areas
        </b-form-checkbox>
        <b-form-checkbox v-model="showDodgy" class="ml-2 font-weight-bold">
          Areas to Review
        </b-form-checkbox>
      </div>
      <b-modal id="mappingChanges" ref="mappingChanges" v-model="showMappingChanges">
        <p>
          If you have the "Areas to Review" checkbox ticked, you'll see the red dots for
          postcodes which might need better mapping.
        </p>
        <p class="font-weight-bold text-danger">
          The red dots indicate where mapping has changed recently.  You can review these to check if it looks OK.
        </p>
        <ul>
          <li>
            The occasional dot is OK.
            Clusters of dots in a single area are worth reviewing.
          </li>
          <li>
            The dots might highlight areas where the existing mapping is poor.  Typical problem are places where
            areas overlap, or where there are gaps between areas.
          </li>
          <li>
            Click on a postcode in this section to centre the map on it, then zoom in if you need to.
          </li>
        </ul>
        <p>
          You can fix these:
        </p>
        <ul>
          <li>
            You can adjust area boundaries.
          </li>
          <li>
            You can add new areas.
          </li>
          <li>
            You can delete areas.
          </li>
        </ul>
        <p class="font-weight-bold text-danger">
          The red dots don't get updated at the moment.  Soon.
        </p>
        <p>
          To help more widely, you can zoom the map out to view the whole UK.  Once you zoom out far enough you'll see the numbers of
          postcodes which need attention - you can click on those to zoom in.
        </p>
      </b-modal>
      <b-row class="m-0">
        <b-col ref="mapcont" cols="12" md="8" lg="9" class="p-0 w-100">
          <l-map
            ref="map"
            :zoom="zoom"
            :center="center"
            :style="'width: ' + mapWidth + 'px; height: ' + mapHeight + 'px'"
            :min-zoom="5"
            :max-zoom="17"
            :options="{ dragging: selectedWKT, touchZoom: true }"
            @update:bounds="boundsChanged"
            @update:zoom="boundsChanged"
            @ready="idle"
          >
            <l-tile-layer :url="osmtile" :attribution="attribution" />
            <l-control position="topright" />
            <div v-if="cga">
              <l-geojson
                v-for="(c, i) in CGAs"
                :key="'cga-' + i"
                :geojson="c.json"
                :options="cgaOptions"
                :z-index-offset="2"
                @click="selectCGA($event, c.group)"
              />
            </div>
            <div v-if="dpa">
              <l-geojson
                v-for="(d, i) in DPAs"
                :key="'dpa-' + i"
                :geojson="d.json"
                :options="dpaOptions"
                :z-index-offset="1"
                @click="selectDPA($event, d.group)"
              />
            </div>
            <div v-if="overlaps && showDodgy && !groupid">
              <l-geojson v-for="(d, i) in overlappingCGAs" :key="'cgaoverlap-' + i" :geojson="d" :options="cgaOverlapOptions" :z-index-offset="0" />
            </div>
            <div v-if="groupid">
              <l-feature-group>
                <div v-if="zoom >= 12">
                  <ModGroupMapLocation
                    v-for="l in locationsInBounds"
                    :key="'location-' + l.id"
                    :ref="'location-' + l.id"
                    :location="l"
                    :selected="selectedObj === l"
                    :shade="shade"
                    :labels="labels"
                    :map="map"
                    @click="selectLocation(l)"
                  />
                </div>
              </l-feature-group>
            </div>
            <div v-if="showDodgy && groupid">
              <ClusterMarker v-if="mapObject && zoom < 10" :markers="dodgyInBounds" :map="mapObject" />
              <l-feature-group v-else>
                <l-circle-marker
                  v-if="highlighted"
                  :key="'highlighted-' + highlighted.id"
                  :lat-lng="[ highlighted.lat, highlighted.lng ]"
                  :interactive="false"
                  :radius="10"
                  :options="{ color: 'blue'}"
                />
                <l-circle-marker
                  v-for="d in dodgyInBounds"
                  :key="d.id"
                  :lat-lng="d"
                  :radius="1"
                  :options="{ color: 'red' }"
                  @click="selected = d"
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
              <p class="text-danger font-weight-bold">
                Zoom/pan locked while area selected.  Use Cancel to free.
              </p>
              <div v-if="groupid">
                <b-input v-model="selectedName" placeholder="Enter area name" size="lg" class="mb-1" />
                <b-textarea v-model="selectedWKT" rows="4" />
              </div>
              <div v-else>
                <h5>{{ selectedName }}</h5>
                <b-textarea v-model="selectedWKT" rows="4" readonly />
              </div>
              <p v-if="intersects" class="text-danger">
                Crosses over itself - not valid
              </p>
            </b-card-body>
            <b-card-footer v-if="groupid" class="d-flex justify-content-between flex-wrap">
              <SpinButton
                variant="primary"
                name="save"
                label="Save"
                spinclass="text-white"
                :handler="saveArea"
                :disabled="!selectedName || !selectedWKT || intersects"
              />
              <SpinButton variant="white" name="times" label="Cancel" :handler="clearSelection" />
              <SpinButton v-if="selectedId" variant="danger" name="trash-alt" label="Delete" :handler="deleteArea" />
            </b-card-footer>
          </b-card>
          <NoticeMessage v-if="zoom <= 12" variant="danger" show class="mb-2">
            Please zoom in further to see locations.
          </NoticeMessage>
          <ModPostcodeTester />
          <ModConvertKML />
          <b-card v-if="dodgyInBounds.length" no-body style="max-height: 600px; overflow-y: scroll">
            <b-card-header class="bg-warning d-flex justify-content-between">
              Mapping Changes
              <b-btn variant="white" @click="showMappingChanges = true">
                Details
              </b-btn>
            </b-card-header>
            <b-card-body>
              <div v-if="dodgyInBounds.length < 200">
                <ModChangedMapping
                  v-for="d in dodgyInBounds"
                  :key="d.id"
                  :changed="d"
                  :highlighted="highlighted"
                  @click="highlightPostcode(d)"
                />
              </div>
              <p v-else>
                Too many changes to show; zoom in.
              </p>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </client-only>
  </div>
</template>
<script>
import map from '@/mixins/map.js'
import ModChangedMapping from '@/components/ModChangedMapping'
import ModPostcodeTester from '@/components/ModPostcodeTester'
import ModConvertKML from '@/components/ModConvertKML'
import turfpolygon from 'turf-polygon'
import turfintersect from 'turf-intersect'
import turfarea from 'turf-area'
import NoticeMessage from '@/components/NoticeMessage'
import SpinButton from './SpinButton'
import ModGroupMapLocation from './ModGroupMapLocation'
import ClusterMarker from '~/components/ClusterMarker'

let Wkt = null
let L = null

if (process.client) {
  Wkt = require('wicket')
  require('wicket/wicket-leaflet')
  L = require('leaflet')
  require('leaflet-draw')
  require('leaflet-control-geocoder')
  require('leaflet-control-geocoder/dist/Control.Geocoder.css')
}

// const GROUP_FILL_COLOUR = '#EEFFCC'
const AREA_FILL_COLOUR = 'darkgreen'
const OVERLAP_COLOUR = 'red'
const FILL_OPACITY = 0.6
const CGA_BOUNDARY_COLOUR = 'darkgreen'
const DPA_BOUNDARY_COLOUR = 'darkblue'
// const CENTRE_FILL_COLOUR = 'darkgreen'
// const CENTRE_BORDER_COLOUR = 'darkgrey'

export default {
  components: {
    NoticeMessage,
    ModChangedMapping,
    ModGroupMapLocation,
    ModPostcodeTester,
    ModConvertKML,
    SpinButton,
    ClusterMarker
  },
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
    },
    caretaker: {
      type: Boolean,
      required: false,
      default: false
    },
    overlaps: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      cgas: [],
      dpas: [],
      initialGroupZoomed: false,
      dpa: false,
      cga: true,
      shade: true,
      labels: true,
      showDodgy: false,
      selectedName: null,
      selectedWKT: null,
      selectedObj: null,
      selectedId: null,
      busy: false,
      intersects: false,
      mapObject: null,
      zoom: 12,
      lastLocationFetch: null,
      showMappingChanges: false,
      highlighted: null
    }
  },
  computed: {
    browser() {
      return process.client
    },
    mapHeight() {
      let height = 0

      if (process.client) {
        height = window.innerHeight - 150
      }

      return height
    },
    allgroups() {
      let groups = Object.values(this.$store.getters['group/list'])

      if (this.caretaker) {
        groups = groups.filter(g => g.mentored)
      }

      return groups
    },
    group() {
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
        if (g.onmap && g.polyofficial) {
          try {
            const wkt = new Wkt.Wkt()
            wkt.read(g.polyofficial)
            ret.push({
              json: wkt.toJson(),
              group: g
            })
          } catch (e) {
            console.error('Failed to read WKT', g)
          }
        }
      })

      return ret
    },
    DPAs() {
      const ret = []

      this.allgroups.forEach(g => {
        if (g.onmap && g.poly) {
          try {
            const wkt = new Wkt.Wkt()
            wkt.read(g.poly)
            ret.push({
              json: wkt.toJson(),
              group: g
            })
          } catch (e) {
            console.error('Failed to read WKT', g)
          }
        }
      })

      return ret
    },
    overlappingCGAs() {
      const ret = []

      for (let i = 0; i < this.CGAs.length; i++) {
        for (let j = i + 1; j < this.CGAs.length; j++) {
          try {
            const p1 = turfpolygon(this.CGAs[i].json.coordinates)
            const p2 = turfpolygon(this.CGAs[j].json.coordinates)
            const intersection = turfintersect(p1, p2)

            if (intersection) {
              if (turfarea(intersection) > 500) {
                console.log(
                  'Intersection',
                  i,
                  j,
                  intersection,
                  turfarea(intersection)
                )
                ret.push(intersection)

                // Don't return too many for the same polygon.
                break
              }
            }
          } catch (e) {
            console.log('Compare ', this.CGAs[i], this.CGAs[j])
            console.log('Check failed', e)
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
            location &&
            location.polygon &&
            this.bounds.contains([location.lat, location.lng])
          ) {
            const wkt = new Wkt.Wkt()
            try {
              wkt.read(location.polygon)
              location.json = wkt.toJson()
              ret.push(location)
            } catch (e) {
              console.log('WKT error', location, e)
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
    },
    cgaOverlapOptions() {
      return {
        fillColor: OVERLAP_COLOUR,
        fillOpacity: FILL_OPACITY,
        color: OVERLAP_COLOUR
      }
    },
    dodgy() {
      return Object.values(this.$store.getters['locations/dodgy'])
    },
    dodgyInBounds() {
      return this.dodgy.filter(
        d => this.bounds && this.bounds.contains([d.lat, d.lng])
      )
    }
  },
  watch: {
    async showDodgy(newVal) {
      this.busy = true
      const bounds = this.$refs.map.mapObject.getBounds()

      const data = {
        swlat: bounds.getSouthWest().lat,
        swlng: bounds.getSouthWest().lng,
        nelat: bounds.getNorthEast().lat,
        nelng: bounds.getNorthEast().lng
      }

      data.dodgy = newVal

      await this.$store.dispatch('locations/fetch', data)
      this.busy = false
    }
  },
  mounted() {
    // Add the draw toolbar as per https://github.com/vue-leaflet/Vue2Leaflet/issues/331
    this.waitForRef('map', () => {
      const themap = this.$refs.map.mapObject
      this.mapObject = themap

      if (this.groups) {
        this.zoom = 5
      } else {
        this.zoom = 13
      }

      // Last layer is drawn items.  Seems to be, anyway.  Need to use this so that we can turn on editing for
      // the locations we've already got, as well as any new ones we draw.
      let drawnItems = null

      themap.eachLayer(l => {
        drawnItems = l
      })

      if (drawnItems) {
        const drawControl = new L.Control.Draw({
          edit: {
            featureGroup: drawnItems,
            remove: false,
            edit: false,
            poly: {
              allowIntersection: false
            }
          },
          position: 'topright',
          draw: {
            polyline: false,
            polygon: {
              allowIntersection: false,
              showArea: true
            },
            rectangle: false,
            circle: false,
            marker: false,
            circlemarker: false
          }
        })

        themap.addControl(drawControl)

        themap.on(L.Draw.Event.CREATED, e => {
          // const type = e.layerType;
          const layer = e.layer
          layer.editing.enable()
          layer.addTo(drawnItems)

          const wkt = new Wkt.Wkt()
          wkt.fromObject(layer)
          this.selectedWKT = wkt.write()
        })

        themap.on(L.Draw.Event.DRAWVERTEX, this.shapeChanged)
        themap.on(L.Draw.Event.EDITVERTEX, this.shapeChanged)
      }
    })
  },
  methods: {
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
    selectCGA(e, g) {
      this.selectedObj = g
      this.selectedName = g.nameshort + ' CGA'
      this.selectedWKT = g.polyofficial

      if (this.supportOrAdmin) {
        e.sourceTarget.editing.enable()
      }
    },
    selectDPA(e, g) {
      this.selectedObj = g
      this.selectedName = g.nameshort + ' DPA'
      this.selectedWKT = g.poly

      if (this.supportOrAdmin) {
        e.sourceTarget.editing.enable()
      }
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
        this.intersects = e.poly.intersects()

        const wkt = new Wkt.Wkt()
        wkt.fromObject(e.poly)
        this.selectedWKT = wkt.write()
      }
    },
    async idle() {
      const self = this
      L.Control.geocoder({
        placeholder: 'Search for a place...',
        defaultMarkGeocode: false,
        geocoder: L.Control.Geocoder.photon({
          geocodingQueryParams: {
            bbox: '-7.57216793459, 49.959999905, 1.68153079591, 58.6350001085'
          },
          nameProperties: [
            'name',
            'street',
            'suburb',
            'hamlet',
            'town',
            'city'
          ],
          serviceUrl:
            process.env.GEOCODE || 'https://geocode.ilovefreegle.org/api'
        }),
        collapsed: this.locked
      })
        .on('markgeocode', function(e) {
          if (e && e.geocode && e.geocode.bbox) {
            // Empty out the query box so that the dropdown closes.
            this.setQuery('')

            // Move the map to the location we've found.
            self.$refs.map.mapObject.flyToBounds(e.geocode.bbox)
          }
        })
        .addTo(self.$refs.map.mapObject)

      if (this.groupid) {
        const group = this.$store.getters['group/get'](this.groupid)

        if (group) {
          let bounds

          if (!this.initialGroupZoomed) {
            // Zoom the map to fit the DPA/CGA of the group.  We need to do this before fetching the locations so that
            // we don't fetch them for the whole country.
            this.initialGroupZoomed = true
            const area = group.poly || group.polyofficial

            const wkt = new Wkt.Wkt()
            wkt.read(area)
            const mapobj = this.$refs.map.mapObject
            const obj = wkt.toObject(mapobj.defaults)
            bounds = obj.getBounds()
            this.$nextTick(() => {
              mapobj.fitBounds(bounds)
            })
          } else {
            // Get the locations in this area
            bounds = this.$refs.map.mapObject.getBounds()
          }

          this.busy = true

          const data = {
            swlat: bounds.getSouthWest().lat,
            swlng: bounds.getSouthWest().lng,
            nelat: bounds.getNorthEast().lat,
            nelng: bounds.getNorthEast().lng,
            dodgy: this.showDodgy,
            areas: this.zoom >= 12
          }

          await this.fetchLocations(data)

          this.busy = false
        }
      }
    },
    async boundsChanged() {
      if (this.$refs.map && this.$refs.map.mapObject) {
        this.bounds = this.$refs.map.mapObject.getBounds()
        this.zoom = this.$refs.map.mapObject.getZoom()
        this.busy = true

        await this.$nextTick()

        const data = {
          swlat: this.bounds.getSouthWest().lat,
          swlng: this.bounds.getSouthWest().lng,
          nelat: this.bounds.getNorthEast().lat,
          nelng: this.bounds.getNorthEast().lng,
          dodgy: this.showDodgy,
          areas: this.zoom >= 12
        }

        if (this.group) {
          await this.fetchLocations(data)
        }

        if (this.$refs.map && this.$refs.map.mapObject) {
          // Sometimes the map needs a kick to show correctly.
          this.$refs.map.mapObject.invalidateSize()
        }
      }

      this.busy = false
    },
    async saveArea() {
      this.busy = true

      if (!this.selectedId) {
        // This is a new area.
        await this.$store.dispatch('locations/add', {
          name: this.selectedName,
          polygon: this.selectedWKT,
          remap: false
        })
      } else {
        // This is an existing area
        await this.$store.dispatch('locations/update', {
          id: this.selectedId,
          name: this.selectedName,
          polygon: this.selectedWKT,
          remap: false
        })
      }

      this.clearSelection()
      this.lastLocationFetch = null
      this.boundsChanged()

      this.busy = false
    },
    async deleteArea() {
      this.busy = true

      await this.$store.dispatch('locations/delete', {
        id: this.selectedId,
        groupid: this.groupid,
        remap: false
      })

      this.clearSelection()
      this.lastLocationFetch = null
      this.busy = false
    },
    async fetchLocations(data) {
      const thisFetch = JSON.stringify(data)

      if (this.lastLocationFetch === thisFetch) {
        console.log('Already fetching, skip')
      } else {
        console.log('Fetch', thisFetch, this.lastLocationFetch)
        this.lastLocationFetch = thisFetch

        await this.$store.dispatch('locations/fetch', data)
      }
    },
    highlightPostcode(pc) {
      this.$refs.map.mapObject.flyTo([pc.lat, pc.lng])
      this.highlighted = pc
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
