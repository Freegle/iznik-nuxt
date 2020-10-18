<template>
  <div>
    <client-only>
      <h2 class="sr-only">
        Map of offers and wanteds
      </h2>
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
            :groupid="selectedGroup"
            :type="selectedType"
            :min-zoom="forceMessages ? 5 : minZoom"
            :max-zoom="maxZoom"
            @messages="messagesChanged($event)"
            @groups="groupsChanged($event)"
            @minzoom="showGroups = true && !forceMessages"
          />
        </div>
        <div v-else :style="mapHeight" />
      </div>
    </client-only>
    <div v-if="mapready" class="rest">
      <div v-if="showClosestGroups" class="d-none d-md-flex flex-wrap mb-1 justify-content-between border p-2 bg-white">
        <h2 class="sr-only">
          Nearby commmunities
        </h2>
        <b-btn
          v-for="g in closestGroups"
          :key="'group-' + g.id"
          size="md"
          :to="'/explore/join/' + g.id"
          variant="primary"
          class="mb-1"
        >
          Join {{ g.namedisplay }}
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
          <h2 class="sr-only">
            List of communities
          </h2>
          <AdaptiveMapGroup v-for="groupid in groupids" :id="groupid" :key="'adaptivegroup-' + groupid" />
        </div>
        <p v-if="showStartMessage" class="text-center mt-2 header--size5 community__heading community__text">
          <!-- eslint-disable-next-line -->
          If there's no community for your area, would you like to start one? <ExternalLink href="mailto:newgroups@ilovefreegle.org">Get in touch!</ExternalLink>
        </p>
      </div>
      <div v-else>
        <h2 v-if="group" class="sr-only">
          Community Information
        </h2>
        <GroupHeader v-if="group" :group="group" />
        <h2 class="sr-only">
          List of WANTEDs and OFFERs
        </h2>
        <div v-if="filters" variant="info" class="d-flex justify-content-between p-2 border border-info bg-white">
          <GroupSelect v-model="selectedGroup" all :all-my="false" />
          <b-form-select v-model="selectedType" :options="typeOptions" class="shrink" />
        </div>

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
import GroupSelect from './GroupSelect'
import map from '@/mixins/map.js'
const Message = () => import('~/components/Message.vue')
const PostMap = () => import('~/components/PostMap')
const GroupMap = () => import('~/components/GroupMap')
const allSettled = require('promise.allsettled')
const GroupHeader = () => import('~/components/GroupHeader.vue')

let L = null

if (process.browser) {
  L = require('leaflet')
}

export default {
  components: {
    GroupHeader,
    GroupSelect,
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
    forceMessages: {
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
    },
    showStartMessage: {
      type: Boolean,
      required: false,
      default: false
    },
    filters: {
      type: Boolean,
      required: false,
      default: false
    },
    groupInfo: {
      type: Boolean,
      required: false,
      default: false
    },
    minZoom: {
      type: Number,
      required: false,
      default: 10
    },
    maxZoom: {
      type: Number,
      required: false,
      default: 15
    }
  },
  data: function() {
    return {
      // Map stuff
      heightFraction: 3,
      postcode: null,
      busy: false,
      lat: null,
      lng: null,
      swlat: null,
      swlng: null,
      nelat: null,
      nelng: null,
      groupids: [],
      bounds: null,
      zoom: null,
      centre: null,
      showGroups: false,
      mapready: process.server,

      // Infinite message scroll
      infiniteId: +new Date(),
      distance: 1000,
      messagesOnMap: [],
      fetching: [],
      fetched: [],

      // Filters
      selectedType: 'All',
      selectedGroup: null,
      typeOptions: [
        {
          value: 'All',
          text: 'All posts',
          selected: true
        },
        {
          value: 'Offer',
          text: 'Just OFFERs'
        },
        {
          value: 'Wanted',
          text: 'Just WANTEDs'
        }
      ]
    }
  },
  computed: {
    group: function() {
      const ret = this.selectedGroup
        ? this.$store.getters['group/get'](this.selectedGroup)
        : null

      return ret
    },
    closed() {
      let ret = false

      if (this.group && this.group.settings && this.group.settings.closed) {
        ret = true
      }

      return ret
    },
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
    filteredMessages() {
      // We want to filter by:
      // - Messages on the map
      // - Don't deleted or completed posts.  Remember the map may lag a bit as it's only updated on cron, so we
      //   may be returned some.
      // - Possibly a message type - but that's handled by the map
      // - Possibly a group id - but that's handled by the map
      // - Filter out dups by subject (for crossposting).
      const ret = []
      const dups = []

      this.messagesOnMap.forEach(m => {
        const message = this.$store.getters['messages/get'](m.id)

        if (message) {
          const key = message.fromuser + '|' + message.subject
          const already = key in dups

          if (
            !already &&
            !message.deleted &&
            (!message.outcomes || message.outcomes.length === 0)
          ) {
            dups[key] = true
            ret.push(message)
          }
        }
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

    if (this.filters) {
      // We might have a preference for which type of posts we view.
      const postType = this.$store.getters['misc/get']('postType')
      if (postType) {
        this.selectedType = postType
      }
    }
  },
  methods: {
    typeChange: function() {
      this.$store.dispatch('misc/set', {
        key: 'postType',
        value: this.selectedType
      })
    },
    loadMore: async function($state) {
      // We work out which messages that are currently on the map are not in our store, and fetch them serially
      // in descending date order.  This avoids flooding the server.
      this.busy = true

      let count = 0
      const promises = []
      const fetching = []

      for (const m of this.messagesOnMap) {
        const message = this.$store.getters['messages/get'](m.id)

        if (!message && !this.fetching[m.id] && this.infiniteId) {
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
      let changed = false
      if (!messages || !this.messagesOnMap) {
        changed = true
      } else {
        const oldids = this.messagesOnMap.map(m => m.id)
        const newids = messages.map(m => m.id)

        if (JSON.stringify(oldids) !== JSON.stringify(newids)) {
          changed = true
        }
      }

      if (changed) {
        this.messagesOnMap = messages
        this.infiniteId++
        this.$store.dispatch('messages/clear')
      }
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

.shrink {
  width: unset;
}
</style>
