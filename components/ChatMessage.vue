<template>
  <client-only>
    <div
      v-long-press="300"
      @mousedown="saveSelected"
      @contextmenu.prevent.stop="handleClick($event)"
      @long-press-start="handleClick($event)"
    >
      <vue-simple-context-menu
        ref="vueSimpleContextMenu"
        :element-id="uniqueid"
        :options="options"
        @option-clicked="optionClicked"
      />
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
    </div>
  </client-only>
</template>
<script>
// Don't use dynamic imports because it stops us being able to scroll to the bottom after render.
import VueSimpleContextMenu from 'vue-simple-context-menu'
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
let LongPress = null

if (process.client) {
  LongPress = require('vue-directive-long-press')
}

export default {
  directives: {
    'long-press': LongPress
  },
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
    ChatMessageReport,
    VueSimpleContextMenu
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
      selectedText: null,
      options: [
        {
          name: 'Copy to clipboard'
        },
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
    handleClick(event) {
      this.$refs.vueSimpleContextMenu.showMenu(event)
    },
    saveSelected() {
      if (process.client && window.getSelection) {
        this.selectedText = window.getSelection().toString()
      }
    },
    async optionClicked(val) {
      switch (val.option.name) {
        case 'Copy to clipboard':
          if (process.client && this.selectedText) {
            await navigator.clipboard.writeText(this.selectedText)
          }
          break
        case 'Mark unread':
          await this.$store.dispatch('chats/markUnseen', {
            chatid: this.chat.id,
            msgid: this.prevmessage
          })
          break
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

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

/deep/ .vue-simple-context-menu {
  position: fixed !important;
}
</style>
