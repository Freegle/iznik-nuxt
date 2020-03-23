<template>
  <b-container fluid>
    <b-row class="m-0">
      <b-col cols="0" lg="3" class="d-none d-lg-block p-0 pr-1">
        <SidebarLeft :show-community-events="true" :show-bot-left="true" />
      </b-col>
      <b-col cols="12" lg="6" class="p-0">
        <CovidWarning />
      </b-col>
      <b-col cols="0" lg="3" class="d-none d-lg-block p-0 pl-1">
        <sidebar-right show-volunteer-opportunities />
      </b-col>
    </b-row>
    <AvailabilityModal v-if="me" ref="availabilitymodal" :thisuid="me.id" />
    <DonationAskModal ref="askmodal" :groupid="donationGroup" />
    <RateAppModal ref="rateappmodal" :groupid="donationGroup" />
  </b-container>
</template>

<script>
import CovidWarning from '../components/CovidWarning'
import loginRequired from '@/mixins/loginRequired.js'
import buildHead from '@/mixins/buildHead.js'
import waitForRef from '@/mixins/waitForRef'
const SidebarLeft = () => import('~/components/SidebarLeft')
const SidebarRight = () => import('~/components/SidebarRight')
const AvailabilityModal = () => import('~/components/AvailabilityModal')
const DonationAskModal = () => import('~/components/DonationAskModal')
const RateAppModal = () => import('~/components/RateAppModal')
const ExpectedRepliesWarning = () =>
  import('~/components/ExpectedRepliesWarning')

export default {
  components: {
    CovidWarning,
    SidebarLeft,
    SidebarRight,
    DonationAskModal,
    AvailabilityModal,
    RateAppModal,
    ExpectedRepliesWarning,
    AvailabilityModal
  },
  mixins: [loginRequired, buildHead, waitForRef],
  data() {
    return {
      id: null,
      messages: [],
      busy: true,
      context: null,
      showOldOffers: false,
      showOldWanteds: false,
      expand: false,
      removingSearch: null,
      removedSearch: null,
      donationGroup: null
    }
  },
  computed: {
    wanteds() {
      const ret = []

      for (const message of this.messages) {
        if (message.type === 'Wanted') {
          ret.push(message)
        }
      }

      ret.sort(this.postSort)

      return ret
    },

    offers() {
      const ret = []

      for (const message of this.messages) {
        if (message.type === 'Offer') {
          ret.push(message)
        }
      }

      ret.sort(this.postSort)

      return ret
    },

    oldOfferCount() {
      let count = 0

      if (this.messages) {
        for (const message of this.messages) {
          if (
            message.type === 'Offer' &&
            message.outcomes &&
            message.outcomes.length
          ) {
            count++
          }
        }
      }

      return count
    },
    oldWantedCount() {
      let count = 0

      if (this.messages) {
        for (const message of this.messages) {
          if (
            message.type === 'Wanted' &&
            message.outcomes &&
            message.outcomes.length
          ) {
            count++
          }
        }
      }

      return count
    },
    activeOfferCount() {
      let count = 0

      if (this.messages) {
        for (const message of this.messages) {
          if (
            message.type === 'Offer' &&
            (!message.outcomes || !message.outcomes.length)
          ) {
            count++
          }
        }
      }

      return count
    },
    activeWantedCount() {
      let count = 0

      if (this.messages) {
        for (const message of this.messages) {
          if (
            message.type === 'Wanted' &&
            (!message.outcomes || !message.outcomes.length)
          ) {
            count++
          }
        }
      }

      return count
    },
    searches() {
      // Show the searches within the last 90 days, most recent first.  Anything older is less likely to be relevant
      // and it stops it growing forever, forcing them to delete things.
      let ret = Object.values(this.$store.getters['searches/list'])
      ret = ret.filter(a => a.daysago <= 90)
      ret.sort((a, b) => a.daysago - b.daysago)

      return ret
    }
  },
  async mounted() {
    // We want this to be our next home page.
    try {
      localStorage.setItem('Iznik>lasthomepage', 'myposts')
    } catch (e) {
      console.error('Save last route failed', e)
    }

    await this.$store.dispatch('auth/fetchUser', {
      components: ['me', 'groups']
    })

    // Ensure we have no cached messages for other searches/groups
    this.$store.dispatch('messages/clear')
    this.loadMore().then(async () => {
      // Get the searches afterwards otherwise they load first which looks silly as they're less important.
      this.busy = true
      await this.$store.dispatch('searches/fetchList')
      this.busy = false

      // Fetch the chats.  We need this so that we can find chats with unread messages which relate to our own posts
      await this.$store.dispatch('chats/listChats')
    })

    // For some reason we can't capture emitted events from the outcome modal so use root as a bus.
    this.$root.$on('outcome', groupid => {
      this.donationGroup = groupid
      this.ask()
    })
  },
  methods: {
    async loadMore() {
      const me = this.$store.getters['auth/user']
      const currentCount = this.messages.length

      try {
        await this.$store.dispatch('messages/fetchMessages', {
          collection: 'AllUser',
          summary: true,
          types: ['Offer', 'Wanted'],
          fromuser: me.id,
          context: this.context,
          limit: 15
        })

        this.busy = false

        this.messages = this.$store.getters['messages/getAll']
        this.context = this.$store.getters['messages/getContext']

        if (currentCount !== this.messages.length) {
          // More to load
          await this.loadMore()
        } else {
          // Finished.  If the number of active messages is small, expand them.
          let count = 0
          for (const message of this.messages) {
            if (!message.outcomes || message.outcomes.length === 0) {
              count++
            }
          }

          this.expand = count <= 5
        }
      } catch (e) {
        this.busy = false
        console.log('Complete')
      }
    },

    toggleOldOffer() {
      this.showOldOffers = !this.showOldOffers
    },

    toggleOldWanted() {
      this.showOldWanteds = !this.showOldWanteds
    },

    async deleteSearch(id) {
      this.removingSearch = id

      setTimeout(() => {
        this.me.phone = null
      }, 1000)

      await this.$store.dispatch('searches/delete', {
        id: id
      })

      this.removingSearch = null
      this.removedSearch = id
      setTimeout(() => {
        this.removedSearch = null
      }, 2000)
    },
    availability() {
      this.$refs.availabilitymodal.show()
    },
    ask(groupid) {
      if (process.env.IS_APP && !window.localStorage.getItem('rateappnotagain')) { // CC
        this.$refs.rateappmodal.show()
      } else {
        this.waitForRef('askmodal', () => {
          this.$refs.askmodal.show()
        })
      }
    },
    postSort(a, b) {
      // Show promised items first, then by most recent activity.

      if (a.promised && !b.promised) {
        return -1
      } else if (b.promised && !a.promised) {
        return 1
      } else {
        return new Date(a.lastdate).getTime() - new Date(b.lastDate).getTime()
      }
    }
  },
  head() {
    return this.buildHead(
      'My Posts',
      "See OFFERs/WANTEDs that you've posted, and replies to them."
    )
  }
}
</script>

<style scoped>
</style>
