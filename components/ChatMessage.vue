<template>
  <div>
    <chat-message-text v-if="chatmessage.type === 'Default'" :chat="chat" :chatmessage="chatmessage" :me="me" :otheruser="otheruser" />
    <chat-message-image v-else-if="chatmessage.type === 'Image'" :chat="chat" :chatmessage="chatmessage" :me="me" :otheruser="otheruser" />
    <div v-else>
      Unknown chat message type {{ chatmessage.type }}
    </div>
  </div>
</template>
<style scoped>
</style>
<script>
// TODO Other chat message types
// const TYPE_MODMAIL = 'ModMail';
// const TYPE_SYSTEM = 'System';
// const TYPE_INTERESTED = 'Interested';
// const TYPE_PROMISED = 'Promised';
// const TYPE_RENEGED = 'Reneged';
// const TYPE_REPORTEDUSER = 'ReportedUser';
// const TYPE_COMPLETED = 'Completed';
// const TYPE_ADDRESS = 'Address';
// const TYPE_NUDGE = 'Nudge';
// const TYPE_SCHEDULE = 'Schedule';
// const TYPE_SCHEDULE_UPDATED = 'ScheduleUpdated';

import ChatMessageText from './ChatMessageText'
import ChatMessageImage from './ChatMessageImage'

export default {
  components: {
    ChatMessageText,
    ChatMessageImage
  },
  props: {
    chat: {
      type: Object,
      required: true
    },
    chatmessage: {
      type: Object,
      required: true
    },
    me: {
      type: Object,
      required: true
    },
    otheruser: {
      type: Object,
      required: true
    }
  },
  methods: {}
}
</script>
