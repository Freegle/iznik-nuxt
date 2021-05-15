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
          <Message ref="message" :id="message.id" record-view />
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
import waitForRef from '@/mixins/waitForRef'
import Message from './Message'

export default {
  components: { Message },
  mixins: [waitForRef, modal],
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    message() {
      return this.$store.getters['messages/get'](this.id)
    }
  },
  methods: {
    show() {
      this.showModal = true
      this.waitForRef('message', () => {
        this.$refs.message.expand()
      })
    }
  }
}
</script>
