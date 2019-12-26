<template>
  <div>
    <b-card variant="success" no-body>
      <b-card-title class="bg-info pl-2 mb-0 pt-2 pb-2 text-truncate">
        <nuxt-link :to="'/communityevent/' + event.id">
          <span v-if="!summary" class="float-right small text-muted">
            #{{ event.id }}
          </span>
        </nuxt-link>
        {{ event.title }}
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
              {{ event.description }}
            </div>
          </div>
          <div v-if="event.earliestDate" class="media clickme">
            <div class="media-left">
              <div class="media-object pl-1 text-muted">
                <v-icon name="clock" class="fa-fw" />
              </div>
            </div>
            <div class="media-body ml-2">
              {{ event.earliestDate.string.start }} - {{ event.earliestDate.string.end }}
            </div>
          </div>
          <div class="media clickme">
            <div class="media-left">
              <div class="media-object pl-1 text-muted">
                <v-icon name="map-marker-alt" class="fa-fw" />
              </div>
            </div>
            <div class="media-body ml-2 small">
              {{ event.location }}
            </div>
          </div>
          <div class="text-center mt-2 mb-2">
            <b-btn variant="white" size="sm" @click="showEventModal">
              <v-icon name="info-circle" /> More info
            </b-btn>
          </div>
          <b-img-lazy v-if="event.photo" class="w-100" :src="event.photo.path" />
          <div v-if="event.groups && event.groups.length > 0" class="small text-muted text-center">
            Posted on {{ event.groups[0].namedisplay }}
          </div>
        </div>
        <div v-else>
          <b-row>
            <b-col cols="12" :md="event.photo ? 6 : 12">
              <div v-if="event.earliestDate" class="media clickme">
                <div class="media-left">
                  <div class="media-object pl-1 text-muted">
                    <v-icon name="clock" class="fa-fw" />
                  </div>
                </div>
                <div class="media-body ml-2">
                  {{ event.earliestDate.string.start }} - {{ event.earliestDate.string.end }}
                </div>
              </div>
              <div class="media clickme">
                <div class="media-left">
                  <div class="media-object pl-1 text-muted">
                    <v-icon name="map-marker-alt" class="fa-fw" />
                  </div>
                </div>
                <div class="media-body ml-2 small">
                  {{ event.location }}
                </div>
              </div>
              <div class="media clickme">
                <div class="media-left">
                  <div class="media-object pl-1 text-muted">
                    <v-icon name="users" class="fa-fw" />
                  </div>
                </div>
                <div v-if="event.groups && event.groups.length > 0" class="media-body ml-2 small">
                  Posted on {{ event.groups[0].namedisplay }}
                </div>
              </div>
              <read-more v-if="description" :text="description" :max-chars="300" class="ml-1 font-weight-bold prewrap forcebreak nopara" />
              <div class="mt-2 mb-2 ml-1">
                <b-btn variant="white" @click="showEventModal">
                  <v-icon name="info-circle" /> More info
                </b-btn>
              </div>
            </b-col>
            <b-col>
              <b-img-lazy
                v-if="event.photo"
                :src="event.photo.path"
                rounded
                thumbnail
                class="square float-right"
                alt="Event photo"
                title="Event photo"
              />
            </b-col>
          </b-row>
        </div>
      </b-card-body>
    </b-card>
    <CommunityEventModal ref="eventmodal" :event="event" />
  </div>
</template>
<script>
import 'vue-awesome/icons/clock'
import 'vue-awesome/icons/map-marker-alt'
import 'vue-awesome/icons/users'
import CommunityEventModal from './CommunityEventModal'
import twem from '~/assets/js/twem'

export default {
  components: {
    CommunityEventModal
  },
  props: {
    summary: {
      type: Boolean,
      required: true
    },
    event: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {}
  },
  computed: {
    description() {
      let desc = this.event.description
      desc = desc ? twem.twem(this.$twemoji, desc) : ''
      desc = desc.trim()
      return desc
    }
  },
  methods: {
    showEventModal() {
      this.$refs.eventmodal.show()
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
