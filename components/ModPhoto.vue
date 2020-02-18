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
        <b-img fluid :src="attachment.path" />
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
    removePhoto(id) {
      this.$store.dispatch('compose/removeAttachment', {
        id: this.id,
        photoid: id
      })
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
