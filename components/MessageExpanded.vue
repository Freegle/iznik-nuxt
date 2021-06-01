<template>
  <div v-if="message" :id="'msg-' + id" class="position-relative">
    <MessageAttachments
      v-if="gotAttachments"
      :id="id"
      :message-override="messageOverride"
      :attachments="message.attachments"
      class="image-wrapper"
      :disabled="message.successful"
      show-zoom
      @zoom="$emit('zoom')"
    />
    <div class="d-flex mb-1 mt-2 justify-content-between p-2 p-md-0">
      <div class="d-flex flex-column justify-content-between w-100">
        <div v-if="!gotAttachments" class="d-flex">
          <MessageTag
            :id="id"
            def
            inline
            :message-override="messageOverride"
            class="pl-2 pr-2"
          />
        </div>
        <MessageItemLocation
          :id="id"
          :message-override="messageOverride"
          :matchedon="message.matchedon"
          class="mb-1 header-title flex-grow-1"
          :type="message.type"
          :expanded="true"
        />
        <MessageActions v-if="!simple && actions" :id="id" :message-override="messageOverride" />
      </div>
      <MessageHistoryExpanded :id="id" :message-override="messageOverride" class="mb-1 d-none d-md-block" />
    </div>
    <div class="bg-white mb-3 p-2 p-md-0">
      <MessagePromised v-if="message.promised && replyable" class="mb-3 mt-1" />
      <MessageTextBody :id="id" :message-override="messageOverride" />
      <MessageReplyInfo :message="message" />
      <client-only>
        <MessageMap v-if="showMap && validPosition" :home="home" :position="{ lat: message.lat, lng: message.lng }" class="mt-2" :height="150" />
      </client-only>
      <MessageHistoryExpanded :id="id" :message-override="messageOverride" class="d-block d-md-none mt-2 mt-md-0 " />
      <MessageReplySection
        v-if="replyable"
        :id="id"
        :message-override="messageOverride"
        class="mt-3"
        @close="$emit('close')"
        @sent="$emit('close')"
      />
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
import MessageTag from '@/components/MessageTag'
import MessageReplyInfo from './MessageReplyInfo'
import MessageItemLocation from '~/components/MessageItemLocation'
import MessageAttachments from '~/components/MessageAttachments'

const MessageHistoryExpanded = () =>
  import('~/components/MessageHistoryExpanded')
const MessageReplySection = () => import('~/components/MessageReplySection')

Vue.use(TooltipPlugin)

export default {
  components: {
    MessageTag,
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
    messageOverride: {
      type: Object,
      required: false,
      default: null
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
      return (
        this.messageOverride ?? this.$store.getters['messages/get'](this.id)
      )
    },
    gotAttachments() {
      return (
        this.message &&
        this.message.attachments &&
        this.message.attachments.length
      )
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
