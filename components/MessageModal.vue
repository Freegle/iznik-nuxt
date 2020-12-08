<template>
  <div>
    <client-only>
      <b-modal
        id="messagemodal"
        v-model="showModal"
        size="lg"
        no-stacking
      >
        <template slot="modal-title">
          {{ message.subject }}
        </template>
        <template slot="default">
          <Message ref="message" v-bind="message" record-view />
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
import Message from './Message'
import waitForRef from '@/mixins/waitForRef'

export default {
  components: { Message },
  mixins: [waitForRef],
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      showModal: false
    }
  },
  methods: {
    show() {
      this.showModal = true
      this.waitForRef('message', () => {
        this.$refs.message.expand()
      })
    },
    hide() {
      this.showModal = false
    }
  }
}
</script>
