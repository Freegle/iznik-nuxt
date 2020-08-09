<template>
  <div>
    <b-row class="text-center m-0">
      <b-col cols="12" lg="6" offset-lg="3">
        <div v-if="region">
          <h1>Freegle communities in: {{ regionName }}</h1>
        </div>
        <div v-else>
          <h1>Explore Freegle communities across the UK!</h1>
          <p v-if="groupCount" class="community__heading">
            There are {{ groupCount }} lovely communities of freeglers across the UK. Shall we see what they're up to?
          </p>
        </div>
      </b-col>
    </b-row>
    <b-row v-if="!region" class="m-0">
      <b-col cols="12" lg="2" offset-lg="5" class="text-center">
        <client-only>
          <!--          TODO MAPS AUTOCOMPLETE -->
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
        <h2 class="text-center header--size5 community__text">
          Choose a region:
        </h2>
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
            :min-zoom="5"
            :max-zoom="13"
            @update:bounds="boundsChanged"
            @ready="idle"
          >
            <l-tile-layer :url="osmtile" :attribution="attribution" />
            <GroupMarker v-for="g in groupsInBounds" :key="'marker-' + g.id + '-' + zoom" :group="g" :size="largeMarkers ? 'rich' : 'poor'" />
          </l-map>
        </client-only>
      </b-col>
    </b-row>
    <h2 class="sr-only">
      List of communities
    </h2>
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
                    <ExternalLink :href="'mailto:' + g.modsmail">
                      <v-icon name="envelope" title="Contact volunteers" />
                    </ExternalLink>
                  </span>
                  <span v-else-if="g.contactmail">
                    <ExternalLink :href="'mailto:' + g.contactmail">
                      <v-icon name="envelope" title="Contact volunteers" />
                    </ExternalLink>
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
        <p class="text-center mt-2 header--size5 community__heading community__text">
          If there's no community for your area, would you like to start one? <ExternalLink href="mailto:newgroups@ilovefreegle.org">
            Mail us!
          </ExternalLink>
        </p>
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
import GroupProfileImage from '~/components/GroupProfileImage'
import map from '@/mixins/map.js'
const ExternalLink = () => import('~/components/ExternalLink')
const GroupMarker = () => import('@/components/GroupMarker')
const InfiniteLoading = () => import('vue-infinite-loading')

let L = null

if (process.browser) {
  L = require('leaflet')
}

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
      // TODO MAPS AUTOCOMPLETE
      gb: {
        componentRestrictions: {
          country: ['gb']
        }
      },
      initialBounds: false
    }
  },
  computed: {
    regionName() {
      let ret = null

      if (this.region) {
        ret = this.region.charAt(0).toUpperCase() + this.region.substring(1)
      }

      return ret
    },
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
            this.bounds.contains([group.lat, group.lng]) &&
            (this.region === null ||
              this.region.toLowerCase() === group.region.toLowerCase())
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
          Math.round(this.bounds.getSouthWest().lat * precis) / precis +
          ',' +
          Math.round(this.bounds.getSouthWest().lng * precis) / precis +
          ',' +
          Math.round(this.bounds.getNorthEast().lat * precis) / precis +
          ',' +
          Math.round(this.bounds.getNorthEast().lng * precis) / precis
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

            if (markers.length) {
              // eslint-disable-next-line new-cap
              const fg = new L.featureGroup(markers)
              const bounds = fg.getBounds()

              if (bounds) {
                map.fitBounds(bounds)
              }
            }
          }
        }
      }
    }
  }
}
</script>

<style>
.community__heading {
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.2;
}

.community__text {
  /* Need to override the h2 as it has higher specificity */
  color: #212529 !important;
}
</style>
