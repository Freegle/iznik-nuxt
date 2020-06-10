<template>
  <div>
    <b-card variant="success" no-body>
      <b-card-title class="bg-info pl-2 mb-0 pt-2 pb-2 text-truncate">
        <nuxt-link :to="'/volunteering/' + volunteering.id" class="volunteerop__link">
          <span v-if="!summary" class="float-right small text-muted">
            #{{ volunteering.id }}
          </span>
          <span v-else>
            {{ volunteering.title }}
          </span>
        </nuxt-link>
      </b-card-title>
      <b-card-body class="p-1 pt-0">
        <div v-if="mine && !renewed && !summary">
          <notice-message v-if="warning" variant="warning" class="mb-1">
            <span v-if="volunteering.expired">
              We've stopped showing this opportunity, but you can reactivate it.
            </span>
            <span v-else>
              We'll stop showing this opportunity soon unless you tell us it's still active.  Please click to let us
              know.
            </span>
          </notice-message>
          <notice-message v-else class="mb-1">
            <span v-if="volunteering.expired">
              We've stopped showing this opportunity, but you can reactivate it.
            </span>
            <span v-else>
              You created this opportunity.  Please click to let us know if it's still active.
            </span>
          </notice-message>
          <b-btn variant="primary" @click="renew">
            <v-icon name="check" /> Yes, it's still active
          </b-btn>
          <b-btn variant="white" @click="expire">
            <v-icon name="trash-alt" /> No, please remove it
          </b-btn>
        </div>
        <div v-if="summary">
          <div class="media clickme">
            <div class="media-left">
              <div class="media-object pl-1 text-muted">
                <v-icon name="info-circle" class="fa-fw" />
              </div>
            </div>
            <div class="media-body ml-2 text-truncate">
              {{ volunteering.description }}
            </div>
          </div>
          <div v-if="volunteering.earliestDate" class="media clickme">
            <div class="media-left">
              <div class="media-object pl-1 text-muted">
                <v-icon name="clock" class="fa-fw" />
              </div>
            </div>
            <div class="media-body ml-2">
              {{ volunteering.earliestDate.string.start }} - {{ volunteering.earliestDate.string.end }}
            </div>
          </div>
          <div class="media clickme">
            <div class="media-left">
              <div class="media-object pl-1 text-muted">
                <v-icon name="map-marker-alt" class="fa-fw" />
              </div>
            </div>
            <div class="media-body ml-2 small">
              {{ volunteering.location }}
            </div>
          </div>
          <div class="text-center mt-2 mb-2">
            <b-btn variant="white" size="sm" @click="showOpportunityModal">
              <v-icon name="info-circle" /> More info
            </b-btn>
          </div>
          <b-img-lazy v-if="volunteering.photo" class="w-100" :src="volunteering.photo.path" />
          <div v-if="volunteering.groups && volunteering.groups.length > 0" class="small text-muted text-center">
            Posted on {{ volunteering.groups[0].namedisplay }}
          </div>
        </div>
        <div v-else>
          <b-row>
            <b-col cols="12" :md="volunteering.photo ? 6 : 12">
              <div v-if="volunteering.earliestDate" class="media clickme">
                <div class="media-left">
                  <div class="media-object pl-1 text-muted">
                    <v-icon name="clock" class="fa-fw" />
                  </div>
                </div>
                <div class="media-body ml-2">
                  {{ volunteering.earliestDate.string.start }} - {{ volunteering.earliestDate.string.end }}
                </div>
              </div>
              <div class="media clickme">
                <div class="media-left">
                  <div class="media-object pl-1 text-muted">
                    <v-icon name="map-marker-alt" class="fa-fw" />
                  </div>
                </div>
                <div class="media-body ml-2 small">
                  {{ volunteering.location }}
                </div>
              </div>
              <div v-if="volunteering.groups && volunteering.groups.length > 0" class="media clickme">
                <div class="media-left">
                  <div class="media-object pl-1 text-muted">
                    <v-icon name="users" class="fa-fw" />
                  </div>
                </div>
                <div class="media-body ml-2 small">
                  Posted on {{ volunteering.groups[0].namedisplay }}
                </div>
              </div>
              <read-more v-if="description" :text="description" :max-chars="300" class="ml-1 font-weight-bold preline forcebreak nopara" />
              <div class="mt-2 mb-2 ml-1">
                <b-btn variant="white" @click="showOpportunityModal">
                  <v-icon name="info-circle" /> More info
                </b-btn>
              </div>
            </b-col>
            <b-col>
              <b-img-lazy
                v-if="volunteering.photo"
                :src="volunteering.photo.path"
                rounded
                thumbnail
                class="square float-right"
                generator-unable-to-provide-required-alt=""
                title="Opportunity photo"
              />
            </b-col>
          </b-row>
        </div>
      </b-card-body>
    </b-card>
    <VolunteerOpportunityModal ref="opportunitymodal" :volunteering="volunteering" />
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
    volunteering: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      renewed: false
    }
  },
  computed: {
    description() {
      let desc = this.volunteering.description
      desc = desc ? twem.twem(this.$twemoji, desc) : ''
      desc = desc.trim()
      return desc
    },
    warning() {
      const added = new Date(this.volunteering.added).getTime()
      const renewed = new Date(this.volunteering.renewed).getTime()
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
      return me && this.volunteering.user.id === me.id
    }
  },
  methods: {
    showOpportunityModal() {
      this.$refs.opportunitymodal.show()
    },
    async renew() {
      await this.$store.dispatch('volunteerops/renew', {
        id: this.volunteering.id
      })
      this.renewed = true
    },
    expire() {
      this.$store.dispatch('volunteerops/expire', {
        id: this.volunteering.id
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.square {
  object-fit: cover;
  width: 200px;
  height: 200px;
}

.volunteerop__link {
  color: $color-blue--2;
}
</style>
