<template>
  <b-container fluid>
    <h1 class="sr-only">
      Browse items
    </h1>
    <b-row class="m-0">
      <b-col cols="0" lg="3" class="p-0 pr-1">
        <Visible :at="['lg', 'xl']">
          <SidebarLeft v-if="showRest" :show-community-events="true" :show-bot-left="true" />
        </Visible>
      </b-col>
      <b-col cols="12" lg="6" class="p-0">
        <client-only>
          <MicroVolunteering />
        </client-only>
        <div v-if="showRest">
          <CovidWarning />
          <AppUpdateAvailable />
          <GlobalWarning />
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
          :initial-search="searchTerm"
          class="mt-2"
          force-messages
          group-info
          jobs
          :show-many="false"
          can-hide
        />
        <client-only>
          <AboutMeModal v-if="showAboutMe" ref="aboutMeModal" :review="reviewAboutMe" />
        </client-only>
      </b-col>
      <b-col cols="0" lg="3" class="p-0 pl-1">
        <Visible :at="['lg', 'xl']">
          <sidebar-right v-if="showRest" show-volunteer-opportunities show-job-opportunities />
        </Visible>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import loginRequired from '@/mixins/loginRequired.js'
import buildHead from '@/mixins/buildHead.js'
import map from '@/mixins/map.js'
import dayjs from 'dayjs'

import Visible from '../../components/Visible'
import AdaptiveMap from '~/components/AdaptiveMap'
import AboutMeModal from '~/components/AboutMeModal'

import AppUpdateAvailable from '~/components/AppUpdateAvailable.vue'
const GlobalWarning = () => import('~/components/GlobalWarning')
const SidebarLeft = () => import('~/components/SidebarLeft')
const SidebarRight = () => import('~/components/SidebarRight')
const ExpectedRepliesWarning = () =>
  import('~/components/ExpectedRepliesWarning')
const MicroVolunteering = () => import('~/components/MicroVolunteering.vue')

export default {
  components: {
    Visible,
    MicroVolunteering,
    AdaptiveMap,
    AppUpdateAvailable,
    GlobalWarning,
    SidebarLeft,
    SidebarRight,
    ExpectedRepliesWarning,
    AboutMeModal
  },
  mixins: [loginRequired, buildHead, map],
  data: function() {
    return {
      initialBounds: null,
      showRest: false,
      bump: 1,
      searchTerm: null,
      showAboutMe: false,
      reviewAboutMe: false
    }
  },
  watch: {
    me(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.calculateInitialMapBounds()
        this.bump++
      }
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

      if (this.me) {
        const lastask = this.$store.getters['misc/get']('lastaboutmeask')
        const now = new Date().getTime()

        if (!lastask || now - lastask > 90 * 24 * 60 * 60 * 1000) {
          // Not asked too recently.
          if (!this.me.aboutme || !this.me.aboutme.text) {
            // We have not yet provided one.
            const daysago = dayjs().diff(dayjs(this.me.added), 'days')

            if (daysago > 7) {
              // Nudge to ask people to to introduce themselves.
              this.showAboutMe = true
            }
          } else {
            const monthsago = dayjs().diff(
              dayjs(this.me.aboutme.timestamp),
              'months'
            )

            if (monthsago >= 6) {
              // Old.  Ask them to review it.
              this.showAboutMe = true
              this.reviewAboutMe = true
            }
          }
        }

        if (this.showAboutMe) {
          this.waitForRef('aboutMeModal', () => {
            this.$refs.aboutMeModal.show()
          })

          this.$store.dispatch('misc/set', {
            key: 'lastaboutmeask',
            value: now
          })
        }
      }
    }, 5000)
  },
  created() {
    this.searchTerm = this.$route.params.term
  },
  methods: {
    async calculateInitialMapBounds() {
      await this.fetchMe(['me', 'groups'])

      // Find a bounding box which is completely full of the group that our own location is within,
      // if we can.
      let mylat = null
      let mylng = null

      let swlat = null
      let swlng = null
      let nelat = null
      let nelng = null

      if (this.me && (this.me.lat || this.me.lng)) {
        mylat = this.me.lat
        mylng = this.me.lng

        this.myGroups.forEach(g => {
          if (
            g.bbox &&
            mylat >= g.bbox.swlat &&
            mylat <= g.bbox.nelat &&
            mylng >= g.bbox.swlng &&
            mylng <= g.bbox.nelng
          ) {
            swlat = (g.bbox.swlat + g.bbox.nelat) / 2
            swlng = g.bbox.swlng
            nelat = (g.bbox.swlat + g.bbox.nelat) / 2
            nelng = g.bbox.nelng
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
      } else if (this.me && mylat !== null && mylng !== null) {
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
