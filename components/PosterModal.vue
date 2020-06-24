<template>
  <b-modal
    id="posterAddModal"
    ref="posterAddModal"
    v-model="showModal"
    title="Thanks!"
    no-stacking
    visible
    size="lg"
  >
    <notice-message class="mb-3">
      Sorry, we've had to disable the map temporarily for cost reasons.
      <!--      Please drag the map until the marker shows where the poster is.-->
    </notice-message>
    <!--    TODO MAPS-->
    <DraggableMap v-if="false" ref="map" :initial-zoom="7" class="mb-2" />
    <h4>Please add more info</h4>
    <b-input
      v-model="name"
      placeholder="Where is it?  E.g. village green, supermarket, name of cafe..."
      size="60"
      maxlength="60"
      spellcheck="true"
      class="mb-1"
    />
    <b-textarea v-model="description" rows="5" max-rows="8" placeholder="Anything else we need to know?  Need to ask permission? If it's locked, how do you get access?" />
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <b-button variant="white" @click="cancel">
        Cancel
      </b-button>
      <b-button variant="primary" @click="submit">
        Save details
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import DraggableMap from './DraggableMap'
const NoticeMessage = () => import('~/components/NoticeMessage')

export default {
  components: {
    DraggableMap,
    NoticeMessage
  },
  data: function() {
    return {
      showModal: false,
      name: null,
      description: null
    }
  },

  methods: {
    show() {
      this.showModal = true
    },
    hide() {
      this.showModal = false
    },
    async submit() {
      if (this.name) {
        const cent = this.$refs.map.getCenter()

        // There's a server oddity which means we need to add this and then edit in the name/description.
        const id = await this.$store.dispatch('noticeboards/add', {
          lat: cent.lat(),
          lng: cent.lng()
        })

        if (id) {
          await this.$store.dispatch('noticeboards/edit', {
            id: id,
            name: this.name,
            description: this.description
          })

          this.name = null
          this.description = null
        }

        this.hide()
      }
    }
  }
}
</script>
