<template>
  <b-container fluid>
    <b-row class="m-0">
      <b-col cols="0" lg="3" class="d-none d-lg-block p-0 pr-1" />
      <b-col cols="12" lg="6" class="p-0">
        <div>
          <h1 class="d-none d-sm-block">
            Freegling near {{ postcode }}
          </h1>
          <client-only>
            <PostMap v-if="initialBounds" :initial-bounds="initialBounds" :height-fraction="heightFraction" @messages="messagesChanged($event)" />
            <div v-else :style="mapHeight" />
          </client-only>
          <div v-if="filteredMessages && filteredMessages.length">
            <div v-for="message in filteredMessages" :key="'messagelist-' + message.id" class="p-0">
              <Message v-bind="message" />
            </div>
          </div>
          <client-only>
            <infinite-loading :identifier="infiniteId" force-use-infinite-wrapper="body" :distance="distance" @infinite="loadMore">
              <span slot="no-results" />
              <span slot="no-more" />
              <span slot="spinner">
                <b-img-lazy src="~/static/loader.gif" alt="Loading" />
              </span>
            </infinite-loading>
          </client-only>
        </div>
      </b-col>
      <b-col cols="0" lg="3" class="d-none d-lg-block p-0 pl-1" />
    </b-row>
  </b-container>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
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
  mixins: [loginOptional, buildHead],
  data: function() {
    return {
      heightFraction: 3,
      postcode: null,
      busy: false,
      infiniteId: +new Date(),
      distance: 1000,
      swlat: null,
      swlng: null,
      nelat: null,
      nelng: null,
      initialBounds: null,
      postThreshold: 50,
      messagesOnMap: [],
      fetching: [],
      fetched: []
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
    }
  },
  created() {
    console.log('Explore postcode created', this.$route.params)
    this.postcode = this.$route.params.postcode
  },
  async mounted() {
    // Ensure we have no cached messages for other searches/groups
    this.$store.dispatch('messages/clear')
    this.context = null

    if (this.postcode) {
      // Find the groups near this postcode.
      await this.$store.dispatch('locations/fetch', {
        typeahead: this.postcode,
        postcount: true,
        groupareas: true
      })

      const groups = []

      const list = Object.values(this.$store.getters['locations/list'])
      list.forEach(l => {
        this.swlat = this.swlat === null ? l.lat : Math.min(this.swlat, l.lat)
        this.swlng = this.swlng === null ? l.lng : Math.min(this.swlng, l.lng)
        this.nelat = this.nelat === null ? l.lat : Math.max(this.nelat, l.lat)
        this.nelng = this.nelng === null ? l.lng : Math.max(this.nelng, l.lng)

        l.groupsnear.forEach(g => {
          groups.push(g)
        })
      })

      // We want to find enough groups to have at least some posts.  Sort them by closeness first.
      groups.sort((a, b) => {
        return a.polydist - b.polydist
      })

      let posttotal = 0
      let i = 0

      do {
        posttotal += groups[i].postcount

        this.swlat =
          this.swlat === null
            ? groups[i].lat
            : Math.min(this.swlat, groups[i].lat)
        this.swlng =
          this.swlng === null
            ? groups[i].lng
            : Math.min(this.swlng, groups[i].lng)
        this.nelat =
          this.nelat === null
            ? groups[i].lat
            : Math.max(this.nelat, groups[i].lat)
        this.nelng =
          this.nelng === null
            ? groups[i].lng
            : Math.max(this.nelng, groups[i].lng)
        i++
      } while (posttotal < this.postThreshold && i < groups.length)

      if (
        this.swlat !== null &&
        this.swlng !== null &&
        this.nelat !== null &&
        this.nelng !== null
      ) {
        // Now we have a rough bounding box containing some interesting posts.  Get messages within it - just
        // the positions.
        const ret = await this.$api.message.fetchMessages({
          subaction: 'inbounds',
          swlat: this.swlat,
          swlng: this.swlng,
          nelat: this.nelat,
          nelng: this.nelng
        })

        if (ret.ret === 0 && ret.messages && ret.messages.length) {
          // Now find the bounding box containing them.
          const lats = []
          const lngs = []

          ret.messages.forEach(m => {
            lats.push(m.lat)
            lngs.push(m.lng)
          })

          const minlat = Math.min.apply(null, lats) - 0.01
          const maxlat = Math.max.apply(null, lats) + 0.01
          const minlng = Math.min.apply(null, lngs) - 0.01
          const maxlng = Math.max.apply(null, lngs) + 0.01

          // Good.  Now we have a bounding box containing interesting posts, as a starting position for the
          // post map.
          this.initialBounds = L.latLngBounds(
            L.latLng(minlat, minlng),
            L.latLng(maxlat, maxlng)
          )
        }
      }

      if (!this.initialBounds) {
        // Didn't find messages - just set it near the postcode for lack of anything beter.
        this.initialBounds = L.latLngBounds(
          L.latLng(this.swlat, this.swlng),
          L.latLng(this.nelat, this.nelng)
        )
      }
    }
  },
  methods: {
    loadMore: async function($state) {
      // We work out which messages that are currently on the map are not in our store, and fetch them serially
      // in descending date order.  This avoids flooding the server.
      this.busy = true

      const count = 0

      for (const m of this.sortedMessagesOnMap) {
        if (!this.fetched[m.id] && !this.fetching[m.id]) {
          const message = this.$store.getters['messages/get'](m.id)

          if (!message) {
            this.fetching[m.id] = true

            await this.$store.dispatch('messages/fetch', {
              id: m.id,
              summary: true
            })

            this.fetched[m.id] = true
            delete this.fetching[m.id]

            if (count > 5) {
              // Don't fetch too many at once.
              break
            }
          }
        }
      }

      if (count) {
        $state.loaded()
      } else {
        $state.complete()
      }

      this.busy = false
    },
    messagesChanged(messages) {
      // We might be zooming in.  In that case, all the messages which are currently on the map will have been on
      // the map before.  In that case there is no point in clearing the store and refetching.
      let subset = true
      messages.forEach(m => {
        if (
          !this.messagesOnMap.some(m2 => {
            return m.id === m2.id
          })
        ) {
          subset = false
        }
      })

      console.log('Subset', subset, messages, this.messagesOnMap)
      if (!subset) {
        this.$store.dispatch('messages/clear')
        this.fetched = []
        this.infiniteId++
      }

      this.messagesOnMap = messages
    }
  },
  head() {
    return this.buildHead(
      'Explore Freegle',
      "There are lots of lovely communities of freeglers across the UK. Shall we see what they're up to?",
      null
    )
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';
</style>
