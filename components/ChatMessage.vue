<template>
  <div>
    <chat-message-text v-if="chatmessage.type === 'Default'" :chat="chat" :chatmessage="chatmessage" :me="me" :otheruser="otheruser" />
    <chat-message-image v-else-if="chatmessage.type === 'Image'" :chat="chat" :chatmessage="chatmessage" :me="me" :otheruser="otheruser" />
    <chat-message-interested v-else-if="chatmessage.type === 'Interested'" :chat="chat" :chatmessage="chatmessage" :me="me" :otheruser="otheruser" />
    <chat-message-completed v-else-if="chatmessage.type === 'Completed'" :chat="chat" :chatmessage="chatmessage" :me="me" :otheruser="otheruser" />
    <chat-message-promised v-else-if="chatmessage.type === 'Promised'" :chat="chat" :chatmessage="chatmessage" :me="me" :otheruser="otheruser" />
    <chat-message-reneged v-else-if="chatmessage.type === 'Reneged'" :chat="chat" :chatmessage="chatmessage" :me="me" :otheruser="otheruser" />
    <chat-message-address v-else-if="chatmessage.type === 'Address'" :chat="chat" :chatmessage="chatmessage" :me="me" :otheruser="otheruser" />
    <chat-message-nudge v-else-if="chatmessage.type === 'Nudge'" :chat="chat" :chatmessage="chatmessage" :me="me" :otheruser="otheruser" />
    <chat-message-mod-mail v-else-if="chatmessage.type === 'ModMail'" :chat="chat" :chatmessage="chatmessage" :me="me" :otheruser="null" />
    <div v-else>
      Unknown chat message type {{ chatmessage.type }}
    </div>
    <chat-message-date-read :chatmessage="chatmessage" :last="last" />
  </div>
</template>
<style scoped>
</style>
<script>
// TODO EH Other chat message types
// const TYPE_SYSTEM = 'System';
// const TYPE_REPORTEDUSER = 'ReportedUser';
// const TYPE_SCHEDULE = 'Schedule';
// const TYPE_SCHEDULE_UPDATED = 'ScheduleUpdated';

// Don't use dynamic imports because it stops us being able to scroll to the bottom after render.

import ChatMessageText from './ChatMessageText'
import ChatMessageImage from './ChatMessageImage'
import ChatMessageInterested from './ChatMessageInterested'
import ChatMessageCompleted from './ChatMessageCompleted'
import ChatMessagePromised from './ChatMessagePromised'
import ChatMessageReneged from './ChatMessageReneged'
import ChatMessageAddress from './ChatMessageAddress'
import ChatMessageNudge from './ChatMessageNudge'
import ChatMessageDateRead from './ChatMessageDateRead'
import ChatMessageModMail from './ChatMessageModMail'

export default {
  components: {
    ChatMessageDateRead,
    ChatMessageText,
    ChatMessageImage,
    ChatMessageInterested,
    ChatMessageCompleted,
    ChatMessagePromised,
    ChatMessageAddress,
    ChatMessageReneged,
    ChatMessageNudge,
    ChatMessageModMail
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
      required: true,
      validator: prop => typeof prop === 'object' || prop === null
    },
    last: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {}
}
</script>
