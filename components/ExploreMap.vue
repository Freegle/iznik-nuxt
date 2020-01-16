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
          <gmap-autocomplete
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
          Or choose a region:
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
            @zoom_changed="zoomChanged"
            @bounds_changed="boundsChanged"
          >
            <div v-for="g in groupsInBounds" :key="'marker-' + g.id + '-' + zoom">
              <GroupMarker v-if="g.onmap" :group="g" :size="largeMarkers ? 'rich' : 'poor'" />
            </div>
          </GmapMap>
        </client-only>
      </b-col>
    </b-row>
    <b-row class="m-0">
      <b-col v-if="groupsInBounds.length" cols="12" lg="6" offset-lg="3" class="mt-4">
        <b-card header-bg-variant="success" header-text-variant="white" header="Here's a list of communities:">
          <b-card-body style="height: 500px; overflow-y: scroll" class="p-0">
            <p>This list will change as you zoom or move around the map.</p>
            <div v-for="g in groupsInList" :key="'groupsInBounds-' + g.id">
              <div class="media clickme">
                <div class="media-left">
                  <div class="media-object">
                    <b-img-lazy
                      thumbnail
                      :alt="'Profile picture for ' + g.namedisplay"
                      :src="g.profile ? g.profile : '/icon.png'"
                      class="mr-2 groupprofile"
                      @error.native="brokenImage"
                    />
                  </div>
                </div>
                <div class="media-body">
                  <b-btn variant="success" class="float-right mr-2" :to="'/explore/' + g.nameshort">
                    Explore
                  </b-btn>
                  <nuxt-link :to="'/explore/' + g.nameshort">
                    {{ g.namedisplay }}
                  </nuxt-link>
                  <div v-if="g.tagline">
                    {{ g.tagline }}
                  </div>
                  <br v-else>
                  <span class="text-muted">
                    <a :href="'mailto:' + g.nameshort + '-volunteers@ilovefreegle.org'">
                      <v-icon name="envelope" title="Contact volunteers" />
                    </a>
                  </span>
                </div>
              </div>
              <hr class="text-muted">
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
<style scoped>
.groupprofile {
  object-fit: cover;
  width: 100px;
  height: 100px;
}
</style>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import GroupMarker from '~/components/GroupMarker.vue'

export default {
  components: {
    InfiniteLoading,
    GroupMarker
  },
  props: {
    region: {
      type: String,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      zoom: 5,
      bounds: null,
      showList: 0,
      distance: 1000,
      gb: {
        componentRestrictions: {
          country: ['gb']
        }
      }
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
          ret.push(group)
        }
      } else if (this.bounds) {
        for (const ix in groups) {
          const group = groups[ix]

          if (
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
      }
    },
    brokenImage(event) {
      console.error('Broken profile image', event.target.src)
      event.target.src = '/static/defaultprofile.png'
    },
    loadMoreList($state) {
      // We use an infinite load for the list because it's a lot of DOM to add at initial page load.
      if (this.showList < this.groupsInBounds.length) {
        this.showList++
        $state.loaded()
      } else {
        $state.complete()
      }
    }
  }
}
</script>
