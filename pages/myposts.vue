<template>
  <b-col>
    <b-row class="m-0">
      <b-col cols="0" md="3">
        Community Events go here
      </b-col>
      <b-col cols="12" md="6" class="p-0">
        <b-card
          class="mt-2"
          border-variant="info"
          header="info"
          header-bg-variant="info"
          header-text-variant="white"
        >
          <template slot="header">
            <span>
              <v-icon name="gift" /> Your OFFERs
            </span>
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
          <b-card-text class="text-center">
            <p class="text-muted">
              Stuff you're giving away.
            </p>
            <b-img-lazy v-if="busy" src="~/static/loader.gif" />
            <div v-for="(message, $index) in messages" :key="$index" class="p-0 text-left mt-1">
              <MyMessage v-if="message.type === 'Offer'" :message="message" :messages="messages" :show-old="showOldOffers" />
            </div>
          </b-card-text>
        </b-card>
      </b-col>
      <b-col cols="0" md="3">
        Volunteer ops and ads go here
      </b-col>
    </b-row>
  </b-col>
</template>
<style scoped>
</style>
<script>
import loginRequired from '@/mixins/loginRequired.js'
const MyMessage = () => import('~/components/MyMessage.vue')
// TODO Availability

export default {
  components: {
    MyMessage
  },
  mixins: [loginRequired],
  data() {
    return {
      id: null,
      messages: [],
      busy: true,
      context: null,
      showOldOffers: false,
      showOldWanteds: false
    }
  },
  computed: {
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
    }
  },
  async mounted() {
    // Ensure we have no cached messages for other searches/groups
    this.$store.dispatch('messages/clear')
    this.loadMore()

    // Fetch the chats.  We need this so that we can find chats with unread messages which relate to our own posts
    await this.$store.dispatch('chats/listChats')
  },
  methods: {
    async loadMore() {
      await this.$store.dispatch('auth/fetchUser', {
        components: ['me', 'groups']
      })

      const me = this.$store.state.auth.user
      const currentCount = this.messages.length

      this.$store
        .dispatch('messages/fetchMessages', {
          collection: 'AllUser',
          summary: true,
          types: ['Offer', 'Wanted'],
          fromuser: me.id,
          context: this.context
        })
        .then(() => {
          this.busy = false

          this.messages = this.$store.getters['messages/getAll']()
          this.context = this.$store.getters['messages/getContext']()

          if (currentCount !== this.messages.length) {
            this.loadMore()
          }
        })
        .catch(() => {
          this.busy = false
          console.log('Complete')
        })
    },

    toggleOldOffer() {
      this.showOldOffers = !this.showOldOffers
    }
  }
}
</script>
