<template>
  <div v-if="userid !== myid" class="d-inline clickme">
    <div id="sizer" ref="sizer" class="d-none d-md-block" />
    <div>
      <slot>
        <b-btn :size="size" :variant="variant" :class="btnClass + ' d-none d-sm-inline'" @click="gotoChat(true)">
          <v-icon v-if="showIcon" name="comments" />
          <span v-if="title">
            {{ title }}
          </span>
        </b-btn>
        <b-btn :size="size" :variant="variant" :class="btnClass + ' d-inline-block d-sm-none'" @click="gotoChat(false)">
          <v-icon v-if="showIcon" name="comments" />
          <span v-if="title">
            {{ title }}
          </span>
        </b-btn>
      </slot>
    </div>
  </div>
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
      default: 'primary'
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
      required: false,
      default: null
    },
    showIcon: {
      type: Boolean,
      required: false,
      default: true
    },
    btnClass: {
      type: String,
      required: false,
      default: null
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
        popup,
        route
      )

      const modtools = this.$store.getters['misc/get']('modtools')

      if (this.groupid > 0) {
        // Open a chat to the mods.  If we are in FD then we just pass the group id and the chat opens from us to the
        // mods; if we're in MT we pass the groupid and userid and it opens from us mods to the user.
        const chatid = await this.$store.dispatch('chats/openChatToMods', {
          userid: modtools ? this.userid : null,
          groupid: this.groupid
        })
        console.log('Got chat', chatid)

        if (popup) {
          await this.$store.dispatch('popupchats/popup', {
            id: chatid
          })
          console.log('Popped up')
        } else {
          this.$router.push(
            (modtools ? '/modtools/chats/' : '/chats/') + chatid
          )
        }
      } else if (this.userid > 0) {
        const chatid = await this.$store.dispatch('chats/openChatToUser', {
          userid: this.userid,
          chattype: this.chattype
        })

        if (chatid) {
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

          console.log('Consider popup, route', popup, route, chatid)
          if (popup) {
            await this.$store.dispatch('popupchats/popup', {
              id: chatid
            })
          } else if (route) {
            this.$router.push(
              (modtools ? '/modtools/chats/' : '/chats/') + chatid
            )
          }
        }
      }
    }
  }
}
</script>
