<template>
  <b-row class="m-0">
    <b-col cols="3" md="2" class="p-0 order-3 text-muted">
      Chat <v-icon name="hashtag" scale="0.5" class="text-muted" />{{ chat.id }}
    </b-col>
    <b-col cols="1" class="order-2 p-0">
      <v-icon v-if="chat.chattype === 'User2User'" class="text-success pr-1" name="user" />
      <v-icon v-else-if="chat.chattype === 'User2Mod' || chat.chattype === 'Mod2Mod'" class="text-warning pr-1 mb-2" name="crown" />
    </b-col>
    <b-col cols="4" md="2" class="p-0 order-4 order-md-3" :title="lastdatetime">
      {{ chat.lastdate | timeago }}
    </b-col>
    <b-col cols="12" md="5" class="p-0 order-1 order-md-2">
      {{ chat.name }}
      <span v-if="otheruser" class="text-muted">
        <v-icon name="hashtag" class="text-muted" scale="0.5" />{{ otheruser }}
      </span>
    </b-col>
    <b-col cols="3" md="2" class="p-0 order-5 order-md-4 small text-muted">
      <ModChatViewButton :id="chat.id" :pov="pov" />
    </b-col>
  </b-row>
</template>
<script>
import ModChatViewButton from './ModChatViewButton'
export default {
  components: { ModChatViewButton },
  props: {
    chat: {
      type: Object,
      required: true
    },
    pov: {
      type: Number,
      required: false,
      default: null
    }
  },
  computed: {
    otheruser() {
      if (!this.chat || this.chat.chattype !== 'User2User') {
        return null
      } else {
        return this.chat.user1 === this.pov ? this.chat.user2 : this.chat.user1
      }
    },
    lastdatetime() {
      return this.chat && this.chat.lastdate
        ? this.$dayjs(this.chat.lastdate).format('Do MMMM, YYYY HH:mm:ss')
        : null
    }
  }
}
</script>
