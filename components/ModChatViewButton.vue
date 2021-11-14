<template>
  <div>
    <b-btn variant="white" class="mr-2 mb-1" @click="view">
      <v-icon name="comments" /> View Chat
    </b-btn>
    <ModChatModal v-if="showModal" :id="id" ref="modal" :pov="pov" />
  </div>
</template>
<script>
import ModChatModal from './ModChatModal'

export default {
  components: { ModChatModal },

  props: {
    id: {
      type: Number,
      required: true
    },
    pov: {
      type: Number,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      showModal: false
    }
  },
  methods: {
    view() {
      this.showModal = true

      this.waitForRef('modal', () => {
        this.$refs.modal.show()
      })
    }
  }
}
</script>
