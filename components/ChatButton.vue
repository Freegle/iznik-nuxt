<template>
  <span>
    <span v-if="size === 'naked'">
      <span class="d-none d-sm-inline-block" @click="gotoChat(true)">
        {{ title }}
      </span>
      <span class="d-inline-block d-sm-none" @click="gotoChat(false)">
        {{ title }}
      </span>
    </span>
    <span v-else>
      <b-btn :size="size" :variant="variant" class="d-none d-sm-inline" @click="gotoChat(true)">
        <v-icon name="comments" />
        <span v-if="title">
          {{ title }}
        </span>
      </b-btn>
      <b-btn :size="size" :variant="variant" class="d-inline-block d-sm-none" @click="gotoChat(false)">
        <v-icon name="comments" />
        <span v-if="title">
          {{ title }}
        </span>
      </b-btn>
    </span>
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
    },
    chattype: {
      type: String,
      required: false
    }
  },
  methods: {
    gotoChat(popup) {
      this.openChat(null, null, null, popup)
    },

    async openChat(event, firstmessage, firstmsgid, popup, route = true) {
      this.$emit('click')
      console.log(
        'Open chat',
        firstmessage,
        firstmsgid,
        this.groupid,
        this.userid,
        popup
      )

      if (this.groupid > 0) {
        // Open a chat to the mods.  If we are in FD then we just pass the group id and the chat opens from us to the
        // mods; if we're in MT we pass the groupid and userid and it opens from us mods to the user.
        const modtools = this.$store.getters['misc/get']('modtools')

        const chatid = await this.$store.dispatch('chats/openChatToMods', {
          userid: modtools ? this.userid : null,
          groupid: this.groupid
        })

        if (popup) {
          await this.$store.dispatch('popupchats/popup', {
            id: chatid
          })
        } else {
          this.$router.go('/chats/' + chatid)
        }
      } else if (this.userid > 0) {
        const chatid = await this.$store.dispatch('chats/openChatToUser', {
          userid: this.userid,
          chattype: this.chattype
        })

        if (firstmessage) {
          console.log('First message to send', firstmessage)
          await this.$store.dispatch('chatmessages/send', {
            roomid: chatid,
            message: firstmessage,
            refmsgid: firstmsgid
          })

          console.log('Sent')
          this.$emit('sent')
        }

        if (popup) {
          await this.$store.dispatch('popupchats/popup', {
            id: chatid
          })
        } else if (route) {
          this.$router.push('/chats/' + chatid)
        }
      }
    }
  }
}
</script>
