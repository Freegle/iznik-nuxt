<template>
  <div>
    <chat-message-text v-if="chatmessage.type === 'Default'" :chat="chat" :chatmessage="chatmessage" :me="me" :otheruser="otheruser" />
    <chat-message-image v-else-if="chatmessage.type === 'Image'" :chat="chat" :chatmessage="chatmessage" :me="me" :otheruser="otheruser" />
    <chat-message-interested v-else-if="chatmessage.type === 'Interested'" :chat="chat" :chatmessage="chatmessage" :me="me" :otheruser="otheruser" />
    <chat-message-completed v-else-if="chatmessage.type === 'Completed'" :chat="chat" :chatmessage="chatmessage" :me="me" :otheruser="otheruser" />
    <chat-message-promised v-else-if="chatmessage.type === 'Promised'" :chat="chat" :chatmessage="chatmessage" :me="me" :otheruser="otheruser" />
    <chat-message-reneged v-else-if="chatmessage.type === 'Reneged'" :chat="chat" :chatmessage="chatmessage" :me="me" :otheruser="otheruser" />
    <chat-message-address v-else-if="chatmessage.type === 'Address'" :chat="chat" :chatmessage="chatmessage" :me="me" :otheruser="otheruser" />
    <div v-else>
      Unknown chat message type {{ chatmessage.type }}
    </div>
    <chat-message-date-read :chatmessage="chatmessage" :last="last" />
  </div>
</template>
<style scoped>
</style>
<script>
// TODO Other chat message types
// const TYPE_MODMAIL = 'ModMail';
// const TYPE_SYSTEM = 'System';
// const TYPE_REPORTEDUSER = 'ReportedUser';
// const TYPE_NUDGE = 'Nudge';
// const TYPE_SCHEDULE = 'Schedule';
// const TYPE_SCHEDULE_UPDATED = 'ScheduleUpdated';

const ChatMessageText = () => import('./ChatMessageText')
const ChatMessageImage = () => import('./ChatMessageImage')
const ChatMessageInterested = () => import('./ChatMessageInterested')
const ChatMessageCompleted = () => import('./ChatMessageCompleted')
const ChatMessagePromised = () => import('./ChatMessagePromised')
const ChatMessageReneged = () => import('./ChatMessageReneged')
const ChatMessageAddress = () => import('./ChatMessageAddress')
const ChatMessageDateRead = () => import('./ChatMessageDateRead')

export default {
  components: {
    ChatMessageDateRead,
    ChatMessageText,
    ChatMessageImage,
    ChatMessageInterested,
    ChatMessageCompleted,
    ChatMessagePromised,
    ChatMessageAddress,
    ChatMessageReneged
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
