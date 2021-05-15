<template>
  <div :id="'msg-' + id" class="position-relative ml-md-2 mr-md-2 ml-sm-0 mr-sm-0">
    <span ref="breakpoint" class="d-inline d-sm-none" />
    <MessageAttachments
      :id="id"
      :attachments="message.attachments"
      class="image-wrapper"
      :disabled="message.successful"
    />
    <div class="d-flex mb-1 mt-2 justify-content-between p-2 p-md-0">
      <div>
        <MessageItemLocation :id="id" :matchedon="message.matchedon" class="mb-1 header-title" :type="message.type" :expanded="true" />
        <MessageActions v-if="!simple && actions" :id="id" />
      </div>
      <MessageHistoryExpanded :id="id" class="mb-1 d-none d-md-block" />
    </div>
    <div class="bg-white mb-3 p-2 p-md-0">
      <MessagePromised v-if="message.promised && replyable" class="mb-3 mt-1" />
      <MessageTextBody :id="id" />
      <MessageReplyInfo :message="message" />
      <MessageMap v-if="showMap && validPosition" :home="home" :position="{ lat: message.lat, lng: message.lng }" class="mt-2" :height="150" />
      <MessageHistoryExpanded :id="id" class="d-block d-md-none" />
      <MessageReplySection v-if="replyable" :id="id" class="mt-3" />
    </div>
  </div>
</template>

<script>
// Need to import rather than async otherwise the render doesn't happen and ref isn't set.
import Vue from 'vue'
import { TooltipPlugin } from 'bootstrap-vue'
import waitForRef from '@/mixins/waitForRef'
import MessagePromised from '@/components/MessagePromised'
import MessageActions from '@/components/MessageActions'
import MessageTextBody from '@/components/MessageTextBody'

import MessageMap from '@/components/MessageMap'
import MessageReplyInfo from './MessageReplyInfo'
import MessageItemLocation from '~/components/MessageItemLocation'
import MessageAttachments from '~/components/MessageAttachments'

const MessageHistoryExpanded = () =>
  import('~/components/MessageHistoryExpanded')
const MessageReplySection = () => import('~/components/MessageReplySection')

Vue.use(TooltipPlugin)

export default {
  components: {
    MessageMap,
    MessageTextBody,
    MessageActions,
    MessagePromised,
    MessageItemLocation,
    MessageAttachments,
    MessageReplyInfo,
    MessageHistoryExpanded,
    MessageReplySection
  },
  mixins: [waitForRef],
  props: {
    id: {
      type: Number,
      required: true
    },
    showMap: {
      type: Boolean,
      required: false,
      default: true
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
  computed: {
    message() {
      return this.$store.getters['messages/get'](this.id)
    },
    validPosition() {
      return this.message.lat || this.message.lng
    },
    home() {
      let ret = null

      if (this.me && this.me.settings && this.me.settings.mylocation) {
        ret = {
          lat: this.me.settings.mylocation.lat,
          lng: this.me.settings.mylocation.lng
        }
      }

      return ret
    },
    replyToSend() {
      let ret = null
      const me = this.$store.getters['auth/user']

      if (me) {
        ret = this.$store.getters['reply/get']
      }

      return ret
    },
    position() {
      let ret = null

      if (this.message) {
        if (this.message.location) {
          // This is what we put in for message submitted on FD.
          ret = this.message.location
        } else if (this.message.lat || this.message.lng) {
          // This happens for TN messages
          ret = {
            lat: this.message.lat,
            lng: this.message.lng
          }
        }
      }

      return ret
    }
  },
  methods: {
    sm() {
      // Detect breakpoint by checking computing style of an element which uses the bootstrap classes
      let ret = false

      if (process.client) {
        const el = this.$refs.breakpoint
        if (el) {
          const display = getComputedStyle(el, null).display

          if (display === 'none') {
            ret = true
          }
        }
      }

      return ret
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.header--size4 {
  color: $colour-info-fg !important;
  font-weight: bold;
}

/deep/ label {
  font-weight: bold;
}

.image-wrapper {
  position: relative;
}
</style>
