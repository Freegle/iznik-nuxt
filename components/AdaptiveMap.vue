<template>
  <div>
    <client-only>
      <div :style="mapHeight" class="position-relative mb-1">
        <div v-if="bounds" class="mapbox">
          <GroupMap
            v-if="showGroups"
            :initial-bounds="bounds"
            :height-fraction="heightFraction"
            :bounds.sync="bounds"
            :zoom.sync="zoom"
            :centre.sync="centre"
            :ready.sync="mapready"
            :region="region"
            @groups="groupsChanged($event)"
            @maxzoom="showGroups = false"
          />
          <PostMap
            v-else
            :initial-bounds="bounds"
            :height-fraction="heightFraction"
            :bounds.sync="bounds"
            :zoom.sync="zoom"
            :centre.sync="centre"
            :ready.sync="mapready"
            @messages="messagesChanged($event)"
            @groups="groupsChanged($event)"
            @minzoom="showGroups = true"
          />
        </div>
        <div v-else :style="mapHeight" />
      </div>
    </client-only>
    <div v-if="mapready" class="rest">
      <div v-if="showClosestGroups" class="d-flex flex-wrap mb-1 justify-content-between border p-2 bg-white">
        <b-btn
          v-for="group in closestGroups"
          :key="'group-' + group.id"
          size="md"
          :to="'/explore/join/' + group.id"
          variant="primary"
          class="mb-1"
        >
          Join {{ group.namedisplay }}
        </b-btn>
      </div>
      <div v-if="showGroups" class="bg-white pt-3">
        <div v-if="showRegions">
          <div class="d-flex flex-wrap justify-content-center pb-4">
            <div v-for="r in regions" :key="r" class="p-0 mt-2 ml-2 mr-2">
              <b-btn variant="white" :to="'/explore/region/' + r">
                {{ r }}
              </b-btn>
            </div>
          </div>
        </div>
        <div v-if="showGroupList">
          <AdaptiveMapGroup v-for="groupid in groupids" :id="groupid" :key="'adaptivegroup-' + groupid" />
        </div>
        <p class="text-center mt-2 header--size5 community__heading community__text">
          <!-- eslint-disable-next-line -->
          If there's no community for your area, would you like to start one? <ExternalLink href="mailto:newgroups@ilovefreegle.org">Get in touch!</ExternalLink>
        </p>
      </div>
      <div v-else>
        <div v-if="filteredMessages && filteredMessages.length">
          <div v-for="message in filteredMessages" :key="'messagelist-' + message.id" class="p-0">
            <Message v-bind="message" />
          </div>
        </div>
        <client-only>
          <infinite-loading
            v-if="initialBounds"
            :identifier="infiniteId"
            force-use-infinite-wrapper="body"
            :distance="distance"
            @infinite="loadMore"
          >
            <span slot="no-results" />
            <span slot="no-more" />
            <span slot="spinner">
              <b-img-lazy src="~/static/loader.gif" alt="Loading" />
            </span>
          </infinite-loading>
        </client-only>
      </div>
    </div>
  </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import AdaptiveMapGroup from './AdaptiveMapGroup'
import ExternalLink from './ExternalLink'
import map from '@/mixins/map.js'
const Message = () => import('~/components/Message.vue')
const PostMap = () => import('~/components/PostMap')
const GroupMap = () => import('~/components/GroupMap')
const allSettled = require('promise.allsettled')

let L = null

if (process.browser) {
  L = require('leaflet')
}

export default {
  components: {
    ExternalLink,
    AdaptiveMapGroup,
    GroupMap,
    InfiniteLoading,
    Message,
    PostMap
  },
  mixins: [map],
  props: {
    initialBounds: {
      type: Array,
      required: true
    },
    startOnGroups: {
      type: Boolean,
      required: false,
      default: false
    },
    initialGroupIds: {
      type: Array,
      required: false,
      default: function() {
        return []
      }
    },
    region: {
      type: String,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      heightFraction: 3,
      postcode: null,
      busy: false,
      infiniteId: +new Date(),
      distance: 1000,
      lat: null,
      lng: null,
      swlat: null,
      swlng: null,
      nelat: null,
      nelng: null,
      postThreshold: 50,
      groupids: [],
      messagesOnMap: [],
      fetching: [],
      fetched: [],
      bounds: null,
      zoom: null,
      centre: null,
      showGroups: false,
      mapready: process.server
    }
  },
  computed: {
    regions() {
      const regions = []

      try {
        const allGroups = this.$store.getters['group/list']

        for (const ix in allGroups) {
          const group = allGroups[ix]

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
    messageCount: function() {
      const count = this.messages ? this.messages.length : 0
      return count
    },
    messages: function() {
      const ret = this.$store.getters['messages/getAll']
      return ret
    },
    filteredMessages() {
      // Ensure we only show the messages on the map, and double-check to avoid showing deleted or completed posts.
      // Remember the map may lag a bit as it's only updated on cron.
      const dups = []

      const ret = this.messages.filter(message => {
        const key = message.fromuser + '|' + message.subject
        const already = key in dups
        let include = false

        if (!already) {
          dups[key] = true

          include =
            this.messagesOnMap.find(m => {
              return parseInt(m.id) === parseInt(message.id)
            }) &&
            !message.deleted &&
            (!message.outcomes || message.outcomes.length === 0)
        }

        return include
      })

      return ret
    },
    mapHeight() {
      let height = 0

      if (process.browser) {
        height = window.innerHeight / this.heightFraction - 70
        height = height < 200 ? 200 : height
      }

      return 'min-height: ' + height + 'px'
    },
    sortedMessagesOnMap() {
      return this.messagesOnMap.slice().sort((a, b) => {
        return new Date(b.arrival).getTime() - new Date(a.arrival).getTime()
      })
    },
    showRegions() {
      // We want to show the regions if we're zoomed out, or for SSR = SEO.
      return process.server || this.zoom < 7
    },
    showGroupList() {
      // We want to show the list of groups for SSR = SEO, or if we are not showing the regions (because we're
      // zoomed out)
      return process.server || !this.showRegions
    },
    showClosestGroups() {
      // We only want to show the closest groups to join if there aren't too many.  Otherwise they're probably
      // zoomed way out and would join the wrong ones.
      return (
        this.groupids && this.groupids.length < 20 && this.closestGroups.length
      )
    },
    closestGroups() {
      const ret = []

      if (this.centre) {
        this.groupids.forEach(id => {
          const member =
            this.$store.getters['auth/user'] &&
            this.$store.getters['auth/member'](id)

          if (!member) {
            const group = this.$store.getters['group/get'](id)

            if (group) {
              group.distance = this.getDistance(
                [this.centre.lat, this.centre.lng],
                [group.lat, group.lng]
              )
              ret.push(group)
            }
          }
        })

        ret.sort((a, b) => {
          return a.distance - b.distance
        })
      }

      return ret.slice(0, 3)
    }
  },
  created() {
    this.showGroups = this.startOnGroups
    this.groupids = this.initialGroupIds
    this.swlat = this.initialBounds[0][0]
    this.swlng = this.initialBounds[0][1]
    this.nelat = this.initialBounds[1][0]
    this.nelng = this.initialBounds[1][1]
  },
  async mounted() {
    if (!this.startOnGroups) {
      // Ensure we have no cached messages for other searches/groups
      this.$store.dispatch('messages/clear')
      this.context = null

      // We have been given a bounding box containing some interesting posts.  Get messages within it - just
      // the positions.
      await this.$api.message.fetchMessages({
        subaction: 'inbounds',
        swlat: this.swlat,
        swlng: this.swlng,
        nelat: this.nelat,
        nelng: this.nelng
      })
    }

    this.bounds = L.latLngBounds(
      L.latLng(this.swlat, this.swlng),
      L.latLng(this.nelat, this.nelng)
    )
  },
  methods: {
    loadMore: async function($state) {
      // We work out which messages that are currently on the map are not in our store, and fetch them serially
      // in descending date order.  This avoids flooding the server.
      this.busy = true

      let count = 0
      const promises = []
      const fetching = []

      for (const m of this.sortedMessagesOnMap) {
        const message = this.$store.getters['messages/get'](m.id)

        if (!message && !this.fetching[m.id]) {
          this.fetching[m.id] = true
          fetching.push(m.id)

          promises.push(
            this.$store.dispatch('messages/fetch', {
              id: m.id,
              summary: true
            })
          )

          count++

          if (count >= 5) {
            // Don't fetch too many at once.
            break
          }
        }
      }

      // Use all-settled as some might fail.
      await allSettled(promises)

      fetching.forEach(id => {
        this.fetched[id] = true
        delete this.fetching[id]
      })

      if (count) {
        $state.loaded()
      } else {
        $state.complete()
      }

      this.busy = false
    },
    messagesChanged(messages) {
      this.infiniteId++
      this.messagesOnMap = messages
    },
    groupsChanged(groupids) {
      this.groupids = groupids
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.mapbox {
  width: 100%;
  top: 0px;
  left: 0;
  border: 1px solid $color-gray--light;
}

.postcode {
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 20000;
}

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
