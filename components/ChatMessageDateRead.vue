<template>
  <b-row v-if="!chatmessage.sameasnext || last" class="text-muted small">
    <b-col v-if="chatmessage.userid !== me.id">
      <span class="chat__dateread--theirs" :title="chatmessage.date | datetimeshort">
        {{ chatmessage.date | timeago }}
        <span v-if="chatmessage.bymailid" class="clickme" :title="'Received by email #' + chatmessage.bymailid + ' click to view'" @click="viewOriginal">
          <v-icon name="info-circle" />
        </span>
      </span>
      <b-badge v-if="chatmessage.replyexpected && !chatmessage.replyreceived" variant="danger">
        RSVP - reply expected
      </b-badge>
    </b-col>
    <b-col v-else>
      <span class="float-right chat__dateread--mine">
        <span v-if="chatmessage.seenbyall" title="This message has been read.">
          <v-icon name="check" class="text-success" />
        </span>
        <span v-else-if="chatmessage.mailedtoall" title="This message has been sent out by email.">
          <v-icon name="envelope" />
        </span>
        <span v-else-if="otheruser && otheruser.settings && otheruser.settings.notifications && !otheruser.settings.notifications.email" title="This freegler has email notifications turned off, so they will need to read this on the site.">
          <v-icon name="check" class="text-muted" />
        </span>
        <span v-else title="This message hasn't been read or sent by email yet - it will be soon">
          <v-icon name="check" class="text-muted" />
        </span>
        {{ chatmessage.date | timeago }}
        <span v-if="chatmessage.bymailid" class="clickme" :title="'Received by email #' + chatmessage.bymailid + ' click to view'" @click="viewOriginal">
          <v-icon name="info-circle" />
        </span>
        <b-badge v-if="chatmessage.replyexpected && !chatmessage.replyreceived" variant="info">
          RSVP - reply requested
        </b-badge>
      </span>
      <ModChatMessageEmailModal v-if="showOriginal" :id="chatmessage.bymailid" ref="original" />
    </b-col>
  </b-row>
</template>

<script>
import ChatBase from './ChatBase'
import waitForRef from '@/mixins/waitForRef'
const ModChatMessageEmailModal = () =>
  import('~/components/ModChatMessageEmailModal')

export default {
  components: {
    ModChatMessageEmailModal
  },
  extends: ChatBase,
  mixins: [waitForRef],
  data: function() {
    return {
      showOriginal: false
    }
  },
  methods: {
    viewOriginal() {
      this.showOriginal = true
      this.waitForRef('original', () => {
        this.$refs.original.show()
      })
    }
  }
}
</script>

<style scoped>
.chat__dateread--theirs {
  padding-left: 30px;
}

.chat__dateread--mine {
  padding-right: 30px;
}
</style>
