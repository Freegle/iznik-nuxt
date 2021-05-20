<template>
  <div>
    <div v-if="chatmessage.type === 'Default'">
      <chat-message-text
        :chat="chat"
        :chatmessage="chatmessage"
        :otheruser="otheruser"
        :pov="pov"
        :chatusers="chatusers"
        :highlight-emails="highlightEmails"
      />
    </div>
    <chat-message-image
      v-else-if="chatmessage.type === 'Image'"
      :chat="chat"
      :chatmessage="chatmessage"
      :otheruser="otheruser"
      :pov="pov"
      :chatusers="chatusers"
    />
    <div v-else-if="chatmessage.type === 'Interested'">
      <chat-message-interested
        v-if="otheruser"
        :chat="chat"
        :chatmessage="chatmessage"
        :otheruser="otheruser"
        :pov="pov"
        :chatusers="chatusers"
        :highlight-emails="highlightEmails"
      />
    </div>
    <div v-else-if="chatmessage.type === 'Completed' && otheruser">
      <chat-message-completed
        v-if="otheruser"
        :chat="chat"
        :chatmessage="chatmessage"
        :otheruser="otheruser"
        :pov="pov"
        :chatusers="chatusers"
      />
    </div>
    <div v-else-if="chatmessage.type === 'Promised' && otheruser">
      <chat-message-promised
        v-if="otheruser"
        :chat="chat"
        :chatmessage="chatmessage"
        :otheruser="otheruser"
        :pov="pov"
        :chatusers="chatusers"
      />
    </div>
    <div v-else-if="chatmessage.type === 'Reneged' && otheruser">
      <chat-message-reneged
        v-if="otheruser"
        :chat="chat"
        :chatmessage="chatmessage"
        :otheruser="otheruser"
        :pov="pov"
        :chatusers="chatusers"
      />
    </div>
    <div v-else-if="chatmessage.type === 'Address' && otheruser">
      <chat-message-address
        v-if="otheruser"
        :chat="chat"
        :chatmessage="chatmessage"
        :otheruser="otheruser"
        :pov="pov"
        :chatusers="chatusers"
      />
    </div>
    <div v-else-if="chatmessage.type === 'Nudge' && otheruser">
      <chat-message-nudge
        v-if="otheruser"
        :chat="chat"
        :chatmessage="chatmessage"
        :otheruser="otheruser"
        :pov="pov"
        :chatusers="chatusers"
      />
    </div>
    <div v-else-if="chatmessage.type === 'ModMail'">
      <chat-message-mod-mail
        :chat="chat"
        :chatmessage="chatmessage"
        :otheruser="null"
        :pov="pov"
        :chatusers="chatusers"
      />
    </div>
    <div v-else-if="chatmessage.type === 'Schedule' && otheruser">
      <chat-message-schedule
        v-if="otheruser"
        :chat="chat"
        :chatmessage="chatmessage"
        :otheruser="otheruser"
        :pov="pov"
        :chatusers="chatusers"
      />
    </div>
    <div v-else-if="chatmessage.type === 'ScheduleUpdated' && otheruser">
      <chat-message-schedule
        v-if="otheruser"
        :chat="chat"
        :chatmessage="chatmessage"
        :otheruser="otheruser"
        :pov="pov"
        :chatusers="chatusers"
      />
    </div>
    <div v-else-if="chatmessage.type === 'ReportedUser'">
      <chat-message-report
        :chat="chat"
        :chatmessage="chatmessage"
        :otheruser="otheruser"
        :pov="pov"
        :chatusers="chatusers"
      />
    </div>
    <div v-else-if="supportOrAdmin">
      Unknown chat message type {{ chatmessage.type }}
    </div>
    <chat-message-warning :chatmessage="chatmessage" />
    <chat-message-date-read
      :chat="chat"
      :chatmessage="chatmessage"
      :otheruser="otheruser"
      :last="last"
      :pov="pov"
      :chatusers="chatusers"
    />
  </div>
</template>
<script>
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
import ChatMessageSchedule from './ChatMessageSchedule'
import ChatMessageReport from './ChatMessageReport'
import ChatMessageWarning from '~/components/ChatMessageWarning'

// System chat message doesn't seem to be used; ReportedUser is for ModTools only.

export default {
  components: {
    ChatMessageWarning,
    ChatMessageDateRead,
    ChatMessageText,
    ChatMessageImage,
    ChatMessageInterested,
    ChatMessageCompleted,
    ChatMessagePromised,
    ChatMessageAddress,
    ChatMessageReneged,
    ChatMessageNudge,
    ChatMessageModMail,
    ChatMessageSchedule,
    ChatMessageReport
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
    otheruser: {
      type: Object,
      required: false,
      default: null
    },
    last: {
      type: Boolean,
      required: false,
      default: false
    },
    pov: {
      type: Number,
      required: false,
      default: null
    },
    chatusers: {
      type: Array,
      required: true
    },
    highlightEmails: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>
