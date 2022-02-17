<template>
  <client-only>
    <div
      :class="selected ? 'selected' : ''"
      @click="selectMe"
    >
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
          v-if="otheruser || chat.chattype === 'User2Mod'"
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
      <div v-if="selected">
        <b-btn variant="link" @click="markUnseen">
          Mark unread
        </b-btn>
      </div>
    </div>
  </client-only>
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
import 'vue-simple-context-menu/dist/vue-simple-context-menu.css'

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
    },
    prevmessage: {
      type: Number,
      required: false,
      default: null
    }
  },
  data() {
    return {
      uniqueid: '',
      selected: false,
      options: [
        {
          name: 'Mark unread'
        }
      ]
    }
  },
  async mounted() {
    this.uniqueid = await this.$store.dispatch('uniqueid/generate')
  },
  methods: {
    selectMe() {
      if (this.chatmessage.userid !== this.myid) {
        this.selected = true
      }
    },
    async markUnseen() {
      await this.$store.dispatch('chats/markUnseen', {
        chatid: this.chat.id,
        msgid: this.prevmessage
      })

      this.selected = false
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.selected {
  border: 1px solid $color-blue--bright;
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}

/deep/ .card {
  border-radius: 10px;
}

/deep/ .chatMessage {
  border: 1px solid $color-gray--light;
  border-radius: 10px;
  padding: 2px 4px 2px 4px;
  word-wrap: break-word;
  line-height: 1.75;

  @include media-breakpoint-up(md) {
    padding: 4px 8px 4px 8px;
  }
}

/deep/ .chatMessage__owner {
  background-color: $color-white;
  order: 2;
}

/deep/ .myChatMessage {
  .chatMessage__owner {
    background-color: $color-green--light;
    order: 0;
  }

  .chatMessage {
    margin-left: auto;
  }

  .chatMessageProfilePic {
    left: 0;
  }
}

/deep/ .chatMessageProfilePic {
  min-width: 25px;
  position: relative;
  top: 3px;
  left: 3px;
  margin-right: 5px;

  @include media-breakpoint-up(md) {
    min-width: 35px;
  }
}

/deep/ .chatMessageWrapper {
  display: flex;
  padding-right: 10px;

  &.myChatMessage {
    padding-left: 10px;
    padding-right: 0;
  }
}

/deep/ .highlight {
  color: $color-orange--dark !important;
  background-color: initial;
}
</style>
