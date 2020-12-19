<template>
  <div>
    <b-card variant="white" no-body>
      <b-card-body class="p-0">
        <div class="p-1">
          <div class="d-flex align-items-start justify-content-between">
            <h2 class="header--size4">
              <nuxt-link :to="link" class="title__link">
                <v-icon :name="iconName" scale="2" /> {{ title }}
              </nuxt-link>
            </h2>
            <b-btn variant="primary" :aria-label="addButtonLabel" @click="showEventModal">
              <v-icon name="plus" /> Add
            </b-btn>
          </div>
          <div v-if="items.length">
            <p class="text-center small">
              {{ itemDescription }}
            </p>
            <div v-for="item in items" :key="itemKey + item.id" class="">
              <component :is="featureComponent" v-if="!item.pending" :summary="true" :item="item" />
            </div>
          </div>
          <p v-else class="text-center p-1">
            {{ noItemsMessage }}
          </p>
        </div>
      </b-card-body>
    </b-card>
    <component :is="addEventModalComponent" v-if="showAdd" ref="eventmodal" :start-edit="true" />
  </div>
</template>

<script>
import waitForRef from '@/mixins/waitForRef'
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
  mixins: [waitForRef],
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
    featureComponent: {
      type: String,
      required: true
    },
    addEventModalComponent: {
      type: String,
      required: true
    },
    itemKey: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      showAdd: false
    }
  },
  methods: {
    showEventModal() {
      this.showAdd = true
      this.waitForRef('eventmodal', () => {
        this.$refs.eventmodal.show()
      })
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
