<template>
  <div>
    <client-only>
      <b-modal
        id="messagemodal"
        v-model="showModal"
        size="lg"
        hide-header
        hide-footer
        @shown="shown"
      >
        <template slot="modal-title" />
        <template slot="default">
          <MessageExpanded :id="id" :replyable="replyable" :hide-close="hideClose" :actions="actions" :show-map="modalShown" />
        </template>
        <template slot="modal-footer" slot-scope="{ ok, cancel }">
          <b-button variant="white" @click="cancel">
            Close
          </b-button>
        </template>
      </b-modal>
    </client-only>
  </div>
</template>
<script>
import modal from '@/mixins/modal'
import MessageExpanded from '@/components/MessageExpanded'

export default {
  components: { MessageExpanded },
  mixins: [modal],
  props: {
    id: {
      type: Number,
      required: true
    },
    hideClose: {
      type: Boolean,
      required: false,
      default: false
    },
    replyable: {
      type: Boolean,
      required: false,
      default: true
    },
    actions: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data: function() {
    return {
      modalShown: false
    }
  },
  methods: {
    show() {
      this.showModal = true
    },
    shown() {
      // We need to kick the Message component to show the map once the modakl has been shown, else it doesn't
      // render correctly.
      setTimeout(() => {
        this.modalShown = true
      }, 100)
    }
  }
}
</script>
