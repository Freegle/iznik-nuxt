<template>
  <div>
    <chat-message-text v-if="chatmessage.type === 'Default'" :chat="chat" :chatmessage="chatmessage" :me="me" :otheruser="otheruser" />
    <chat-message-image v-else-if="chatmessage.type === 'Image'" :chat="chat" :chatmessage="chatmessage" :me="me" :otheruser="otheruser" />
    <chat-message-interested v-else-if="chatmessage.type === 'Interested'" :chat="chat" :chatmessage="chatmessage" :me="me" :otheruser="otheruser" />
    <chat-message-completed v-else-if="chatmessage.type === 'Completed'" :chat="chat" :chatmessage="chatmessage" :me="me" :otheruser="otheruser" />
    <div v-else>
      Unknown chat message type {{ chatmessage.type }}
    </div>
    <chat-message-date-read :chatmessage="chatmessage" />
  </div>
</template>
<style scoped>
</style>
<script>
// TODO Other chat message types
// const TYPE_MODMAIL = 'ModMail';
// const TYPE_SYSTEM = 'System';
// const TYPE_PROMISED = 'Promised';
// const TYPE_RENEGED = 'Reneged';
// const TYPE_REPORTEDUSER = 'ReportedUser';
// const TYPE_ADDRESS = 'Address';
// const TYPE_NUDGE = 'Nudge';
// const TYPE_SCHEDULE = 'Schedule';
// const TYPE_SCHEDULE_UPDATED = 'ScheduleUpdated';

import ChatMessageText from './ChatMessageText'
import ChatMessageImage from './ChatMessageImage'
import ChatMessageInterested from './ChatMessageInterested'
import ChatMessageCompleted from './ChatMessageCompleted'
import ChatMessageDateRead from './ChatMessageDateRead'

export default {
  components: {
    ChatMessageText,
    ChatMessageImage,
    ChatMessageInterested,
    ChatMessageCompleted,
    ChatMessageDateRead
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
