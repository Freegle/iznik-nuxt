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
            :loading.sync="loading"
            :groupid="selectedGroup"
            :type="selectedType"
            :search="searchOn"
            :min-zoom="forceMessages ? 9 : minZoom"
            :max-zoom="maxZoom"
            :show-many="showMany"
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
        <h2 class="sr-only">
          Search Filters
        </h2>
        <div variant="info" class="p-2 border border-info bg-white filters">
          <GroupSelect
            v-if="me"
            v-model="selectedGroup"
            label="Communities to view"
            label-sr-only
            all
            :all-my="false"
          />
          <div v-if="me" />
          <label for="typeOptions" class="sr-only">Type of posts to view</label>
          <b-form-select id="typeOptions" v-model="selectedType" :options="typeOptions" class="shrink" />
          <div v-if="!me" />
          <div v-if="!me" />
          <div />
          <div role="search">
            <b-input-group class="shrink mt-1 mt-sm-0 search">
              <b-input
                v-model="search"
                type="text"
                placeholder="Search posts"
                autocomplete="off"
                @keyup.enter.exact="doSearch"
              />
              <b-input-group-append>
                <b-btn variant="secondary" title="Search" @click="doSearch">
                  <v-icon name="search" />
                </b-btn>
              </b-input-group-append>
            </b-input-group>
          </div>
        </div>
        <GroupHeader v-if="group" :group="group" />
        <JobsTopBar v-if="jobs" />

        <h2 class="sr-only">
          List of WANTEDs and OFFERs
        </h2>
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
          <NoticeMessage v-if="!busy && !loading && searchOn && !filteredMessages.length">
            <p>
              Sorry, we didn't find anything.  Things come and go quickly, though, so you could try later.  Or you could:
            </p>
            <div class="d-flex justify-content-start flex-wrap">
              <b-btn to="/give" variant="primary" class="topbutton m-1">
                <v-icon name="gift" />&nbsp;Post an OFFER
              </b-btn>
              <b-btn to="/find" variant="primary" class="topbutton m-1">
                <v-icon name="shopping-cart" />&nbsp;Post a WANTED
              </b-btn>
            </div>
          </NoticeMessage>
        </client-only>
      </div>
    </div>
  </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import map from '@/mixins/map.js'
const AdaptiveMapGroup = () => import('./AdaptiveMapGroup')
const ExternalLink = () => import('./ExternalLink')
const GroupSelect = () => import('./GroupSelect')
const NoticeMessage = () => import('./NoticeMessage')
const Message = () => import('~/components/Message.vue')
const PostMap = () => import('~/components/PostMap')
const GroupMap = () => import('~/components/GroupMap')
const allSettled = require('promise.allsettled')
const GroupHeader = () => import('~/components/GroupHeader.vue')
const JobsTopBar = () => import('~/components/JobsTopBar')

let L = null

if (process.browser) {
  L = require('leaflet')
}

export default {
  components: {
    NoticeMessage,
    GroupHeader,
    GroupSelect,
    ExternalLink,
    AdaptiveMapGroup,
    GroupMap,
    InfiniteLoading,
    Message,
    PostMap,
    JobsTopBar
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
    filterGroup: {
      type: Boolean,
      required: false,
      default: false
    },
    groupInfo: {
      type: Boolean,
      required: false,
      default: false
    },
    jobs: {
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
    },
    showMany: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data: function() {
    return {
      // Map stuff
      heightFraction: 3,
      postcode: null,
      loading: false,
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
      busy: false,
      infiniteId: +new Date(),
      distance: 1000,
      messagesOnMap: [],
      fetching: [],
      fetched: [],

      // Filters
      selectedType: 'All',
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
      ],
      selectedGroup: null,
      search: null,
      searchOn: null,
      context: null
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
      const ret = []
      const dups = []

      if (!this.search) {
        // We want to filter by:
        // - Messages on the map
        // - Don't deleted or completed posts.  Remember the map may lag a bit as it's only updated on cron, so we
        //   may be returned some.
        // - Possibly a message type - but that's handled by the map
        // - Possibly a group id - but that's handled by the map
        // - Filter out dups by subject (for crossposting).
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
      } else {
        // We are searching.  We get the messages from the store.
        const messages = this.$store.getters['messages/getAll']
        messages.forEach(message => {
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
      }

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
  watch: {
    search(newval) {
      if (!newval) {
        // We've cleared the search box, so cancel the search and return the map to normal.
        this.searchOn = null
      }
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

    // We might have a preference for which type of posts we view.
    const postType = this.$store.getters['misc/get']('postType')
    if (postType) {
      this.selectedType = postType
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
      this.busy = true

      try {
        // We work out which messages that are currently on the map are not in our store, and fetch them
        // in descending date order.  We limit to avoid flooding the server.
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
                summary: true,
                matchedon: m.matchedon ? m.matchedon : null
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
      } catch (e) {
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

      this.$emit('messages')
    },
    groupsChanged(groupids) {
      this.groupids = groupids
    },
    async doSearch() {
      if (this.search) {
        if (this.busy) {
          // Try later.  Otherwise we might end up with messages in store not matching our search.
          setTimeout(this.doSearch, 100)
        } else {
          this.searchOn = this.search
          await this.$store.dispatch('messages/clear')
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

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

.filters {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 2fr;
  grid-template-rows: 1fr 0px;

  @include media-breakpoint-down(sm) {
    grid-template-columns: 2fr 10px 1fr 0px;
    grid-template-rows: 1fr 1fr;
  }

  .search {
    @include media-breakpoint-down(sm) {
      grid-row: 2 / 3;
      grid-column: 1 / 6;
    }
  }
}
</style>
