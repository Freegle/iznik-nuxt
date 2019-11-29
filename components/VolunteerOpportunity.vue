<template>
  <div>
    <b-card variant="success" no-body>
      <b-card-title class="bg-info pl-2 mb-0 pt-2 pb-2 text-truncate">
        {{ volunteering.title }}
      </b-card-title>
      <b-card-body class="p-1 pt-0">
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
          <b-img-lazy v-if="volunteering.photo" fluid :src="volunteering.photo.path" />
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
              <read-more v-if="description" :text="description" :max-chars="300" class="ml-1 font-weight-bold prewrap forcebreak nopara" />
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
                alt="Opportunity photo"
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
import twem from '~/assets/js/twem'

// TODO EH Button to reactivate ones which have expired.

export default {
  components: {
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
    return {}
  },
  computed: {
    description() {
      let desc = this.volunteering.description
      desc = desc ? twem.twem(this.$twemoji, desc) : ''
      desc = desc.trim()
      return desc
    }
  },
  methods: {
    showOpportunityModal() {
      this.$refs.opportunitymodal.show()
    }
  }
}
</script>
<style scoped>
.square {
  object-fit: cover;
  width: 200px;
  height: 200px;
}
</style>
