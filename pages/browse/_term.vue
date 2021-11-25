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
        <div v-if="initialBounds">
          <IsochronePostMapAndList
            v-if="browseView === 'nearby'"
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
          <div v-else-if="browseView === 'mygroups'" class="bg-white">
            <div class="small d-flex justify-content-end">
              <div>
                <!-- eslint-disable-next-line-->
                Show posts from <b-btn variant="link" class="mb-1 p-0" size="sm" @click="showPostsFromNearby">nearby instead</b-btn>.
              </div>
            </div>
            <AdaptiveMap
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
          </div>
        </div>
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

import isochroneMixin from '@/mixins/isochrone'
import Visible from '../../components/Visible'
import IsochronePostMapAndList from '~/components/IsochronePostMapAndList'
import AboutMeModal from '~/components/AboutMeModal'
import AdaptiveMap from '~/components/AdaptiveMap'

const GlobalWarning = () => import('~/components/GlobalWarning')
const SidebarLeft = () => import('~/components/SidebarLeft')
const SidebarRight = () => import('~/components/SidebarRight')
const ExpectedRepliesWarning = () =>
  import('~/components/ExpectedRepliesWarning')
const MicroVolunteering = () => import('~/components/MicroVolunteering.vue')

export default {
  components: {
    AdaptiveMap,
    Visible,
    MicroVolunteering,
    IsochronePostMapAndList,
    GlobalWarning,
    SidebarLeft,
    SidebarRight,
    ExpectedRepliesWarning,
    AboutMeModal
  },
  mixins: [loginRequired, buildHead, map, isochroneMixin],
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
  computed: {
    browseView() {
      return this.me && this.me.settings && this.me.settings.browseView
        ? this.me.settings.browseView
        : 'nearby'
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
  async mounted() {
    // We want this to be our next home page.
    try {
      localStorage.setItem('Iznik>lasthomepage', 'mygroups')
    } catch (e) {
      console.log('Save last route failed', e)
    }

    // Ensure we have no cached messages for other searches/groups
    this.$store.dispatch('messages/clear')

    this.calculateInitialMapBounds()
    console.log('Initial bounds', this.initialBounds)

    // TODO Remove after experiment.
    // We are running an experiment to measure whether the isochrone view is more or less effective than the old
    // group view.  We do this on new users, because existing users will have established preferences.
    //
    // See also code in IsochronePostMapAndList.
    if (this.me) {
      const now = dayjs()
      const daysago = now.diff(dayjs(this.me.added), 'days')

      if ((daysago < 14 && !this.me.settings) || !this.me.settings.browseView) {
        // We don't yet have a preference.  Assign half to the old and half to the new.  Store what we choose so
        // that we can see who changes it.
        const settings = this.me.settings
        const view = Math.random() < 0.5 ? 'mygroups' : 'nearby'
        settings.browseView = view
        settings.browseViewInitial = view

        await this.$store.dispatch('auth/saveAndGet', {
          settings: settings
        })
      }
    }

    // Also get all the groups.  This allows us to suggest other groups to join from within the map.  No rush
    // though, so delay it.
    setTimeout(async () => {
      this.$store.dispatch('group/list', {
        grouptype: 'Freegle'
      })

      this.showRest = true

      if (this.me) {
        const lastask = this.$store.getters['misc/get']('lastaboutmeask')
        const now = new Date().getTime()

        if (!lastask || now - lastask > 90 * 24 * 60 * 60 * 1000) {
          // Not asked too recently.
          await this.fetchMe(['me', 'aboutme'])

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

      // The initial bounds for the map are determined from the isochrones if possible.
      await this.$store.dispatch('isochrones/fetch')
      this.initialBounds = this.isochroneBoundsArray

      if (!this.initialBounds) {
        // We don't know where we are yet.
        const groups = this.$store.getters['auth/groups']

        if (!groups.length) {
          // Don't even know any groups - encourage them to join.
          this.$router.push('/explore')
        } else {
          // Generate bounds based on the groups we're in.
          // eslint-disable-next-line new-cap
          let swlat = null
          let swlng = null
          let nelat = null
          let nelng = null

          groups.forEach(group => {
            if (group.bbox) {
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
                  : Math.min(nelat, group.bbox.nelat)
              nelng =
                nelng === null
                  ? group.bbox.nelng
                  : Math.min(nelng, group.bbox.nelng)
            }
          })

          if (swlat !== null) {
            this.initialBounds = [[swlat, swlng], [nelat, nelng]]
          }
        }
      }
    },
    async showPostsFromNearby() {
      const settings = this.me.settings
      settings.browseView = 'nearby'

      await this.$store.dispatch('auth/saveAndGet', {
        settings: settings
      })
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
