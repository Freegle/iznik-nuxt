<template>
  <b-modal
    v-if="id && user"
    id="profilemodal"
    v-model="showModal"
    size="lg"
    no-stacking
  >
    <template slot="modal-header">
      <div class="m-0 coverphoto">
        <b-media>
          <template slot="aside">
            <b-img lazy :src="user.profile.url" class="coverprofileimage" />
          </template>
          <b-media-body class="align-top">
            <h4 class="d-inline-block w-100 overflow-hidden">
              <span class="small">
                <span class="small text-faded float-right mr-1 d-none d-sm-inline-block">#{{ id }}</span>
              </span>
              {{ user.displayname }}
              <br>
              <div class="small">
                <span class="small">
                  Freegler since {{ user.added | dateonly }}.
                </span>
              </div>
              <span v-if="user.settings.showmod" class="small text-muted">
                <span class="small">
                  <v-icon name="leaf" /> Freegle Volunteer
                </span>
              </span>
              <ChatButton
                :userid="id"
                size="sm"
                title="Message"
                variant="white"
                :disabled="user.id === myid ? 'true' : undefined"
                class="mb-1 mt-1"
                @click="hide"
              />
              <ratings size="sm" v-bind="user" class="pt-1 mt-1" />
            </h4>
          </b-media-body>
        </b-media>
      </div>
    </template>
    <template slot="default">
      <notice-message v-if="userHasReneged" variant="warning">
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
      <b-card border-variant="info" header-bg-variant="info" header-text-variant="white" class="mt-2">
        <template v-slot:header>
          <v-icon name="chart-bar" />
          <span v-if="user.info.offers + user.info.wanteds + user.info.replies > 0">Activity in the last 90 days</span>
          <span v-else>No recent activity.</span>
        </template>
        <b-card-body class="p-0 pt-1">
          <b-row v-if="user.info.offers + user.info.wanteds + user.info.replies > 0">
            <b-col cols="12" md="5">
              <v-icon name="gift" /> {{ user.info.offers | pluralize([ 'recent OFFER', 'recent OFFERs' ], { includeNumber: true }) }}
              <span v-if="user.info.openoffers" class="text-success font-weight-bold">
                ({{ user.info.openoffers }} still active)
              </span>
            </b-col>
            <b-col cols="12" md="5">
              <v-icon name="search" /> {{ user.info.wanteds | pluralize([ 'recent WANTED', 'recent WANTEDs' ], { includeNumber: true }) }}
              <span v-if="user.info.openwanteds" class="text-success font-weight-bold">
                ({{ user.info.wanteds }} still active)
              </span>
            </b-col>
            <b-col cols="12" md="2">
              <v-icon name="envelope" /> {{ user.info.replies | pluralize([ 'reply', 'replies' ], { includeNumber: true }) }}
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <span v-if="user.info.collected">
                <v-icon name="check" /> Picked up about {{ user.info.collected | pluralize('item', { includeNumber: true }) }}
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
      <b-btn variant="success" :href="'/profile/' + user.id">
        View full profile
      </b-btn>
    </template>
  </b-modal>
</template>

<style scoped lang="scss">
@import 'color-vars';

::v-deep .media .align-self-start {
  margin-right: 0.25rem !important;
}

::v-deep .modal-header {
  padding: 0px;
}

.coverphoto {
  height: 100px !important;
  width: 100% !important;
  background-image: url('~static/wallpaper.png');
}

.coverprofilecircle {
  width: 100px;
  height: 100px;
  background-color: $color-gray--base;
  border-radius: 50%;
  /*margin: 10px;*/
}

.coverprofileimage {
  margin-top: 1px;
  margin-left: 1px;
  width: 98px;
  height: 98px;
  border-radius: 98px;
  border: 3px solid $color-white;
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

<script>
import 'vue-awesome/icons/chart-bar'
import 'vue-awesome/icons/map-marker-alt'
import twem from '~/assets/js/twem'

// TODO DESIGN Header is messy - wallpaper should fill the whole thing; image should have a border round it with a gap.
// TODO DESIGN The about me section needs nice big quotes round it.
const Ratings = () => import('~/components/Ratings')
const ReplyTime = () => import('~/components/ReplyTime')
const ChatButton = () => import('~/components/ChatButton.vue')
const NoticeMessage = () => import('~/components/NoticeMessage')

export default {
  components: {
    Ratings,
    ReplyTime,
    ChatButton,
    NoticeMessage
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
    myid() {
      const me = this.$store.getters['auth/auth']
      return me ? me.id : null
    },
    user() {
      const ret = this.id ? this.$store.getters['user/get'](this.id) : null
      return ret
    },
    aboutme() {
      return this.user && this.user.info && this.user.info.aboutme
        ? twem.twem(this.$twemoji, this.user.info.aboutme.text)
        : null
    },
    userHasReneged() {
      return this.$store.getters['user/userHasReneged'](this.id)
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
