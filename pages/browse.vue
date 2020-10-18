<template>
  <b-container fluid>
    <h1 class="sr-only">
      Browse items
    </h1>
    <b-row class="m-0">
      <b-col cols="0" xl="3" class="d-none d-xl-block p-0 pr-1">
        <SidebarLeft :show-community-events="true" :show-bot-left="true" />
      </b-col>
      <b-col cols="12" xl="6" class="p-0">
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
        <AdaptiveMap
          v-if="initialBounds"
          :initial-bounds="initialBounds"
          class="mt-2"
          force-messages
          filters
          group-info
          jobs
        />
      </b-col>
      <b-col cols="0" xl="3" class="d-none d-xl-block p-0 pl-1">
        <sidebar-right show-volunteer-opportunities />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import CovidWarning from '~/components/CovidWarning'
import AdaptiveMap from '~/components/AdaptiveMap'
import loginRequired from '@/mixins/loginRequired.js'
import buildHead from '@/mixins/buildHead.js'
import map from '@/mixins/map.js'
const SidebarLeft = () => import('~/components/SidebarLeft')
const SidebarRight = () => import('~/components/SidebarRight')
const ExpectedRepliesWarning = () =>
  import('~/components/ExpectedRepliesWarning')

export default {
  components: {
    AdaptiveMap,
    CovidWarning,
    SidebarLeft,
    SidebarRight,
    ExpectedRepliesWarning
  },
  mixins: [loginRequired, buildHead, map],
  data: function() {
    return {
      initialBounds: null
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

    // Get our list of groups
    await this.$store.dispatch('auth/fetchUser', {
      components: ['me', 'groups']
    })

    // Get my location.
    let mylat = null
    let mylng = null

    const me = this.$store.getters['auth/user']

    if (me && (me.lat || me.lng)) {
      mylat = me.lat
      mylng = me.lng
    }

    // Look for groups where we are a member which are within a reasonable distance of our home
    // location (if we know it).
    const groups = this.$store.getters['auth/groups']
    let bounds = null

    let swlat = null
    let swlng = null
    let nelat = null
    let nelng = null

    groups.forEach(group => {
      if (group.onmap && group.publish) {
        const distAway =
          mylat !== null
            ? this.getDistance([group.lat, group.lng], [mylat, mylng])
            : 0

        if (distAway < 50000) {
          swlat = swlat === null ? group.lat : Math.min(swlat, group.lat)
          swlng = swlng === null ? group.lng : Math.min(swlng, group.lng)
          nelat = nelat === null ? group.lat : Math.max(nelat, group.lat)
          nelng = nelng === null ? group.lng : Math.max(nelng, group.lng)
          // TODO Group should contain bounding box so that we can work out how to position map initially.
        }
      }
    })

    if (swlat !== null && swlng !== null && nelat !== null && nelng !== null) {
      bounds = [[swlat, swlng], [nelat, nelng]]
    } else if (mylat !== null) {
      // We're not a member of any groups, but at least we know where we are.  Centre there, and then let
      // the map zoom to somewhere sensible.
      bounds = [[mylat - 0.01, mylng - 0.01], [mylat + 0.01, mylng + 0.01]]
    } else {
      // We aren't a member of any groups and we don't know where we are.  This can happen, but it's rare.
      // Send them to the explore page to pick somewhere.
      this.$router.push('/explore')
    }

    this.initialBounds = bounds

    // Also get all the groups.  This allows us to suggest other groups to join from within the map.  No rush
    // though, so delay it.
    setTimeout(() => {
      this.$store.dispatch('group/list', {
        grouptype: 'Freegle'
      })
    }, 5000)
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
