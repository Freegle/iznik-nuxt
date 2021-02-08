<template>
  <div>
    <b-modal
      :id="'photoModal-' + message.id"
      v-model="showModal"
      :title="subject"
      size="lg"
      no-stacking
      ok-only
    >
      <template slot="default">
        <ImageCarousel message-id="message.id" :attachments="message.attachments" />
      </template>
      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <b-button variant="white" @click="cancel">
          Close
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import modal from '@/mixins/modal'
const ImageCarousel = () => import('./ImageCarousel')

export default {
  components: { ImageCarousel },
  mixins: [modal],
  props: {
    message: {
      type: Object,
      required: true
    },
    subject: {
      type: String,
      required: true
    }
  }
}
</script>
