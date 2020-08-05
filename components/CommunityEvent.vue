<template>
  <div>
    <b-card variant="success" no-body>
      <b-card-title class="bg-info px-2 mb-0 pt-2 pb-2 text-truncate d-flex justify-content-between header--size4" :title-tag="titleTag">
        <nuxt-link :to="'/communityevent/' + item.id" class="event__link">
          {{ item.title }}
        </nuxt-link>
        <nuxt-link v-if="!summary" :to="'/communityevent/' + item.id" class="event__link small text-muted">
          #{{ item.id }}
        </nuxt-link>
      </b-card-title>
      <b-card-body class="p-1 pt-0">
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
            <b-btn variant="white" size="sm" :aria-label="'More info about ' + item.title + ' event'" @click="showEventModal">
              <v-icon name="info-circle" /> More info
            </b-btn>
          </div>
          <b-img-lazy v-if="item.photo" class="w-100" :src="item.photo.path" />
          <div v-if="item.groups && item.groups.length > 0" class="small text-muted text-center">
            Posted on {{ item.groups[0].namedisplay }}
          </div>
        </div>
        <div v-else class="event">
          <div class="event__body">
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
            <div class="media">
              <div class="media-left">
                <div class="media-object pl-1 text-muted">
                  <v-icon name="users" class="fa-fw" />
                </div>
              </div>
              <div v-if="item.groups && item.groups.length > 0" class="media-body ml-2 small">
                Posted on {{ item.groups[0].namedisplay }}
              </div>
            </div>
            <read-more v-if="description" :text="description" :max-chars="300" class="ml-1 font-weight-bold preline forcebreak nopara" />
            <div class="mt-2 mb-2 ml-1">
              <b-btn variant="white" :aria-label="'More info about ' + item.title + ' event'" @click="showEventModal">
                <v-icon name="info-circle" /> More info
              </b-btn>
            </div>
          </div>
          <b-img-lazy
            v-if="item.photo"
            :src="item.photo.path"
            rounded
            thumbnail
            class="square float-right"
            generator-unable-to-provide-required-alt=""
            title="Event photo"
          />
        </div>
      </b-card-body>
    </b-card>
    <CommunityEventModal ref="eventmodal" :event="item" />
  </div>
</template>

<script>
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
    return {}
  },
  computed: {
    description() {
      let desc = this.item.description
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

.event__link {
  color: $color-blue--2;
}

.event {
  display: flex;
  flex-direction: column;

  @include media-breakpoint-up(sm) {
    flex-direction: row;
  }
}

.event__body {
  flex-grow: 1;
}
</style>
