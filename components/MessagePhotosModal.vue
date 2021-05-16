<template>
  <b-modal
    v-if="message"
    id="photoModal"
    v-model="showModal"
    :title="message.subject"
    size="lg"
    ok-only
  >
    <template slot="default">
      <ImageCarousel message-id="message.id" :attachments="message.attachments" />
    </template>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <b-button variant="secondary" @click="cancel">
        Close
      </b-button>
    </template>
  </b-modal>
</template>
<script>
import modal from '@/mixins/modal'
import ImageCarousel from '@/components/ImageCarousel'

export default {
  components: { ImageCarousel },
  mixins: [modal],
  props: {
    id: {
      type: Number,
      required: true
    },
    messageOverride: {
      type: Object,
      required: false,
      default: null
    }
  },
  computed: {
    message() {
      return (
        this.messageOverride ?? this.$store.getters['messages/get'](this.id)
      )
    }
  }
}
</script>
