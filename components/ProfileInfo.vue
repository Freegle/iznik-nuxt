<template>
  <div>
    <div v-if="user">
      <b-card v-if="header" variant="white" border-variant="success" class="mt-1">
        <b-card-body class="p-0">
          <profile-header :id="id" class="m-0" />
        </b-card-body>
      </b-card>
      <NoticeMessage v-if="user.supporter" variant="primary" class="supporter d-flex justify-content-between flex-wrap">
        <span class="align-self-center">
          <v-icon name="heart" /> Very kindly keeps Freegle running with donations of time or money.
        </span>
        <b-btn variant="link" class="align-self-center p-0" @click="supporterInfo">
          Find out more
        </b-btn>
        <SupporterInfoModal v-if="showSupporterInfo" ref="supporterInfoModal" />
      </NoticeMessage>
      <b-card v-if="aboutme" variant="white" class="mt-2">
        <b-card-body class="p-0">
          <div class="mb-1">
            <blockquote class="font-weight-bold">
              &quot;{{ aboutme }}&quot;
            </blockquote>
          </div>
        </b-card-body>
      </b-card>
      <b-card border-variant="success" header-bg-variant="success" header-text-variant="white" class="mt-2">
        <notice-message v-if="user.info.expectedreply" variant="warning">
          <v-icon name="exclamation-triangle" />&nbsp;{{ user.info.expectedreply | pluralize(['freegler is', 'freeglers are'], { includeNumber: true }) }} still waiting for them to reply on here.
        </notice-message>
        <notice-message v-else-if="user.hasReneged" variant="warning">
          <v-icon name="exclamation-triangle" />&nbsp;Things haven't always worked out for this freegler.  That might not be their fault, but please make very clear arrangements.
        </notice-message>
        <template v-slot:header>
          <v-icon name="info-circle" /> About this freegler
        </template>
        <b-card-body class="p-0 pt-1">
          <p v-if="user.info.milesaway">
            <v-icon name="map-marker-alt" class="fa-fw" />
            <span v-if="user.info.publiclocation">
              <span v-if="user.info.publiclocation.location">
                {{ user.info.publiclocation.location }}, {{ user.info.milesaway | pluralize([ 'mile', 'miles' ], { includeNumber: true }) }} away.
              </span>
              <span v-else-if="user.info.publiclocation.groupname">
                {{ user.info.publiclocation.groupname }}
              </span>
              <span v-else>
                Unknown
              </span>
            </span>
          </p>
          <ReplyTime :user="user" />
        </b-card-body>
      </b-card>
      <b-card border-variant="success" header-text-variant="text-success" class="mt-2">
        <template v-slot:header>
          <v-icon name="gift" />
          {{ activeOffers.length }} active {{ activeOffers.length | pluralize(['OFFER', 'OFFERs']) }}
        </template>
        <b-card-body class="p-0">
          <div v-if="activeOffers.length">
            <div v-for="message in activeOffers" :key="'message-' + message.id" class="p-0">
              <Message :id="message.id" record-view />
            </div>
          </div>
          <p v-else>
            None at the moment.
          </p>
        </b-card-body>
      </b-card>
      <b-card border-variant="success" header-text-variant="text-info" class="mt-2">
        <template v-slot:header>
          <v-icon name="search" />
          {{ activeWanteds.length }} active {{ activeWanteds.length | pluralize(['WANTED', 'WANTEDs']) }}
        </template>
        <b-card-body class="p-0">
          <div v-if="activeWanteds.length">
            <div v-for="message in activeWanteds" :key="'message-' + message.id" class="p-0">
              <Message :id="message.id" record-view />
            </div>
          </div>
          <p v-else>
            None at the moment.
          </p>
        </b-card-body>
      </b-card>
      <b-card border-variant="success" header-bg-variant="info" header-text-variant="white" class="mt-2">
        <template v-slot:header>
          <v-icon name="chart-bar" />
          <span v-if="user.info.offers + user.info.wanteds + user.info.replies > 0">Activity in the last 90 days</span>
          <span v-else>No recent activity.</span>
        </template>
        <b-card-body class="p-0 pt-1">
          <b-row v-if="user.info.offers + user.info.wanteds + user.info.replies > 0">
            <b-col cols="12" md="4">
              <v-icon name="gift" /> {{ user.info.offers | pluralize([ 'recent OFFER', 'recent OFFERs' ], { includeNumber: true }) }}.
            </b-col>
            <b-col cols="12" md="4">
              <v-icon name="search" /> {{ user.info.wanteds | pluralize([ 'recent WANTED', 'recent WANTEDs' ], { includeNumber: true }) }}.
            </b-col>
            <b-col cols="12" md="4">
              <v-icon name="envelope" /> {{ user.info.replies | pluralize([ 'reply', 'replies' ], { includeNumber: true }) }}.
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <span v-if="user.info.collected">
                <v-icon name="check" /> Picked up about {{ user.info.collected | pluralize('item', { includeNumber: true }) }}.
              </span>
              <span v-else>
                <v-icon name="check" class="text-faded" />&nbsp;Not received any items recently, so far as we know.
              </span>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </div>
    <NoticeMessage v-else-if="invalidUser" variant="danger">
      There is no profile for that user - looks like an invalid user id.
    </NoticeMessage>
  </div>
</template>

<script>
import waitForRef from '@/mixins/waitForRef'
import SupporterInfoModal from '~/components/SupporterInfoModal'
import NoticeMessage from '~/components/NoticeMessage'
import twem from '~/assets/js/twem'

import ReplyTime from '~/components/ReplyTime'
import Message from '~/components/Message.vue'
import ProfileHeader from '~/components/ProfileHeader'

export default {
  components: {
    SupporterInfoModal,
    NoticeMessage,
    ReplyTime,
    Message,
    ProfileHeader
  },
  mixins: [waitForRef],
  props: {
    id: {
      type: Number,
      required: true
    },
    header: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data: function() {
    return {
      invalidUser: false,
      showSupporterInfo: false
    }
  },
  computed: {
    user() {
      const ret = this.id ? this.$store.getters['user/get'](this.id) : null
      return ret
    },
    activeOffers() {
      return this.active('Offer')
    },
    activeWanteds() {
      return this.active('Wanted')
    },
    aboutme() {
      return this.user && this.user.info && this.user.info.aboutme
        ? twem.twem(this.$twemoji, this.user.info.aboutme.text)
        : null
    },
    messages() {
      return this.$store.getters['messages/getAll'].filter(
        m => m.fromuser.id === this.user.id
      )
    }
  },
  async mounted() {
    // Get the user and their messages.  Don't clear the store of messages, as there are cases where that would
    // end up destroying ourselves (view message, opens modal, click to view info).
    await this.$store.dispatch('user/fetch', {
      id: this.id,
      info: true
    })

    const user = this.$store.getters['user/get'](this.id)

    if (user) {
      await this.$store.dispatch('messages/fetchMessages', {
        fromuser: this.id,
        limit: 1000,
        age: user.info.openage
      })
    } else {
      this.invalidUser = true
    }
  },
  methods: {
    active(type) {
      const ret = []

      for (const message of this.messages) {
        // We need to check the fromuser.  This is because we've seen a slow call from another page complete and
        // pollute the store with messages from other people.  We might not have the fromuser if we're logged out,
        // though.  That leaves a slight bug in place.
        if (
          message.type === type &&
          (!message.outcomes || message.outcomes.length === 0) &&
          (!message.fromuser ||
            parseInt(message.fromuser.id) === parseInt(this.id))
        ) {
          ret.push(message)
        }
      }

      return ret
    },
    supporterInfo() {
      this.showSupporterInfo = true

      this.waitForRef('supporterInfoModal', () => {
        this.$refs.supporterInfoModal.show()
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
@import 'bootstrap/scss/_functions';
@import 'bootstrap/scss/_variables';
@import 'bootstrap/scss/mixins/_breakpoints';

.covername {
  left: 108px;
  position: absolute;
  width: calc(100% - 105px);
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
}

.supporter {
  background-color: $color-gold;
  color: white;
}
</style>
