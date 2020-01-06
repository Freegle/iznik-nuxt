<template>
  <div />
</template>

<style scoped lang="scss">
@import 'color-vars';

.chatMessage {
  border: 1px solid $color-gray--light;
  border-radius: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 4px;
  padding-right: 2px;
  word-wrap: break-word;
  line-height: 1.75;
}
</style>

<script>
import twem from '~/assets/js/twem'

export default {
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
  computed: {
    emessage() {
      return twem.twem(this.$twemoji, this.chatmessage.message.toString()).trim() // CC
    },
    othericon() {
      let ret = null

      if (
        this.chat.chattype === 'User2User' &&
        this.otheruser &&
        this.otheruser.profile &&
        this.otheruser.profile.turl
      ) {
        ret = this.otheruser.profile.turl
      } else if (
        this.chat.chattype === 'User2Mod' &&
        this.chat.group &&
        this.chat.group.profile
      ) {
        ret = this.chat.group.profile
      }

      return ret
    },
    refmsg() {
      return this.chatmessage.refmsg
        ? this.chatmessage.refmsg
        : {
            subject: 'A message which no longer exists'
          }
    }
  },
  methods: {
    brokenImage(event) {
      event.target.src = '/static/defaultprofile.png'
    }
  }
}
</script>
