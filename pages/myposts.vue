<template>
  <b-container fluid>
    <h1 class="sr-only">
      My posts
    </h1>
    <b-row class="m-0">
      <b-col cols="0" lg="3" class="d-none d-lg-block p-0 pr-1">
        <SidebarLeft v-if="me && !justPosted" :show-community-events="true" :show-bot-left="true" />
      </b-col>
      <b-col cols="12" lg="6" class="p-0">
        <ExpectedRepliesWarning v-if="me && me.expectedreplies" :count="me.expectedreplies" :chats="me.expectedchats" />
        <div v-if="justPosted && justPosted.length">
          <JustPosted :ids="justPosted" :newuser="newuser" :newpassword="newpassword" />
        </div>
        <div v-if="!me" class="d-flex justify-content-center mt-4 flex-wrap">
          <b-btn variant="primary" size="lg" @click="forceLogin">
            Sign in to continue <v-icon name="angle-double-right" />
          </b-btn>
        </div>
        <div v-else>
          <JobsTopBar />
          <b-card
            v-if="!simple"
            class="mt-2"
            border-variant="info"
            header="info"
            header-bg-variant="info"
            header-text-variant="white"
            no-body
          >
            <template slot="header">
              <h2 class="d-inline header--size3">
                <v-icon name="calendar-alt" scale="2" /> Your Availability
              </h2>
            </template>
            <b-card-body>
              <p>
                Tell us when you're free and it'll make it quicker to arrange collection times.
              </p>
              <b-btn size="lg" variant="primary" @click="availability">
                <v-icon name="calendar-alt" /> Update your availability
              </b-btn>
            </b-card-body>
          </b-card>
          <b-card
            class="mt-2"
            border-variant="info"
            header="info"
            header-bg-variant="info"
            header-text-variant="white"
            no-body
          >
            <template slot="header">
              <h2 class="d-inline header--size3">
                <v-icon name="gift" scale="2" /> Your OFFERs
              </h2>
              <span v-if="oldOfferCount > 0">
                <span v-if="showOldOffers" class="float-right">
                  <b-btn variant="white" title="Show old OFFERs" @click="toggleOldOffer">
                    Hide {{ oldOfferCount | pluralize([ 'old OFFER', 'old OFFERs' ], { includeNumber: true }) }}
                  </b-btn>
                </span>
                <span v-else class="float-right">
                  <b-btn variant="white" @click="toggleOldOffer">
                    +{{ oldOfferCount | pluralize([ 'old OFFER', 'old OFFERs' ], { includeNumber: true }) }}
                  </b-btn>
                </span>
              </span>
            </template>
            <b-card-body class="p-1 p-lg-3">
              <b-card-text class="text-center">
                <p v-if="activeOfferCount > 0" class="text-muted">
                  Stuff you're giving away.
                </p>
                <b-img-lazy v-if="busy && offers.length === 0" src="~/static/loader.gif" alt="Loading..." />
                <div v-if="busy || activeOfferCount > 0 || (showOldOffers && offers.length > 0)">
                  <div v-for="message in offers" :key="'message-' + message.id" class="p-0 text-left mt-1">
                    <MyMessage :message="message" :messages="messages" :show-old="showOldOffers" :expand="expand" />
                  </div>
                </div>
                <div v-else>
                  <b-row>
                    <b-col>
                      <p>Nothing here yet.  Why not...</p>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col class="text-center">
                      <b-button to="/give" class="mt-1" size="lg" variant="primary">
                        <v-icon name="gift" />&nbsp;OFFER something
                      </b-button>
                    </b-col>
                  </b-row>
                </div>
              </b-card-text>
            </b-card-body>
          </b-card>
          <b-card
            class="mt-2"
            border-variant="info"
            header="info"
            header-bg-variant="info"
            header-text-variant="white"
            no-body
          >
            <template slot="header">
              <h2 class="d-inline header--size3">
                <v-icon name="search" scale="2" /> Your WANTEDs
              </h2>
              <span v-if="oldWantedCount > 0">
                <span v-if="showOldWanteds" class="float-right">
                  <b-btn variant="white" title="Show old WANTEDs" @click="toggleOldWanted">
                    Hide {{ oldWantedCount | pluralize([ 'old WANTED', 'old WANTEDs' ], { includeNumber: true }) }}
                  </b-btn>
                </span>
                <span v-else class="float-right">
                  <b-btn variant="white" @click="toggleOldWanted">
                    +{{ oldWantedCount | pluralize([ 'old WANTED', 'old WANTEDs' ], { includeNumber: true }) }}
                  </b-btn>
                </span>
              </span>
            </template>
            <b-card-body class="p-1 p-lg-3">
              <b-card-text class="text-center">
                <p v-if="activeWantedCount > 0" class="text-muted">
                  Stuff you're trying to find.
                </p>
                <div v-if="busy || activeWantedCount > 0 || (showOldWanteds && wanteds.length > 0)">
                  <div v-for="message in wanteds" :key="'message-' + message.id" class="p-0 text-left mt-1">
                    <MyMessage :message="message" :messages="messages" :show-old="showOldWanteds" :expand="expand" />
                  </div>
                </div>
                <div v-else>
                  <p>Nothing here yet.  Why not...</p>
                  <div class="d-flex justify-content-around mb-2">
                    <b-button to="/find" class="mt-1" size="lg" variant="secondary">
                      <v-icon name="shopping-cart" />&nbsp;Ask for something
                    </b-button>
                  </div>
                </div>
              </b-card-text>
            </b-card-body>
          </b-card>
          <b-card
            v-if="!simple"
            class="mt-2"
            border-variant="info"
            header="info"
            header-bg-variant="info"
            header-text-variant="white"
            no-body
          >
            <template slot="header">
              <h2 class="d-inline header--size3">
                <v-icon name="search" scale="2" /> Your Searches
              </h2>
            </template>
            <b-card-body class="p-1 p-lg-3">
              <b-card-text class="text-center">
                <p v-if="searches.length > 0" class="text-muted">
                  What you've recently searched for - click to search again. These are also email alerts - we'll mail you matching posts.
                </p>
                <ul v-if="busy || searches && Object.keys(searches).length > 0" class="list-group list-group-horizontal flex-wrap">
                  <li v-for="search in searches" :key="'search-' + search.id" class="text-left mt-1 list-group-item bg-white border text-nowrap mr-2">
                    <b-btn :to="'/search/' + search.term" variant="white d-inline">
                      <v-icon name="search" /> {{ search.term }} <span class="text-muted small">{{ search.daysago | pluralize(['day ago', 'days ago'], { includeNumber: true }) }}</span>
                    </b-btn>
                    <span class="ml-3 d-inline clickme" @click="deleteSearch(search.id)">
                      <v-icon v-if="removingSearch === search.id" name="sync" class="text-success fa-spin" />
                      <v-icon v-else-if="removedSearch === search.id" name="check" class="text-success" />
                      <v-icon v-else name="trash-alt" title="Delete this search" />
                    </span>
                  </li>
                </ul>
                <div v-else>
                  <p>Nothing here yet.  Why not...</p>
                  <b-button to="/find" class="mt-1" size="lg" variant="secondary">
                    <v-icon name="shopping-cart" />&nbsp;Ask for stuff
                  </b-button>
                </div>
              </b-card-text>
            </b-card-body>
          </b-card>
        </div>
      </b-col>
      <b-col cols="0" lg="3" class="d-none d-lg-block p-0 pl-1">
        <sidebar-right v-if="me && !justPosted" show-volunteer-opportunities />
      </b-col>
    </b-row>
    <AvailabilityModal v-if="me" ref="availabilitymodal" :thisuid="me.id" />
    <DonationAskModal ref="askmodal" :groupid="donationGroup" />
    <RateAppModal ref="rateappmodal" :groupid="donationGroup" />
  </b-container>
</template>

<script>
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
import waitForRef from '@/mixins/waitForRef'
const JustPosted = () => import('~/components/JustPosted')
const JobsTopBar = () => import('~/components/JobsTopBar')
const MyMessage = () => import('~/components/MyMessage.vue')
const SidebarLeft = () => import('~/components/SidebarLeft')
const SidebarRight = () => import('~/components/SidebarRight')
const AvailabilityModal = () => import('~/components/AvailabilityModal')
const DonationAskModal = () => import('~/components/DonationAskModal')
const RateAppModal = () => import('~/components/RateAppModal')
const ExpectedRepliesWarning = () =>
  import('~/components/ExpectedRepliesWarning')

export default {
  components: {
    JustPosted,
    JobsTopBar,
    MyMessage,
    SidebarLeft,
    SidebarRight,
    DonationAskModal,
    AvailabilityModal,
    RateAppModal,
    ExpectedRepliesWarning,
    AvailabilityModal
  },
  mixins: [loginOptional, buildHead, waitForRef],
  data() {
    return {
      justPosted: null,
      id: null,
      messages: [],
      busy: true,
      context: null,
      showOldOffers: false,
      showOldWanteds: false,
      expand: false,
      removingSearch: null,
      removedSearch: null,
      donationGroup: null,
      newuser: false,
      newpassword: null
    }
  },
  computed: {
    postcode() {
      return this.$store.getters['compose/getPostcode']
    },

    wanteds() {
      const ret = this.messages.filter(m => m.type === 'Wanted' && !m.isdraft)
      ret.sort(this.postSort)
      return ret
    },

    offers() {
      const ret = this.messages.filter(m => m.type === 'Offer' && !m.isdraft)
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

    queued() {
      const ret = this.messages.filter(
        m => m.isdraft && (!m.outcomes || m.outcomes.length === 0)
      )
      ret.sort(this.postSort)
      return ret
    },

    queuedCount() {
      return this.queued.length
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
    // We might have parameters from just having posted.
    console.log('Mounted', this.justPosted, this.$route)
    this.justPosted = this.$route.params.justPosted
    this.newuser = this.$route.params.newuser
    this.newpassword = this.$route.params.newpassword

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
      const lastask = this.$store.getters['misc/get']('lastdonationask')

      if (!lastask || new Date().getTime() - lastask > 60 * 60 * 1000) {
        this.donationGroup = groupid
        this.ask()

        this.$store.dispatch('misc/set', {
          key: 'lastdonationask',
          value: new Date().getTime()
        })
      }
    })
  },
  methods: {
    async loadMore() {
      const me = this.$store.getters['auth/user']

      if (me) {
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
    },
    forceLogin() {
      this.$store.dispatch('auth/forceLogin', true)
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
