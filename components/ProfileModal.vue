<template>
  <b-modal
    v-if="id && user && user.info"
    id="profilemodal"
    v-model="showModal"
    size="lg"
    no-stacking
  >
    <template slot="modal-header">
      <div class="coverphoto">
        <profile-header :user="user" class="flex-grow-1 px-3 py-2" />
      </div>
    </template>
    <template slot="default">
      <notice-message v-if="user.info.expectedreply" variant="warning">
        <v-icon name="exclamation-triangle" />&nbsp;{{ $pluralize('freegler is', user.info.expectedreply, true) }} still waiting for them to reply.
      </notice-message>
      <notice-message v-else-if="user.hasReneged" variant="warning">
        <v-icon name="exclamation-triangle" />&nbsp;Things haven't always worked out for this freegler.  That might not be their fault, but please make very clear arrangements.
      </notice-message>
      <div v-if="aboutme" class="mb-1">
        <blockquote>
          <b>&quot;{{ aboutme }}&quot;</b>
        </blockquote>
      </div>
      <b-card border-variant="success" header-bg-variant="success" header-text-variant="white" class="mt-2">
        <template v-slot:header>
          <v-icon name="info-circle" /> About this freegler
        </template>
        <b-card-body class="p-0 pt-1">
          <p v-if="user.info.milesaway">
            <v-icon name="map-marker-alt" class="fa-fw" />
            <span v-if="user.info.publiclocation">
              <span v-if="user.info.publiclocation.location">
                {{ user.info.publiclocation.location }}, {{ $pluralize('mile', user.info.milesaway, true) }} away.
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
      <b-card border-variant="info" header-bg-variant="info" header-text-variant="white" class="mt-2">
        <template v-slot:header>
          <v-icon name="chart-bar" />
          <span v-if="user.info.offers + user.info.wanteds + user.info.replies > 0">Activity in the last 90 days</span>
          <span v-else>No recent activity.</span>
        </template>
        <b-card-body class="p-0 pt-1">
          <b-row v-if="user.info.offers + user.info.wanteds + user.info.replies > 0">
            <b-col cols="12" md="5">
              <v-icon name="gift" /> {{ $pluralize('recent OFFER', user.info.offers, true) }}
              <span v-if="user.info.openoffers" class="text-success font-weight-bold">
                ({{ user.info.openoffers }} still active)
              </span>
            </b-col>
            <b-col cols="12" md="5">
              <v-icon name="shopping-cart" /> {{ $pluralize('recent WANTED', user.info.wanteds, true) }}
              <span v-if="user.info.openwanteds" class="text-success font-weight-bold">
                ({{ user.info.wanteds }} still active)
              </span>
            </b-col>
            <b-col cols="12" md="2">
              <v-icon name="envelope" /> {{ $pluralize('reply', user.info.replies, true) }}
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <span v-if="user.info.collected">
                <v-icon name="check" /> Picked up about {{ $pluralize('item', user.info.collected, true) }}
              </span>
              <span v-else>
                <v-icon name="check" class="text-faded" />&nbsp;Not received any items recently, so far as we know.
              </span>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </template>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <b-button variant="white" @click="cancel">
        Close
      </b-button>
      <b-btn variant="primary" :to="'/profile/' + user.id">
        View full profile
      </b-btn>
    </template>
  </b-modal>
</template>

<script>
import twem from '~/assets/js/twem'
import ProfileHeader from '~/components/ProfileHeader'

const ReplyTime = () => import('~/components/ReplyTime')
const NoticeMessage = () => import('~/components/NoticeMessage')

export default {
  components: {
    ReplyTime,
    NoticeMessage,
    ProfileHeader
  },
  props: {
    id: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data: function() {
    return {
      showModal: false
    }
  },
  computed: {
    user() {
      const ret = this.id ? this.$store.getters['user/get'](this.id) : null
      return ret
    },
    aboutme() {
      return this.user && this.user.info && this.user.info.aboutme
        ? twem.twem(this.$twemoji, this.user.info.aboutme.text)
        : null
    }
  },
  async mounted() {
    // Components can't use asyncData, so we fetch here.  Can't do this for SSR, but that's fine as we don't
    // need to render this pane on the server.
    await this.$store.dispatch('user/fetch', {
      id: this.id,
      info: true
    })
  },
  methods: {
    show() {
      this.showModal = true
    },

    hide() {
      this.showModal = false
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

::v-deep .media .align-self-start {
  margin-right: 0.25rem !important;
}

::v-deep .modal-header {
  padding: 0px;
}

.coverphoto {
  min-height: 100px !important;
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
</style>
