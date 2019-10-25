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
            <div class="float-right">
              <span class="small text-faded float-right">#{{ id }}</span>
              <br>
              <ChatButton
                :userid="id"
                size="sm"
                title="Message"
                variant="white"
                :disabled="user.id === myid ? 'true' : undefined"
                class="float-right mb-1"
                @click="hide"
              />
              <ratings size="sm" v-bind="user" class="pl-1 pt-1 d-block" />
            </div>
            <h4 class="d-inline-block">
              {{ user.displayname }}
              <br>
              <div class="text-muted small">
                <span class="glyphicon glyphicon-heart" /> Freegler since {{ user.added | dateonly }}.
              </div>
              <span v-if="user.settings.showmod" class="small text-muted">
                <span class="small">
                  <v-icon name="leaf" /> Freegle Volunteer
                </span>
              </span>
            </h4>
          </b-media-body>
        </b-media>
      </div>
    </template>
    <template slot="default">
      <b-alert v-if="user.info.reneged && user.info.reneged > 1 && (user.info.reneged * 100 / (user.info.reneged + user.info.collected) > 25)" variant="warning" show>
        <v-icon name="exclamation-triangle" />&nbsp;Things haven't always worked out for this freegler.  That might not be their fault, but please make very clear arrangements.
      </b-alert>
      <div v-if="user.info.aboutme && user.info.aboutme.text" class="mb-1">
        <blockquote>
          <b>&quot;{{ user.info.aboutme.text }}&quot;</b>
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
    </template>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <b-btn variant="success" :href="'/profile/' + user.id" class="mr-auto">
        <b-badge v-if="user.info.openoffers" variant="danger">
          {{ user.info.openoffers }}
          <v-icon name="gift" />
        </b-badge>
        <b-badge v-if="user.info.openwanteds" variant="danger">
          {{ user.info.wanteds }}
          <v-icon name="search" />
        </b-badge>
        View full profile
      </b-btn>

      <b-button variant="white" class="float-right" @click="cancel">
        Close
      </b-button>
    </template>
  </b-modal>
</template>

<style scoped lang="scss">
@import 'color-vars';

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
// TODO DESIGN Header is messy - wallpaper should fill the whole thing; image should have a border round it with a gap.
// TODO DESIGN The about me section needs nice big quotes round it.
const Ratings = () => import('~/components/Ratings')
const ReplyTime = () => import('~/components/ReplyTime')
const ChatButton = () => import('~/components/ChatButton.vue')

export default {
  components: {
    Ratings,
    ReplyTime,
    ChatButton
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
