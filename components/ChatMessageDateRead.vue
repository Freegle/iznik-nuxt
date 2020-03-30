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
        <span v-else-if="chatmessage.mailedtoall" title="This message has been sent out by email from our system.">
          <v-icon name="envelope" />
        </span>
        <span v-else-if="mod && chat && chat.chattype === 'User2Mod' && otheruser && otheruser.settings && otheruser.settings.notifications && !otheruser.settings.notifications.email" title="This freegler normally has email notifications turned off.  We always email messages from mods though.">
          <v-icon name="envelope" class="text-danger" />
        </span>
        <span v-else title="This message has been delivered in Chat.  Depending on the other freegler's settings it may also be sent out by email soon - then this would turn into a little envelope.">
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
      <ModMessageEmailModal v-if="showOriginal" :id="chatmessage.bymailid" ref="original" />
    </b-col>
  </b-row>
</template>

<script>
import ChatBase from './ChatBase'
import waitForRef from '@/mixins/waitForRef'
const ModMessageEmailModal = () => import('~/components/ModMessageEmailModal')

export default {
  components: {
    ModMessageEmailModal
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
