<template>
  <div>
    <div v-if="user" class="profile__wrapper">
      <b-card variant="white" border-variant="success" class="mt-1">
        <b-card-body class="p-0">
          <div class="m-0">
            <b-media>
              <template slot="aside">
                <ProfileImage :image="user.profile.url" class="mb-1 mt-1 inline" is-thumbnail size="xl" />
              </template>
              <b-media-body class="align-top d-flex justify-content-between profile__info">
                <div>
                  <h4 class="d-inline-block">
                    {{ user.displayname }}
                  </h4>
                  <div>
                    <div class="text-muted">
                      <span class="glyphicon glyphicon-heart" /> Freegler since {{ user.added | dateonly }}.
                    </div>
                    <span v-if="user.settings.showmod" class="text-muted">
                      <v-icon name="leaf" /> Freegle Volunteer
                    </span>
                  </div>
                </div>
                <div>
                  <div class="small text-faded mb-1 text-left text-lg-right">
                    #{{ id }}
                  </div>
                  <div class="d-flex flex-row flex-lg-column align-items-baseline">
                    <ChatButton
                      v-if="user.id !== myid"
                      :userid="user.id"
                      size="sm"
                      title="Message"
                      class="mb-1 order-1 order-lg-0 align-self-lg-center"
                    />
                    <ratings :id="user.id" size="sm" class="pt-1 mr-2 mr-lg-0 d-block" />
                  </div>
                </div>
              </b-media-body>
            </b-media>
          </div>
        </b-card-body>
      </b-card>
      <b-card v-if="aboutme" variant="white" class="mt-2">
        <b-card-body class="p-0">
          <div class="mb-1">
            <blockquote>
              <b>&quot;{{ aboutme }}&quot;</b>
            </blockquote>
          </div>
        </b-card-body>
      </b-card>
      <b-card border-variant="success" header-bg-variant="success" header-text-variant="white" class="mt-2">
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
              <Message v-bind="message" />
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
              <Message v-bind="message" />
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
import NoticeMessage from '../../components/NoticeMessage'
import twem from '~/assets/js/twem'
import loginOptional from '@/mixins/loginOptional.js'

import Ratings from '~/components/Ratings'
import ReplyTime from '~/components/ReplyTime'
import Message from '~/components/Message.vue'
import ChatButton from '~/components/ChatButton'
import ProfileImage from '~/components/ProfileImage'

export default {
  components: {
    NoticeMessage,
    Ratings,
    ReplyTime,
    Message,
    ChatButton,
    ProfileImage
  },
  mixins: [loginOptional],
  props: {},
  data: function() {
    return {
      id: null,
      messages: []
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
    }
  },
  async asyncData({ app, params, store }) {
    // Get the user and their messages.
    let invalidUser = false

    await store.dispatch('user/fetch', {
      id: params.id,
      info: true
    })

    const user = store.getters['user/get'](params.id)

    if (user) {
      await store.dispatch('messages/clear')
      await store.dispatch('messages/fetchMessages', {
        fromuser: params.id,
        limit: 1000,
        age: user.info.openage
      })
    } else {
      invalidUser = true
    }

    return {
      messages: store.getters['messages/getAll'],
      invalidUser: invalidUser
    }
  },
  created() {
    this.id = this.$route.params.id
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
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';
@import 'bootstrap/scss/_functions';
@import 'bootstrap/scss/_variables';
@import 'bootstrap/scss/mixins/_breakpoints';

.coverphoto {
  height: 100px !important;
  width: 100% !important;
  background-image: url('~static/wallpaper.png');
}

.covername {
  left: 108px;
  position: absolute;
  width: calc(100% - 105px);
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
}

.profile__wrapper {
  width: 100%;
  padding-left: 5px;
  padding-right: 5px;

  @include media-breakpoint-up(md) {
    width: 50%;
    margin: 0 auto;
    padding-left: 0;
    padding-right: 0;
  }
}

.profile__info {
  flex-direction: column;

  @include media-breakpoint-up(lg) {
    flex-direction: row;
  }
}
</style>
