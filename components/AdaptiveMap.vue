<template>
  <div>
    <client-only>
      <div :style="mapHeight" class="position-relative mb-1">
        <div class="mapbox">
          <PostMap
            v-if="initialMapBounds"
            :initial-bounds="initialMapBounds"
            :height-fraction="heightFraction"
            @messages="messagesChanged($event)"
            @groups="groupsChanged($event)"
          />
          <div v-else :style="mapHeight" />
        </div>
      </div>
    </client-only>
    <div class="rest">
      <div v-if="closestGroups.length" class="d-flex flex-wrap mb-1 justify-content-between border p-2 bg-white">
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
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import map from '@/mixins/map.js'
const Message = () => import('~/components/Message.vue')
const PostMap = () => import('~/components/PostMap')

let L = null

if (process.browser) {
  L = require('leaflet')
}

export default {
  components: {
    InfiniteLoading,
    Message,
    PostMap
  },
  mixins: [map],
  props: {
    initialBounds: {
      type: Array,
      required: true
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
      messagesOnMap: [],
      fetching: [],
      fetched: [],
      groupids: [],
      initialMapBounds: null
    }
  },
  computed: {
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
      const ret = this.messages.filter(message => {
        return (
          this.messagesOnMap.find(m => {
            return m.id === message.id
          }) &&
          !message.deleted &&
          (!message.outcomes || message.outcomes.length === 0)
        )
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
    closestGroups() {
      const ret = []

      this.groupids.forEach(id => {
        const member =
          this.$store.getters['auth/user'] &&
          this.$store.getters['auth/member'](id)

        if (!member) {
          const group = this.$store.getters['group/get'](id)

          if (group) {
            group.distance = this.getDistance(
              [this.lat, this.lng],
              [group.lat, group.lng]
            )
            ret.push(group)
          }
        }
      })

      ret.sort((a, b) => {
        return a.distance - b.distance
      })

      return ret.slice(0, 3)
    }
  },
  async mounted() {
    this.swlat = this.initialBounds[0][0]
    this.swlng = this.initialBounds[0][1]
    this.nelat = this.initialBounds[1][0]
    this.nelng = this.initialBounds[1][1]

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

    this.initialMapBounds = L.latLngBounds(
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

      await Promise.all(promises)
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
    },
    centreChanged(centre) {
      this.lat = centre.lat
      this.lng = centre.lng
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.mapbox {
  width: 100%;
  position: absolute;
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
</style>
