<template>
  <b-col>
    <b-row class="m-0">
      <b-col cols="0" md="3" class="d-none d-md-block">
        <sidebar-left />
      </b-col>
      <b-col cols="12" md="6" class="p-0">
        <b-card
          class="mt-2"
          border-variant="info"
          header="info"
          header-bg-variant="info"
          header-text-variant="white"
          no-body
        >
          <template slot="header">
            <h3 class="d-inline">
              <v-icon name="gift" scale="2" /> Your OFFERs
            </h3>
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
              <p v-if="offers.length > 0" class="text-muted">
                Stuff you're giving away.
              </p>
              <b-img-lazy v-if="busy && offers.length === 0" src="~/static/loader.gif" />
              <div v-if="busy || offers.length > 0">
                <div v-for="(message, $index) in offers" :key="$index" class="p-0 text-left mt-1">
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
                    <b-button to="/give" class="mt-1" size="lg" variant="success">
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
            <h3 class="d-inline">
              <v-icon name="search" scale="2" /> Your WANTEDs
            </h3>
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
              <p v-if="wanteds.length > 0" class="text-muted">
                Stuff you're trying to find.
              </p>
              <div v-if="busy || wanteds.length > 0">
                <div v-for="(message, $index) in wanteds" :key="$index" class="p-0 text-left mt-1">
                  <MyMessage :message="message" :messages="messages" :show-old="showOldWanteds" :expand="expand" />
                </div>
              </div>
              <div v-else>
                <b-row>
                  <b-col>
                    <p>Nothing here yet.  Why not...</p>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="5" class="text-center">
                    <b-button to="/find" class="mt-1" size="lg" variant="primary">
                      <v-icon name="search" />&nbsp;Find stuff
                    </b-button>
                  </b-col>
                  <b-col cols="2" />
                  <b-col cols="5" class="text-center">
                    <b-button to="/find/whatisit" class="mt-1" size="lg" variant="info">
                      <v-icon name="gift" />&nbsp;Post a WANTED
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
            <h3 class="d-inline">
              <v-icon name="search" scale="2" /> Your Searches
            </h3>
          </template>
          <b-card-body class="p-1 p-lg-3">
            <b-card-text class="text-center">
              <p v-if="searches.length > 0" class="text-muted">
                What you've recently searched for - click to search again. These are also email alerts - we'll mail you matching posts.
              </p>
              <ul v-if="busy || searches && Object.keys(searches).length > 0" class="list-group list-group-horizontal flex-wrap">
                <li v-for="(search, $index) in searches" :key="$index" class="text-left mt-1 list-group-item bg-white border text-nowrap mr-2">
                  <b-btn variant="white d-inline">
                    <v-icon name="search" /> {{ search.term }}
                  </b-btn>
                  <span class="ml-3 d-inline clickme" @click="deleteSearch(search.id)">
                    <v-icon v-if="removingSearch === search.id" name="sync" class="text-success fa-spin" />
                    <v-icon v-else-if="removedSearch === search.id" name="check" class="text-success" />
                    <v-icon v-else name="trash-alt" title="Delete this search" />
                  </span>
                </li>
              </ul>
              <div v-else>
                <b-row>
                  <b-col>
                    <p>Nothing here yet.  Why not...</p>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col class="text-center">
                    <b-button to="/find" class="mt-1" size="lg" variant="primary">
                      <v-icon name="search" />&nbsp;Find stuff
                    </b-button>
                  </b-col>
                </b-row>
              </div>
            </b-card-text>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="0" md="3" class="d-none d-md-block">
        <sidebar-right />
      </b-col>
    </b-row>
  </b-col>
</template>
<style scoped>
</style>
<script>
import loginRequired from '@/mixins/loginRequired.js'
const MyMessage = () => import('~/components/MyMessage.vue')
const SidebarLeft = () => import('~/components/sidebar-left.vue')
const SidebarRight = () => import('~/components/sidebar-right.vue')
// TODO Availability
// TODO Repost results in two items on the post page?  Maybe, needs testing.

export default {
  components: {
    MyMessage,
    SidebarLeft,
    SidebarRight
  },
  mixins: [loginRequired],
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
      removedSearch: null
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

      return ret
    },

    offers() {
      const ret = []

      for (const message of this.messages) {
        if (message.type === 'Offer') {
          ret.push(message)
        }
      }

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
    searches() {
      const ret = this.$store.getters['searches/list']()
      return ret
    }
  },
  async mounted() {
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
  },
  methods: {
    async loadMore() {
      const me = this.$store.state.auth.user
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

        this.messages = this.$store.getters['messages/getAll']()
        this.context = this.$store.getters['messages/getContext']()

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
    }
  }
}
</script>
