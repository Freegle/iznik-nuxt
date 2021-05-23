<template>
  <div>
    <b-modal
      v-if="message"
      id="modEmailMessageModal"
      v-model="showModal"
      size="lg"
    >
      <template slot="modal-title" class="w-100">
        Message received by email
      </template>
      <template slot="default">
        <p>
          Sometimes messages which arrive by email aren't translated into Chat correctly.  Here you can see a bit
          more of the original email.
        </p>
        <b-tabs content-class="mt-3">
          <b-tab title="Pretty View" active>
            <Letter :html="html" :text="text" />
          </b-tab>
          <b-tab title="Raw Message Source">
            <NoticeMessage variant="info" class="mb-1">
              This is the raw email we received.  It may have had large attachments removed for space reasons.  The body
              of the email is sometimes encoded, and you might not be able to read it.  If you need help, ask on Tech.
            </NoticeMessage>
            <!-- eslint-disable-next-line-->
            <pre>{{ message.message }}</pre>
          </b-tab>
        </b-tabs>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="white" @click="cancel">
          Close
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import modal from '@/mixins/modal'

import Letter from 'vue-letter'
import { extract } from 'letterparser'
import NoticeMessage from './NoticeMessage'

export default {
  components: { NoticeMessage, Letter },
  mixins: [modal],
  props: {
    id: {
      type: Number,
      required: true
    },
    collection: {
      type: String,
      required: false,
      default: null
    }
  },
  computed: {
    message() {
      return this.$store.getters['messages/get'](this.id)
    },
    parsed() {
      return this.message ? extract(this.message.message) : null
    },
    text() {
      return this.parsed ? this.parsed.text : null
    },
    html() {
      return this.parsed ? this.parsed.html : null
    }
  },
  methods: {
    async show() {
      await this.$store.dispatch('messages/fetch', {
        id: this.id,
        messagehistory: true,
        collection: this.collection
      })

      this.showModal = true
    }
  }
}
</script>
