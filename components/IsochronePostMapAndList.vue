<template>
  <div>
    <h2 class="sr-only">
      Map of offers and wanteds
    </h2>
    <client-only>
      <IsochronePostMap
        v-if="initialBounds"
        :key="'postmap-' + bump"
        :initial-bounds="initialBounds"
        :height-fraction="heightFraction"
        :bounds.sync="bounds"
        :min-zoom="minZoom"
        :max-zoom="maxZoom"
        :post-zoom="10"
        :force-messages="forceMessages"
        :type="selectedType"
        :search="searchOn"
        :show-many="showMany"
        :groupid="selectedGroup"
        :region="region"
        :show-groups.sync="showGroups"
        :zoom.sync="zoom"
        :centre.sync="centre"
        :ready.sync="mapready"
        :loading.sync="loading"
        :can-hide="canHide"
        @searched="selectedGroup = null"
        @messages="messagesChanged($event)"
        @groups="groupsChanged($event)"
      />
      <div v-observe-visibility="mapVisibilityChanged" />
    </client-only>
    <div v-if="mapready" class="rest">
      <div v-if="closestGroups && closestGroups.length" class="mb-1 border p-2 bg-white">
        <h2 class="sr-only">
          Nearby commmunities
        </h2>
        <div class="d-flex flex-wrap justify-content-center">
          <div
            v-for="g in closestGroups"
            :key="'group-' + g.id"
          >
            <JoinWithConfirm
              :id="g.id"
              :name="g.namedisplay"
              size="md"
              variant="primary"
              class="m-1"
            />
          </div>
        </div>
      </div>
      <div v-if="showGroups" class="bg-white pt-3">
        <div v-if="showRegions">
          <div class="d-flex flex-wrap justify-content-center pb-4">
            <div v-for="r in regions" :key="r" class="p-0 mt-2 ml-2 mr-2">
              <b-btn variant="secondary" :to="'/explore/region/' + r">
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
        <p class="text-center mt-2 header--size5 text--medium-large-highlight community__text">
          <!-- eslint-disable-next-line -->
          Need help?  Go <nuxt-link to="/help">here</nuxt-link>.
        </p>
        <p v-if="showStartMessage" class="text-center mt-2 header--size5 text--medium-large-highlight community__text">
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
          <div>
            <label for="typeOptions" class="sr-only">Type of posts to view</label>
            <b-form-select id="typeOptions" v-model="selectedType" :options="typeOptions" class="shrink" />
          </div>
          <div v-if="!me" />
          <div v-if="!me" />
          <div />
          <div role="search" class="search">
            <b-input-group class="shrink mt-1 mt-sm-0">
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
        <div v-if="mapVisible && !postsVisible && messagesOnMap && messagesOnMap.length" class="d-flex justify-content-center mt-1 mb-1">
          <NoticeMessage variant="info">
            <v-icon name="angle-double-down" class="pulsate" />
            Scroll down to see <span v-if="searchOn">results for "<strong>{{ searchOn }}</strong>"</span><span v-else>the posts</span>.
            <v-icon name="angle-double-down" class="pulsate" />
          </NoticeMessage>
        </div>
        <GroupHeader v-if="group" :group="group" show-join />
        <JobsTopBar v-if="jobs" class="d-block d-lg-none" />

        <h2 class="sr-only">
          List of wanteds and offers
        </h2>
        <client-only>
          <div v-observe-visibility="messageVisibilityChanged" />
        </client-only>
        <div v-if="filteredMessages && filteredMessages.length">
          <div v-for="message in filteredMessages" :key="'messagelist-' + message.id" :ref="'messagewrapper-' + message.id" class="p-0">
            <Message
              :id="message.id"
              v-observe-visibility="messageVisible"
              record-view
              class="mb-2 mb-sm-3"
              @view="recordView(message.id)"
            />
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
import Vue from 'vue'
import VueObserveVisibility from 'vue-observe-visibility'
import InfiniteLoading from 'vue-infinite-loading'
import map from '@/mixins/map.js'
import { MAX_MAP_ZOOM } from '../utils/constants'
import JoinWithConfirm from '~/components/JoinWithConfirm'
const AdaptiveMapGroup = () => import('./AdaptiveMapGroup')
const ExternalLink = () => import('./ExternalLink')
const GroupSelect = () => import('./GroupSelect')
const NoticeMessage = () => import('./NoticeMessage')
const Message = () => import('~/components/Message.vue')
const IsochronePostMap = () => import('~/components/IsochronePostMap')
const allSettled = require('promise.allsettled')
const GroupHeader = () => import('~/components/GroupHeader.vue')
const JobsTopBar = () => import('~/components/JobsTopBar')

if (process.browser) {
  Vue.use(VueObserveVisibility)
}

export default {
  components: {
    JoinWithConfirm,
    NoticeMessage,
    GroupHeader,
    GroupSelect,
    ExternalLink,
    AdaptiveMapGroup,
    InfiniteLoading,
    Message,
    IsochronePostMap,
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
      default: 5
    },
    maxZoom: {
      type: Number,
      required: false,
      default: MAX_MAP_ZOOM
    },
    showMany: {
      type: Boolean,
      required: false,
      default: true
    },
    canHide: {
      type: Boolean,
      required: false,
      default: false
    },
    initialSearch: {
      type: String,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      // Map stuff
      heightFraction: 4,
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
      showGroups: true,
      mapready: process.server,
      mapVisible: true,
      messagesOnMap: [],
      bump: 1,

      // Infinite message scroll
      ensureMessageVisible: null,
      maxMessageVisible: null,
      postsVisible: true,
      busy: false,
      infiniteId: +new Date(),
      distance: 1000,
      messagesInOwnGroups: [],
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
      context: null,
      trackViews: false,
      trackedView: false
    }
  },
  computed: {
    group: function() {
      let ret = null

      if (this.selectedGroup) {
        ret = this.$store.getters['group/get'](this.selectedGroup)
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
    messagesForList() {
      let msgs = []

      msgs = this.sortedMessagesOnMap

      if (this.selectedGroup) {
        msgs = msgs.filter(m => m.groupid === this.selectedGroup)
      }

      return msgs
    },
    messagesForListIds() {
      // Remember that Vue2 doesn't support reactivity on Map() so we can't use that.
      return this.messagesForList.map(m => parseInt(m.id))
    },
    filteredMessages() {
      const ret = []
      const dups = []

      if (!this.search) {
        // We want to filter by:
        // - Possibly a message type
        // - Possibly a group id
        // - Don't show deleted posts.  Remember the map may lag a bit as it's only updated on cron, so we
        //   may be returned some.
        // - Do show completed posts - makes us look good.  But not too many.
        //
        // Filter out dups by subject (for crossposting).
        //
        // messagesForList is ordered (good) but long (bad).  So we iterate through the messages in the store
        // (likely not as many) and then sort.
        const messages = this.$store.getters['messages/getAll']

        messages.forEach(message => {
          const order = this.messagesForListIds.indexOf(parseInt(message.id))

          if (order >= 0) {
            const m = this.messagesForList[order]

            if (this.wantMessage(m)) {
              const key = message.fromuser + '|' + message.subject
              const already =
                key in dups && message.groups[0].groupid !== dups[key]

              if (!already && !message.deleted) {
                message.order = order

                // Pass whether the message has been freegled or promised, which is returned in the summary call.
                message.successful = !!m.successful
                message.promised = !!m.promised

                let addIt = true

                if (message.successful) {
                  if (this.myid === message.fromuser) {
                    // Always show your own messages.  We have at least one freegler for whom this is emotionally
                    // important.
                    addIt = true
                  } else if (this.selectedType !== 'All') {
                    // Don't show freegled posts if you're already filtering.
                    addIt = false
                  } else if (message.daysago > 7) {
                    addIt = false
                  } else {
                    const lastfour = ret.slice(-4)
                    let gotSuccessful = false

                    lastfour.forEach(m => {
                      gotSuccessful |= m.successful
                    })

                    if (gotSuccessful) {
                      addIt = false
                    }
                  }
                }

                if (addIt) {
                  dups[key] = message.groups[0].groupid
                  ret.push(message)
                }
              }
            }
          }
        })

        ret.sort((a, b) => {
          return a.order - b.order
        })
      } else {
        // We are searching.  We get the messages from the store.
        const messages = this.$store.getters['messages/getAll']
        messages.forEach(message => {
          if (message) {
            const key = message.fromuser + '|' + message.subject
            const already = key in dups

            // Pass whether the message has been freegled, which in this case is returned as the outcomes in the
            // message.
            let successful = false

            if (message.outcomes && message.outcomes.length) {
              for (const outcome of message.outcomes) {
                if (
                  outcome.outcome === 'Taken' ||
                  outcome.outcome === 'Received'
                ) {
                  successful = true
                }
              }
            }

            message.successful = successful

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
    closestGroups() {
      const ret = []

      if (this.centre) {
        const allGroups = this.$store.getters['group/list']

        for (const ix in allGroups) {
          const group = allGroups[ix]

          if (group) {
            // See if the group is showing in the map area.
            if (
              this.bounds.contains([group.lat, group.lng]) ||
              ((group.altlat || group.altlng) &&
                this.bounds.contains([group.altlat, group.altlng]))
            ) {
              // Are we already a member?
              const member = this.$store.getters['auth/member'](group.id)

              if (!member) {
                // Visible group?
                if (group.onmap && group.publish) {
                  // How far away?
                  group.distance = this.getDistance(
                    [this.centre.lat, this.centre.lng],
                    [group.lat, group.lng]
                  )

                  // Allowed to show?
                  if (
                    !group.showjoin ||
                    group.distance <= group.showjoin * 1609.34
                  ) {
                    ret.push(group)
                  } else if (group.altlat || group.altlng) {
                    // A few groups have two centres because they are large.
                    group.distance = this.getDistance(
                      [this.centre.lat, this.centre.lng],
                      [group.altlat, group.altlng]
                    )

                    if (group.distance <= group.showjoin * 1609.34) {
                      ret.push(group)
                    }
                  }
                }
              }
            }
          }
        }

        ret.sort((a, b) => {
          return a.distance - b.distance
        })
      }

      return ret.slice(0, 3)
    }
  },
  watch: {
    selectedGroup(newVal) {
      if (newVal) {
        this.$store.dispatch('group/fetch', {
          id: newVal
        })
      }
    },
    selectedType: function(newVal) {
      this.$store.dispatch('misc/set', {
        key: 'postType',
        value: newVal
      })

      this.infiniteId++
    },
    search(newval) {
      if (!newval) {
        // We've cleared the search box, so cancel the search and return the map to normal.
        this.searchOn = null
      }
    },
    filteredMessages(newval) {
      if (this.ensureMessageVisible) {
        console.log('Asked to scroll to', this.ensureMessageVisible)
        this.$nextTick(() => {
          console.log('Next tick')
          let ref = this.$refs['messagewrapper-' + this.ensureMessageVisible]

          if (ref) {
            // Dynamic refs returned as array.
            ref = Array.isArray(ref) ? ref[0] : ref

            console.log('Ref is', ref)
            if (ref) {
              console.log('Ref exists, scroll to it')
              ref.scrollIntoView(false)
              this.ensureMessageVisible = null
            }
          }
        })
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
    this.search = this.initialSearch
    this.searchOn = this.initialSearch
  },
  mounted() {
    // We might have a preference for which type of posts we view.
    const postType = this.$store.getters['misc/get']('postType')
    if (postType) {
      this.selectedType = postType
    }

    // We want to track views of messages for new members.
    if (this.me) {
      this.trackViews = true

      // eslint-disable-next-line no-undef
      try {
        window.__insp.push(['tagSession', { browsepage: 'newskool' }])
      } catch (e) {
        console.log('Failed to tag inspectlet')
      }
    }

    // We might have history which tells us to go back to a particular message. This is a common case on mobile -
    // you view a message, reply, then go back and expect to be where you were in the list.
    console.log('mounted, history', history.state)
    if (history && history.state && history.state.msgid) {
      this.ensureMessageVisible = parseInt(history.state.msgid)
      console.log('Go to message in list', this.ensureMessageVisible)
    }
  },
  methods: {
    loadMore: async function($state) {
      if (!this.busy) {
        this.busy = true

        try {
          // We work out which messages that are currently on the map are not in our store, and fetch them
          // in descending date order.  We limit to avoid flooding the server.
          let count = 0
          const promises = []
          const fetching = []

          for (const m of this.messagesForList) {
            // No point fetching if we don't want to show it.  If those criteria change the watch will clear the
            // store.
            if (this.wantMessage(m)) {
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
          console.log('Exception', e)
          $state.complete()
        }

        this.busy = false
      } else {
        console.log('Ignore scroll request')
      }
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
      }
    },
    groupsChanged(groupids) {
      this.groupids = groupids
    },
    async doSearch() {
      if (this.search) {
        if (this.busy) {
          // Try later.  Otherwise we might end up with messages in store not matching our search.
          setTimeout(this.doSearch, 100)
        } else if (this.searchOn !== this.search) {
          // Set some values which will cause the post map to search.
          this.messagesOnMap = []
          this.searchOn = this.search
          await this.$store.dispatch('messages/clear')
          this.infiniteId++
        }
      }
    },
    messageVisibilityChanged(visible) {
      this.postsVisible = visible
    },
    mapVisibilityChanged(visible) {
      this.mapVisible = visible
    },
    wantMessage(m) {
      return (
        (this.selectedType === 'All' || this.selectedType === m.type) &&
        (!this.selectedGroup ||
          parseInt(m.groupid) === parseInt(this.selectedGroup)) &&
        // Make the item filter also work to filter out the successful posts.
        (this.selectedType === 'All' || !m.successful)
      )
    },
    recordView() {
      if (this.trackViews && !this.trackedView) {
        this.trackedView = true

        this.$api.bandit.chosen({
          uid: 'messageview',
          variant: 'isochrone'
        })
      }
    },
    messageVisible(isVisible, entry) {
      if (isVisible && entry && entry.target.id) {
        const tid = entry.target.id
        const p = tid.indexOf('-')

        if (p !== -1) {
          const id = parseInt(tid.substring(p + 1))
          const ix = this.messagesForListIds.indexOf(id)

          if (id && (!this.maxMessageVisible || ix > this.maxMessageVisible)) {
            console.log('Max message visibiel', this.maxMessageVisible)
            this.maxMessageVisible = ix

            history.replaceState(
              {
                msgid: id
              },
              null
            )
          }
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

.postcode {
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 20000;
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

.dense {
  .btn {
    max-width: 300px;
    text-overflow: ellipsis;
  }
}
</style>
