<template>
  <span>
    <span v-if="size === 'naked'" @click="openChat">
      {{ title }}
    </span>
    <b-btn v-else :size="size" :variant="variant" @click="openChat">
      <v-icon name="comments" />
      <span v-if="title">
        {{ title }}
      </span>
    </b-btn>
  </span>
</template>
<script>
export default {
  props: {
    size: {
      type: String,
      required: false,
      default: null
    },
    title: {
      type: String,
      required: false,
      default: null
    },
    variant: {
      type: String,
      required: false,
      default: 'white'
    },
    groupid: {
      type: Number,
      required: false,
      default: null
    },
    userid: {
      type: Number,
      required: false,
      default: null
    }
  },
  methods: {
    async openChat(event, firstmessage, firstmsgid) {
      this.$emit('click')

      if (this.groupid > 0) {
        // Open a chat to the mods
        const chatid = await this.$store.dispatch('chats/openChatToMods', {
          groupid: this.groupid
        })

        await this.$store.dispatch('popupchats/popup', {
          id: chatid
        })
      } else if (this.userid > 0) {
        const chatid = await this.$store.dispatch('chats/openChatToUser', {
          userid: this.userid
        })

        if (firstmessage) {
          await this.$store.dispatch('chatmessages/send', {
            roomid: chatid,
            message: firstmessage,
            refmsgid: firstmsgid
          })
        }

        await this.$store.dispatch('popupchats/popup', {
          id: chatid
        })
      }
    }
  }
}
</script>
