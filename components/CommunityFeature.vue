<template>
  <div>
    <b-card variant="white" no-body>
      <b-card-body class="p-0">
        <div class="px-1 pt-1">
          <div class="d-flex align-items-start justify-content-between">
            <h4>
              <nuxt-link :to="link" class="title__link">
                <v-icon :name="iconName" scale="2" /> {{ title }}
              </nuxt-link>
            </h4>
            <b-btn variant="white" :aria-label="addButtonLabel" @click="showEventModal">
              <v-icon name="plus" /> Add
            </b-btn>
          </div>
          <div v-if="items.length">
            <p class="text-center small">
              {{ itemDescription }}
            </p>
            <div v-for="item in items" :key="'event-' + item.id" class="">
              <component :is="addEventName" v-if="!item.pending && addEventName==='VolunteerOpportunity'" :summary="true" :volunteering="item" />
              <component :is="addEventName" v-if="!item.pending && addEventName==='CommunityEvent'" :summary="true" :event="item" />
            </div>
          </div>
          <p v-else class="text-center p-1">
            {{ noItemsMessage }}
          </p>
        </div>
      </b-card-body>
    </b-card>
    <component :is="addEventModalName" ref="eventmodal" :start-edit="true" />
  </div>
</template>

<script>
import CommunityEvent from './CommunityEvent'
import VolunteerOpportunity from './VolunteerOpportunity'
const CommunityEventModal = () => import('~/components/CommunityEventModal')
const VolunteerOpportunityModal = () =>
  import('~/components/VolunteerOpportunityModal')

export default {
  name: 'CommunityFeature',
  components: {
    CommunityEvent,
    VolunteerOpportunity,
    CommunityEventModal,
    VolunteerOpportunityModal
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    iconName: {
      type: String,
      required: true
    },
    addButtonLabel: {
      type: String,
      required: true
    },
    itemDescription: {
      type: String,
      required: true
    },
    noItemsMessage: {
      type: String,
      required: true
    },
    addEventName: {
      type: String,
      required: true
    },
    addEventModalName: {
      type: String,
      required: true
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

.title__link {
  color: $colour-header;
}
</style>
