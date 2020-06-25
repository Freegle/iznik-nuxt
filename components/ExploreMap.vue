<template>
  <div>
    <b-row class="text-center m-0">
      <b-col cols="12" lg="6" offset-lg="3">
        <div v-if="region">
          <h1>Freegle communities in {{ region }}</h1>
        </div>
        <div v-else>
          <h1>Explore Freegle communities across the UK!</h1>
          <h5 v-if="groupCount">
            There are {{ groupCount }} lovely communities of freeglers across the UK. Shall we see what they're up to?
          </h5>
        </div>
      </b-col>
    </b-row>
    <b-row v-if="!region" class="m-0">
      <b-col cols="12" lg="2" offset-lg="5" class="text-center">
        <client-only>
          <!--          TODO MAP-->
          <gmap-autocomplete
            v-if="false"
            id="autocomplete"
            v-focus
            class="form-control"
            placeholder="Enter a location"
            :options="gb"
            :types="['(cities)']"
            @place_changed="getAddressData"
          />
        </client-only>
      </b-col>
    </b-row>
    <b-row v-if="!region && regions.length" class="m-0">
      <b-col cols="12" lg="6" offset-lg="3" class="mt-2">
        <h5 class="text-center">
          Choose a region:
        </h5>
        <b-list-group horizontal class="flex flex-wrap justify-content-center">
          <b-list-group-item v-for="r in regions" :key="r" class="p-0 mt-2 ml-2 mr-2">
            <b-btn variant="white" :to="'/explore/region/' + r">
              {{ r }}
            </b-btn>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
    <b-row class="m-0">
      <b-col ref="mapcont" cols="12" lg="6" offset-lg="3" class="mt-4">
        <client-only>
          <l-map
            ref="map"
            :zoom="5"
            :center="center"
            :style="'width: ' + mapWidth + '; height: ' + mapWidth + 'px'"
            @update:bounds="boundsChanged"
            @update:zoom="zoomChanged"
            @ready="idle"
          >
            <l-tile-layer :url="osmtile" :attribution="attribution" />
            <GroupMarker v-for="g in groupsInBounds" :key="'marker-' + g.id + '-' + zoom" :group="g" :size="largeMarkers ? 'rich' : 'poor'" />
          </l-map>
        </client-only>
      </b-col>
    </b-row>
    <b-row class="m-0">
      <b-col v-if="groupsInBounds.length" cols="12" lg="6" offset-lg="3" class="mt-4">
        <b-card header-bg-variant="success" header-text-variant="white" header="Here's a list of communities:">
          <b-card-body style="height: 500px; overflow-y: scroll" class="p-0">
            <p>This list will change as you zoom or move around the map.</p>
            <div v-for="g in groupsInList" :key="'groupsInBounds-' + g.id">
              <div v-if="g.onmap" class="media clickme">
                <div class="media-left">
                  <div class="media-object">
                    <group-ProfileImage :image="g.profile ? g.profile : '/icon.png'" :alt-text="'Profile picture for ' + g.namedisplay" class="mr-2" />
                  </div>
                </div>
                <div class="media-body">
                  <div v-if="g.external">
                    <ExternalLink :href="g.external">
                      <b-btn variant="primary" class="float-right mr-2">
                        Explore
                      </b-btn>
                      {{ g.namedisplay }}
                    </ExternalLink>
                  </div>
                  <div v-else>
                    <b-btn variant="primary" class="float-right mr-2" :to="'/explore/' + g.nameshort">
                      Explore
                    </b-btn>
                    <nuxt-link :to="'/explore/' + g.nameshort">
                      {{ g.namedisplay }}
                    </nuxt-link>
                  </div>
                  <div v-if="g.tagline">
                    {{ g.tagline }}
                  </div>
                  <br v-else>
                  <span v-if="!g.external" class="text-muted">
                    <a :href="'mailto:' + g.modsmail">
                      <v-icon name="envelope" title="Contact volunteers" />
                    </a>
                  </span>
                  <span v-else-if="g.contactmail">
                    <a :href="'mailto:' + g.contactmail">
                      <v-icon name="envelope" title="Contact volunteers" />
                    </a>
                  </span>
                </div>
              </div>
              <hr v-if="g.onmap" class="text-muted">
            </div>
            <client-only>
              <infinite-loading v-if="browser" :distance="distance" @infinite="loadMoreList">
                <span slot="no-results" />
                <span slot="no-more" />
                <span slot="spinner">
                  <b-img-lazy src="~/static/loader.gif" alt="Loading" />
                </span>
              </infinite-loading>
            </client-only>
          </b-card-body>
        </b-card>
        <h5 class="text-center mt-2">
          If there's no community for your area, would you like to start one? <a href="mailto:newgroups@ilovefreegle.org">Mail us!</a>
        </h5>
        <p class="text-center">
          You can also look at our <nuxt-link to="/livemap">
            live map
          </nuxt-link>.
        </p>
        <div style="height:80px" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import L from 'leaflet'
import InfiniteLoading from 'vue-infinite-loading'
import GroupMarker from '~/components/GroupMarker.vue'
import GroupProfileImage from '~/components/GroupProfileImage'
import map from '@/mixins/map.js'
const ExternalLink = () => import('~/components/ExternalLink')

export default {
  components: {
    InfiniteLoading,
    GroupMarker,
    GroupProfileImage,
    ExternalLink
  },
  mixins: [map],
  props: {
    region: {
      type: String,
      required: false,
      default: null
    },
    track: {
      type: Boolean,
      required: false,
      default: false
    },
    swlat: {
      type: Number,
      required: false,
      default: null
    },
    swlng: {
      type: Number,
      required: false,
      default: null
    },
    nelat: {
      type: Number,
      required: false,
      default: null
    },
    nelng: {
      type: Number,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      showList: 0,
      distance: 1000,
      // TODO MAPS
      gb: {
        componentRestrictions: {
          country: ['gb']
        }
      },
      initialBounds: false
    }
  },
  computed: {
    browser() {
      return process.browser
    },
    largeMarkers() {
      // Show small markers unless we are zoomed in to a small number of groups.
      return this.groupsInBounds.length < 20 && this.zoom > 10
    },
    groupCount() {
      return this.groups ? Object.keys(this.groups).length : 0
    },
    mapHeight() {
      const contWidth = this.$refs.mapcont ? this.$refs.mapcont.$el.width : 0
      return contWidth
    },
    mapWidth() {
      let height = 0

      if (process.browser) {
        height = Math.floor(window.innerHeight / 2)
        height = height < 200 ? 200 : height
      }

      return height
    },
    groups() {
      return this.$store.getters['group/list']
    },
    regions() {
      const regions = []

      try {
        for (const ix in this.groups) {
          const group = this.groups[ix]

          if (group.region && regions.indexOf(group.region) === -1) {
            regions.push(group.region)
          }
        }

        regions.sort()
      } catch (e) {
        console.error('Exception', e)
      }

      return regions
    },
    groupsInBounds() {
      const groups = this.groups
      const ret = []

      if (!process.browser) {
        // SSR - return all for SRO.
        for (const ix in groups) {
          const group = groups[ix]

          if (group.onmap) {
            ret.push(group)
          }
        }
      } else if (this.bounds) {
        for (const ix in groups) {
          const group = groups[ix]

          if (
            group.onmap &&
            group.lat >= this.bounds.sw.lat &&
            group.lng >= this.bounds.sw.lng &&
            group.lat <= this.bounds.ne.lat &&
            group.lng <= this.bounds.ne.lng &&
            (this.region === null || this.region === group.region)
          ) {
            ret.push(group)
          }
        }
      }

      const sorted = ret.sort((a, b) => {
        return a.namedisplay
          .toLowerCase()
          .localeCompare(b.namedisplay.toLowerCase())
      })

      return sorted
    },
    groupsInList() {
      if (process.browser) {
        // We have an infinite scroll - return as many as we're currently showing.
        return this.groupsInBounds.slice(0, this.showList)
      } else {
        // SSR - return all for SEO.
        return this.groupsInBounds
      }
    }
  },

  methods: {
    getAddressData: function(addressData, placeResultData, id) {
      if (
        addressData &&
        addressData.geometry &&
        addressData.geometry.location
      ) {
        this.$refs.gmap.$mapObject.setCenter(addressData.geometry.location)
        this.$refs.gmap.$mapObject.setZoom(11)
      }
    },
    setUrl: function() {
      if (this.track) {
        // We've been asked to update the URL as we move around the map.
        let url = this.$route.fullPath
        const p = url.indexOf('?')
        url = p !== -1 ? url.substring(0, p) : url
        const precis = 10000
        url =
          url +
          '?bounds=' +
          Math.round(this.bounds.sw.lat * precis) / precis +
          ',' +
          Math.round(this.bounds.sw.lng * precis) / precis +
          ',' +
          Math.round(this.bounds.ne.lat * precis) / precis +
          ',' +
          Math.round(this.bounds.ne.lng * precis) / precis
        this.$router.replace(url)
      }
    },
    loadMoreList($state) {
      // We use an infinite load for the list because it's a lot of DOM to add at initial page load.
      if (this.showList < this.groupsInBounds.length) {
        this.showList++
        $state.loaded()
      } else {
        $state.complete()
      }
    },
    idle(map) {
      // The focus and zoom on the map should only be set on its initial load.  The initialBounds property controls
      // that.
      this.boundsChanged()

      if (!this.initialBounds) {
        if (this.swlat || this.swlng) {
          // Specific bounds have been passed in so use them
          this.initialBounds = true
          map.fitBounds([[this.swlat, this.swlng], [this.nelat, this.nelng]])
          this.center = [
            (this.swlat + this.nelat) / 2,
            (this.swlng + this.nelng) / 2
          ]
        } else if (this.region && this.groupsInBounds) {
          // We are displaying a specific region so zoom to it
          this.initialBounds = true

          if (this.groupsInBounds) {
            const markers = []
            this.groupsInBounds.forEach(group => {
              if (group.onmap) {
                // eslint-disable-next-line new-cap
                markers.push(new L.marker([group.lat, group.lng]))
              }
            })

            // eslint-disable-next-line new-cap
            const fg = new L.featureGroup(markers)
            const bounds = fg.getBounds()

            if (bounds) {
              map.fitBounds(bounds)
              this.center = [
                (this.swlat + this.nelat) / 2,
                (this.swlng + this.nelng) / 2
              ]
            }
          }
        }
      }
    }
  }
}
</script>
