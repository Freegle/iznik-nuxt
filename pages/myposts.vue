<template>
  <b-container fluid>
    <h1 class="sr-only">
      My posts
    </h1>
    <b-row class="m-0">
      <b-col cols="0" lg="3" class="p-0 pr-1">
        <Visible :at="['lg', 'xl']">
          <SidebarLeft v-if="me && !justPosted" :show-community-events="true" :show-bot-left="true" />
        </Visible>
      </b-col>
      <b-col cols="12" lg="6" class="p-0">
        <ExpectedRepliesWarning v-if="me && me.expectedreplies" :count="me.expectedreplies" :chats="me.expectedchats" />
        <div v-if="justPosted && justPosted.length">
          <JustPosted :ids="justPosted" :newuser="newuser" :newpassword="newpassword" />
        </div>
        <div v-if="!me" class="d-flex justify-content-center mt-4 flex-wrap">
          <b-btn variant="primary" size="lg" @click="forceLogin">
            Log in to continue <v-icon name="angle-double-right" />
          </b-btn>
        </div>
        <div v-else>
          <Visible :at="['xs', 'sm', 'md']" class="ml-2 mr-2 mb-2">
            <LoveJunk variant="mobile" :shown.sync="shownLoveJunk" />
          </Visible>
          <Visible :at="['lg', 'xl']" class="ml-2 mr-2 mb-2">
            <LoveJunk variant="desktop" :shown.sync="shownLoveJunk" />
          </Visible>
          <Visible :at="['xs', 'sm', 'md']">
            <JobsTopBar v-if="!justPosted" :shown-love-junk="shownLoveJunk" />
          </Visible>
          <b-card v-if="contactPicker" border-variant="info">
            <Invite class="bg-white" />
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
                  <b-btn variant="secondary" title="Show old OFFERs" @click="toggleOldOffer">
                    Hide {{ oldOfferCount | pluralize([ 'old OFFER', 'old OFFERs' ], { includeNumber: true }) }}
                  </b-btn>
                </span>
                <span v-else class="float-right">
                  <b-btn variant="secondary" @click="toggleOldOffer">
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
                    <MyMessage :message="message" :show-old="showOldOffers" :expand="expand" />
                  </div>
                </div>
                <div v-else>
                  <b-row>
                    <b-col>
                      <p>You have no active OFFERs.</p>
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
                <v-icon name="shopping-cart" scale="2" /> Your WANTEDs
              </h2>
              <span v-if="oldWantedCount > 0">
                <span v-if="showOldWanteds" class="float-right">
                  <b-btn variant="secondary" title="Show old WANTEDs" @click="toggleOldWanted">
                    Hide {{ oldWantedCount | pluralize([ 'old WANTED', 'old WANTEDs' ], { includeNumber: true }) }}
                  </b-btn>
                </span>
                <span v-else class="float-right">
                  <b-btn variant="secondary" @click="toggleOldWanted">
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
                    <MyMessage :message="message" :show-old="showOldWanteds" :expand="expand" />
                  </div>
                </div>
                <div v-else>
                  <p>You have no active WANTEDs.</p>
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
                    <b-btn :to="'/browse/' + search.term" variant="white d-inline">
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
      <b-col cols="0" lg="3" class="p-0 pl-1">
        <Visible :at="['lg', 'xl']">
          <sidebar-right v-if="me && !justPosted" show-volunteer-opportunities show-job-opportunities />
        </Visible>
      </b-col>
    </b-row>
    <DonationAskModal ref="askmodal" :groupid="donationGroup" />
  </b-container>
</template>

<script>
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
import LoveJunk from '@/components/LoveJunk'
import Invite from '../components/Invite'
import Visible from '../components/Visible'
const JustPosted = () => import('~/components/JustPosted')
const JobsTopBar = () => import('~/components/JobsTopBar')
const MyMessage = () => import('~/components/MyMessage.vue')
const SidebarLeft = () => import('~/components/SidebarLeft')
const SidebarRight = () => import('~/components/SidebarRight')
const DonationAskModal = () => import('~/components/DonationAskModal')
const ExpectedRepliesWarning = () =>
  import('~/components/ExpectedRepliesWarning')

export default {
  components: {
    Visible,
    Invite,
    JustPosted,
    JobsTopBar,
    MyMessage,
    SidebarLeft,
    SidebarRight,
    DonationAskModal,
    ExpectedRepliesWarning,
    LoveJunk
  },
  mixins: [loginOptional, buildHead],
  data() {
    return {
      justPosted: null,
      id: null,
      busy: true,
      context: null,
      showOldOffers: false,
      showOldWanteds: false,
      expand: false,
      removingSearch: null,
      removedSearch: null,
      donationGroup: null,
      newuser: false,
      newpassword: null,
      shownLoveJunk: false
    }
  },
  computed: {
    messages() {
      // We need to filter for ours in case we have other stuff in store.
      const messages = this.$store.getters['messages/getAll']
      return messages.filter(m => {
        return m.mine
      })
    },
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
    searches() {
      // Show the searches within the last 90 days, most recent first.  Anything older is less likely to be relevant
      // and it stops it growing forever, forcing them to delete things.
      let ret = Object.values(this.$store.getters['searches/list'])
      ret = ret.filter(a => a.daysago <= 90)
      ret.sort((a, b) => a.daysago - b.daysago)

      return ret
    },
    contactPicker() {
      if (process.server) {
        return false
      } else {
        const ret =
          'contacts' in window.navigator && 'ContactsManager' in window
        return ret
      }
    }
  },
  watch: {
    me: {
      handler(newVal, oldVal) {
        if (!oldVal && newVal) {
          this.startUp()
        }
      },
      immediate: true
    }
  },
  mounted() {
    const lastask = this.$store.getters['misc/get']('lastdonationask')
    let canask =
      !lastask || new Date().getTime() - lastask > 60 * 60 * 1000 * 24 * 7

    // Donation ask on Browse page is only used when we have a specific push.
    canask = false

    if (canask) {
      this.ask()

      this.$store.dispatch('misc/set', {
        key: 'lastdonationask',
        value: new Date().getTime()
      })
    }

    // We might have parameters from just having posted.
    this.justPosted = this.$route.params.justPosted
    this.newuser = this.$route.params.newuser
    this.newpassword = this.$route.params.newpassword

    // We want this to be our next home page.
    const existingHomepage = this.$store.getters['misc/get']('lasthomepage')

    if (existingHomepage !== 'myposts') {
      this.$store.dispatch('misc/set', {
        key: 'lasthomepage',
        value: 'myposts'
      })
    }

    this.loadStarted = this.$dayjs()
    this.fetchMe(['me', 'groups'])

    // For some reason we can't capture emitted events from the outcome modal so use root as a bus.
    this.$root.$on('outcome', params => {
      const { groupid, outcome } = params

      if (outcome === 'Taken' || outcome === 'Received') {
        // If someone has set up a regular donation, then we don't ask them to donate again.  Wouldn't be fair to
        // pester them.
        if (!this.me.donorrecurring && canask) {
          this.donationGroup = groupid
          this.ask()

          this.$store.dispatch('misc/set', {
            key: 'lastdonationask',
            value: new Date().getTime()
          })
        }
      }
    })
  },
  methods: {
    async startUp() {
      // Fetch messages.
      await this.$store.dispatch('messages/clearContext')
      await this.loadMore()

      // Get the searches afterwards otherwise they load first which looks silly as they're less important.
      this.busy = true
      await this.$store.dispatch('searches/fetchList')
      this.busy = false

      // Fetch the chats.  We need this so that we can find chats with unread messages which relate to our own posts
      await this.$store.dispatch('chats/listChats')
    },
    async loadMore() {
      if (this.me) {
        try {
          const fetched = await this.$store.dispatch('messages/fetchMessages', {
            collection: 'AllUser',
            summary: true,
            types: ['Offer', 'Wanted'],
            fromuser: this.myid,
            context: this.context,
            limit: 15
          })

          this.busy = false

          this.context = this.$store.getters['messages/getContext']

          if (fetched && fetched.length) {
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

            // Check for any messages which have been deleted.  We look for messages in the cache which have not been
            // added since we started fetching them.  These must be old messages cached in store but no longer returned
            // from the server - because they have been deleted.
            this.messages.forEach(m => {
              const added = this.$dayjs(
                m.addedToStore ? m.addedToStore : '2000-01-01'
              )

              if (added.isBefore(this.loadStarted)) {
                this.$store.dispatch('messages/removeFromCache', {
                  id: m.id
                })
              }
            })
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
    ask(groupid) {
      this.waitForRef('askmodal', () => {
        this.$refs.askmodal.show()
      })
    },
    postSort(a, b) {
      // Show promised items first, then by most recent activity.

      if (a.promised && !b.promised) {
        return -1
      } else if (b.promised && !a.promised) {
        return 1
      } else {
        let adate = null
        let bdate = null
        if (a.lastdate && b.lastdate) {
          adate = a.lastdate
          bdate = b.lastdate
        } else if (a.groups && a.groups.length && b.groups && b.groups.length) {
          adate = a.groups[0].arrival
          bdate = b.groups[0].arrival
        } else {
          adate = a.arrival
          bdate = b.arrival
        }

        return new Date(bdate).getTime() - new Date(adate).getTime()
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
