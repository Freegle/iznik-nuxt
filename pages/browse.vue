<template>
  <b-container fluid>
    <h1 class="sr-only">
      Browse items
    </h1>
    <b-row class="m-0">
      <b-col cols="0" xl="3" class="d-none d-xl-block p-0 pr-1">
        <SidebarLeft v-if="showRest" :show-community-events="true" :show-bot-left="true" />
      </b-col>
      <b-col cols="12" xl="6" class="p-0">
        <MicroVolunteering />
        <div v-if="showRest">
          <CovidWarning />
          <ExpectedRepliesWarning v-if="me && me.expectedreplies" :count="me.expectedreplies" :chats="me.expectedchats" />
          <div class="bg-white d-block d-xl-none">
            <div class="d-flex justify-content-between flex-wrap">
              <b-btn to="/give" variant="primary" class="topbutton m-1">
                <v-icon name="gift" />&nbsp;Give
              </b-btn>
              <b-btn to="/find" variant="primary" class="topbutton m-1">
                <v-icon name="shopping-cart" />&nbsp;Ask
              </b-btn>
            </div>
          </div>
        </div>
        <AdaptiveMap
          v-if="initialBounds"
          :key="'map-' + bump"
          :initial-bounds="initialBounds"
          class="mt-2"
          force-messages
          group-info
          jobs
          :show-many="false"
          can-hide
        />
      </b-col>
      <b-col cols="0" xl="3" class="d-none d-xl-block p-0 pl-1">
        <sidebar-right v-if="showRest" show-volunteer-opportunities />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import leafletPip from '@mapbox/leaflet-pip'
import MicroVolunteering from '../components/MicroVolunteering'
import AdaptiveMap from '~/components/AdaptiveMap'
import loginRequired from '@/mixins/loginRequired.js'
import buildHead from '@/mixins/buildHead.js'
import map from '@/mixins/map.js'

const CovidWarning = () => import('~/components/CovidWarning')
const SidebarLeft = () => import('~/components/SidebarLeft')
const SidebarRight = () => import('~/components/SidebarRight')
const ExpectedRepliesWarning = () =>
  import('~/components/ExpectedRepliesWarning')

let Wkt = null
let L = null

if (process.browser) {
  Wkt = require('wicket')
  L = require('leaflet')
}

export default {
  components: {
    MicroVolunteering,
    AdaptiveMap,
    CovidWarning,
    SidebarLeft,
    SidebarRight,
    ExpectedRepliesWarning
  },
  mixins: [loginRequired, buildHead, map],
  data: function() {
    return {
      initialBounds: null,
      showRest: false,
      bump: 1
    }
  },
  watch: {
    me() {
      this.calculateInitialMapBounds()
      this.bump++
    }
  },
  mounted() {
    // We want this to be our next home page.
    try {
      localStorage.setItem('Iznik>lasthomepage', 'mygroups')
    } catch (e) {
      console.log('Save last route failed', e)
    }

    // Ensure we have no cached messages for other searches/groups
    this.$store.dispatch('messages/clear')

    this.calculateInitialMapBounds()

    // Also get all the groups.  This allows us to suggest other groups to join from within the map.  No rush
    // though, so delay it.
    setTimeout(() => {
      this.$store.dispatch('group/list', {
        grouptype: 'Freegle'
      })

      this.showRest = true
    }, 5000)
  },
  methods: {
    async calculateInitialMapBounds() {
      // Get our list of groups
      await this.$store.dispatch('auth/fetchUser', {
        components: ['me', 'groups']
      })

      // Find a bounding box which is completely full of the group that our own location is within,
      // if we can.
      let mylat = null
      let mylng = null

      let swlat = null
      let swlng = null
      let nelat = null
      let nelng = null

      const me = this.$store.getters['auth/user']

      if (me && (me.lat || me.lng)) {
        mylat = me.lat
        mylng = me.lng

        const groups = this.$store.getters['auth/groups']
        groups.forEach(g => {
          if (g.polygon) {
            try {
              const wkt = new Wkt.Wkt()
              wkt.read(g.polygon)
              // eslint-disable-next-line new-cap
              const geoJSON = new L.geoJSON(wkt.toJson())
              const inside = leafletPip.pointInLayer(
                new L.LatLng(mylat, mylng),
                geoJSON
              )

              if (inside.length && g.bbox) {
                swlat = (g.bbox.swlat + g.bbox.nelat) / 2
                swlng = g.bbox.swlng
                nelat = (g.bbox.swlat + g.bbox.nelat) / 2
                nelng = g.bbox.nelng
              }
            } catch (e) {
              console.log('WKT error', location, e)
            }
          }
        })
      }

      let bounds = null

      if (
        swlat !== null &&
        swlng !== null &&
        nelat !== null &&
        nelng !== null
      ) {
        bounds = [[swlat, swlng], [nelat, nelng]]
      } else if (me && me.settings && me.settings.mylocation) {
        // We're not a member of any groups, but at least we know where we are.  Centre there, and then let
        // the map zoom to somewhere sensible.
        bounds = [[mylat - 0.01, mylng - 0.01], [mylat + 0.01, mylng + 0.01]]
      } else {
        // We aren't a member of any groups and we don't know where we are.  This can happen, but it's rare.
        // Send them to the explore page to pick somewhere.
        this.$router.push('/explore')
      }

      if (bounds) {
        this.initialBounds = bounds
      }

      // Now find the bounds for the initial posts we display.  This needs to cover all the groups within a
      // reasonable distance of our home location.
      swlat = null
      swlng = null
      nelat = null
      nelng = null

      const groups = this.$store.getters['auth/groups']

      groups.forEach(group => {
        if (group.onmap && group.publish) {
          if (
            group.role === 'Member' ||
            (!group.mysettings || group.mysettings.active)
          ) {
            // For the purposes of the bounding box, we are interested in groups where we are a member or an active
            // mod.  This excludes groups where we are a backup mod, which may be further away and of less interest.
            const distAway =
              mylat !== null
                ? this.getDistance([group.lat, group.lng], [mylat, mylng])
                : 0

            if (distAway < 50000 && group.bbox) {
              swlat =
                swlat === null
                  ? group.bbox.swlat
                  : Math.min(swlat, group.bbox.swlat)
              swlng =
                swlng === null
                  ? group.bbox.swlng
                  : Math.min(swlng, group.bbox.swlng)
              nelat =
                nelat === null
                  ? group.bbox.nelat
                  : Math.max(nelat, group.bbox.nelat)
              nelng =
                nelng === null
                  ? group.bbox.nelng
                  : Math.max(nelng, group.bbox.nelng)
            }
          }
        }
      })

      if (
        swlat !== null &&
        swlng !== null &&
        nelat !== null &&
        nelng !== null
      ) {
        bounds = [[swlat, swlng], [nelat, nelng]]
      }
    }
  },
  head() {
    return this.buildHead('Browse', 'See OFFERs and WANTEDs')
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.selection__wrapper {
  background-color: $color-blue--x-light;
  border: 1px solid $color-blue-x-light2;
  border-radius: 3px;
}

.typeSelect {
  max-width: 33%;
}

.topbutton {
  width: 40%;
}
</style>
