<template>
  <b-row>
    <b-col cols="3" md="2" class="p-1 order-1 text-muted small">
      <v-icon name="hashtag" scale="0.5" class="text-muted" />{{ chat.id }}
    </b-col>
    <b-col cols="1">
      <v-icon v-if="chat.chattype === 'User2User'" class="text-success" name="user" />
      <v-icon v-else-if="chat.chattype === 'User2Mod' || chat.chattype === 'Mod2Mod'" class="text-warning" name="crown" />
    </b-col>
    <b-col cols="4" md="2" class="p-1 order-1" :title="chat.lastdate | datetime">
      {{ chat.lastdate | timeago }}
    </b-col>
    <b-col cols="12" md="5" class="p-1 order-3 order-md-2">
      {{ chat.name }}
    </b-col>
    <b-col cols="4" md="2" class="p-1 order-2 order-md-3 small text-muted">
      <ModChatViewButton :id="chat.id" />
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
    }
  }
}
</script>
