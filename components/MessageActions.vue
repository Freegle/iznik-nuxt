<template>
  <div class="d-flex mt-1 justify-content-between">
    <div class="flex-grow-1">
      <b-btn
        v-if="message.groups && message.groups.length"
        variant="link"
        class="grey p-0 mr-4"
        size="sm"
        @click="report"
      >
        Report this post
      </b-btn>
      <b-btn
        variant="link"
        class="p-0 grey"
        title="Share"
        size="sm"
        @click="share"
      >
        Share
      </b-btn>
    </div>
    <b-btn variant="link" class="p-0 text-faded mr-2" size="sm" target="_blank" :to="'/message/' + message.id">
      <v-icon name="hashtag" scale="0.8" />{{ message.id }}
    </b-btn>
    <ShareModal v-if="message.url" :id="message.id" ref="shareModal" />
    <MessageReportModal ref="reportModal" :message="message" />
  </div>
</template>
<script>
import ShareModal from '@/components/ShareModal'
import MessageReportModal from '@/components/MessageReportModal'

export default {
  components: { MessageReportModal, ShareModal },
  props: {
    id: {
      type: Number,
      required: true
    },
    messageOverride: {
      type: Object,
      required: false,
      default: null
    }
  },
  computed: {
    message() {
      return (
        this.messageOverride ?? this.$store.getters['messages/get'](this.id)
      )
    }
  },
  methods: {
    share() {
      this.$refs.shareModal.show()
    },
    report() {
      this.$refs.reportModal.show()
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.grey {
  color: $color-gray--base;
}
</style>
