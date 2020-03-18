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
    otheruser: {
      required: true,
      validator: prop => typeof prop === 'object' || prop === null
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
    }
  },
  computed: {
    emessage() {
      return twem.twem(this.$twemoji, this.chatmessage.message).trim()
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
    },
    // We override the normal methods because we might have an explicit point-of-view to honour.
    me() {
      if (!this.pov) {
        return this.$store.getters['auth/user']
      } else if (this.chat.user1 && this.chat.user1.id === this.pov) {
        return this.chat.user1
      } else if (this.chat.user2 && this.chat.user2.id === this.pov) {
        return this.chat.user2
      } else {
        return this.$store.getters['auth/user']
      }
    }
  },
  methods: {
    brokenImage(event) {
      event.target.src = require('~/static/defaultprofile.png')
    }
  }
}
</script>
