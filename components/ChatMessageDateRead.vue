<template>
  <b-row v-if="!chatmessage.sameasnext || last" class="text-muted small">
    <b-col v-if="chatmessage.userid !== me.id">
      <span class="chat__dateread--theirs">
        {{ chatmessage.date | timeago }}
      </span>
      <b-badge v-if="chatmessage.replyexpected && !chatmessage.replyreceived" variant="danger">
        RSVP - reply expected
      </b-badge>
    </b-col>
    <b-col v-else>
      <span class="float-right chat__dateread--mine">
        <v-icon v-if="chatmessage.seenbyall" name="check" class="text-success" />
        <v-icon v-else-if="chatmessage.mailedtoall" name="envelope" />
        {{ chatmessage.date | timeago }}
        <b-badge v-if="chatmessage.replyexpected && !chatmessage.replyreceived" variant="info">
          RSVP - reply requested
        </b-badge>
      </span>
    </b-col>
  </b-row>
</template>

<script>
export default {
  props: {
    chatmessage: {
      type: Object,
      required: true
    },
    last: {
      type: Boolean,
      required: false,
      default: false
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
