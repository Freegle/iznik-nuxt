<template>
  <div class="d-flex mt-1">
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
    }
  },
  computed: {
    message() {
      return this.$store.getters['messages/get'](this.id)
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
