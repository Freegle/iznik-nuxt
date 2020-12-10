<template>
  <div>
    <b-card variant="success" no-body>
      <b-card-title class="bg-info px-2 mb-0 pt-2 pb-2 text-truncate d-flex justify-content-between header--size4" :title-tag="titleTag">
        <nuxt-link :to="'/volunteering/' + item.id" class="volunteerop__link">
          {{ item.title }}
        </nuxt-link>
        <nuxt-link v-if="!summary" :to="'/volunteering/' + item.id" class="volunteerop__link small text-muted">
          #{{ item.id }}
        </nuxt-link>
      </b-card-title>
      <b-card-body class="p-1 pt-0">
        <div v-if="mine && !renewed && !summary">
          <notice-message v-if="warning" variant="warning" class="mb-1">
            <span v-if="item.expired">
              We've stopped showing this opportunity, but you can reactivate it.
            </span>
            <span v-else>
              We'll stop showing this opportunity soon unless you tell us it's still active.  Please click to let us
              know.
            </span>
          </notice-message>
          <notice-message v-else class="mb-1">
            <span v-if="item.expired">
              We've stopped showing this opportunity, but you can reactivate it.
            </span>
            <span v-else>
              You created this opportunity.  Please click to let us know if it's still active.
            </span>
          </notice-message>
          <b-btn variant="primary" @click="renew">
            <v-icon name="check" /> Yes, it's still active
          </b-btn>
          <b-btn variant="secondary" @click="expire">
            <v-icon name="trash-alt" /> No, please remove it
          </b-btn>
        </div>
        <div v-if="summary">
          <div class="media">
            <div class="media-left">
              <div class="media-object pl-1 text-muted">
                <v-icon name="info-circle" class="fa-fw" />
              </div>
            </div>
            <div class="media-body ml-2 text-truncate">
              {{ item.description }}
            </div>
          </div>
          <div v-if="item.earliestDate" class="media">
            <div class="media-left">
              <div class="media-object pl-1 text-muted">
                <v-icon name="clock" class="fa-fw" />
              </div>
            </div>
            <div class="media-body ml-2">
              {{ item.earliestDate.string.start }} - {{ item.earliestDate.string.end }}
            </div>
          </div>
          <div class="media">
            <div class="media-left">
              <div class="media-object pl-1 text-muted">
                <v-icon name="map-marker-alt" class="fa-fw" />
              </div>
            </div>
            <div class="media-body ml-2 small">
              {{ item.location }}
            </div>
          </div>
          <div class="text-center mt-2 mb-2">
            <b-btn
              variant="secondary"
              size="sm"
              :aria-label="'More info about ' + item.title + ' volunteering opportunity'"
              @click="showOpportunityModal"
            >
              <v-icon name="info-circle" /> More info
            </b-btn>
          </div>
          <b-img-lazy v-if="item.photo" class="w-100" :src="item.photo.path" />
          <div v-if="item.groups && item.groups.length > 0" class="small text-muted text-center">
            Posted on {{ item.groups[0].namedisplay }}
          </div>
        </div>
        <div v-else class="volunteerop">
          <div class="volunteerop__body">
            <div v-if="item.earliestDate" class="media">
              <div class="media-left">
                <div class="media-object pl-1 text-muted">
                  <v-icon name="clock" class="fa-fw" />
                </div>
              </div>
              <div class="media-body ml-2">
                {{ item.earliestDate.string.start }} - {{ item.earliestDate.string.end }}
              </div>
            </div>
            <div class="media">
              <div class="media-left">
                <div class="media-object pl-1 text-muted">
                  <v-icon name="map-marker-alt" class="fa-fw" />
                </div>
              </div>
              <div class="media-body ml-2 small">
                {{ item.location }}
              </div>
            </div>
            <div v-if="item.groups && item.groups.length > 0" class="media">
              <div class="media-left">
                <div class="media-object pl-1 text-muted">
                  <v-icon name="users" class="fa-fw" />
                </div>
              </div>
              <div class="media-body ml-2 small">
                Posted on {{ item.groups[0].namedisplay }}
              </div>
            </div>
            <read-more v-if="description" :text="description" :max-chars="300" class="ml-1 font-weight-bold preline forcebreak nopara" />
            <div class="mt-2 mb-2 ml-1">
              <b-btn variant="secondary" :aria-label="'More info about ' + item.title + ' volunteering opportunity'" @click="showOpportunityModal">
                <v-icon name="info-circle" /> More info
              </b-btn>
            </div>
          </div>
          <b-img-lazy
            v-if="item.photo"
            :src="item.photo.path"
            rounded
            thumbnail
            class="square"
            generator-unable-to-provide-required-alt=""
            title="Opportunity photo"
          />
        </div>
      </b-card-body>
    </b-card>
    <VolunteerOpportunityModal ref="opportunitymodal" :volunteering="item" />
  </div>
</template>

<script>
import VolunteerOpportunityModal from './VolunteerOpportunityModal'
import NoticeMessage from './NoticeMessage'
import twem from '~/assets/js/twem'

export default {
  components: {
    NoticeMessage,
    VolunteerOpportunityModal
  },
  props: {
    summary: {
      type: Boolean,
      required: true
    },
    item: {
      type: Object,
      required: true
    },
    titleTag: {
      type: String,
      required: false,
      default: 'h3'
    }
  },
  data: function() {
    return {
      renewed: false
    }
  },
  computed: {
    description() {
      let desc = this.item.description
      desc = desc ? twem.twem(this.$twemoji, desc) : ''
      desc = desc.trim()
      return desc
    },
    warning() {
      const added = new Date(this.item.added).getTime()
      const renewed = new Date(this.item.renewed).getTime()
      const now = Date.now()

      let warn = false

      if (renewed) {
        warn = now - renewed > 31 * 24 * 60 * 60 * 1000
      } else {
        warn = now - added > 31 * 24 * 60 * 60 * 1000
      }

      return warn
    },
    mine() {
      const me = this.$store.getters['auth/user']
      return me && this.item.user.id === me.id
    }
  },
  methods: {
    showOpportunityModal() {
      this.$refs.opportunitymodal.show()
    },
    async renew() {
      await this.$store.dispatch('volunteerops/renew', {
        id: this.item.id
      })
      this.renewed = true
    },
    expire() {
      this.$store.dispatch('volunteerops/expire', {
        id: this.item.id
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.square {
  object-fit: cover;
  width: 200px;
  height: 200px;
}

.volunteerop__link {
  color: $color-blue--2;
}

.volunteerop {
  display: flex;
  flex-direction: column;

  @include media-breakpoint-up(sm) {
    flex-direction: row;
  }
}

.volunteerop__body {
  flex-grow: 1;
}
</style>
