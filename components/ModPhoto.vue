<template>
  <span class="clickme">
    <PostPhoto
      v-bind="attachment"
      @remove="removePhoto"
      @click="zoom = true"
    />
    <b-modal
      :id="'photoModal-' + attachment.id"
      ref="photoModal"
      v-model="zoom"
      :title="message.subject"
      size="lg"
      no-stacking
      ok-only
    >
      <template slot="default">
        <PostPhoto
          v-bind="attachment"
          :thumbnail="false"
          @remove="removePhoto"
        />
      </template>
      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <b-button variant="white" @click="cancel">
          Close
        </b-button>
      </template>
    </b-modal>
  </span>
</template>
<script>
import PostPhoto from './PostPhoto'

export default {
  components: { PostPhoto },
  props: {
    attachment: {
      type: Object,
      required: true
    },
    message: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      zoom: false
    }
  },
  methods: {
    async removePhoto(id) {
      const attachments = []

      this.message.attachments.forEach(a => {
        if (a.id !== id) {
          attachments.push(a.id)
        }
      })

      await this.$store.dispatch('messages/patch', {
        id: this.message.id,
        attachments: attachments
      })
    }
  }
}
</script>
<style scoped>
.square {
  object-fit: cover;
  max-width: 200px;
  min-width: 200px;
  min-height: 200px;
  max-height: 200px;
  width: 200px;
  height: 200px;
}

::v-deep img {
  width: 100%;
}
</style>
