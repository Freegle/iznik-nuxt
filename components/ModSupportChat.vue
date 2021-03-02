<template>
  <div class="layout">
    <div class="type">
      <v-icon v-if="chat.chattype === 'User2User'" class="text-success pr-1" name="user" />
      <v-icon v-else-if="chat.chattype === 'User2Mod' || chat.chattype === 'Mod2Mod'" class="text-warning pr-1 mb-2" name="crown" />
    </div>
    <div class="id text-muted">
      Chat <v-icon name="hashtag" scale="0.5" class="text-muted" />{{ chat.id }}
    </div>
    <ModChatViewButton :id="chat.id" :pov="pov" class="button" />
    <div class="name d-flex">
      {{ chat.name }}&nbsp;
      <span v-if="otheruser" class="text-muted">
        <v-icon name="hashtag" class="text-muted" scale="0.5" />{{ otheruser }}
      </span>
    </div>
    <div class="time">
      <span v-if="chat.lastdate" :title="chat.lastdate | datetime">
        {{ chat.lastdate | timeago }}
      </span>
      <span v-else>
        <em>No messages</em>
      </span>
    </div>
  </div>
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
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.layout {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 20px 1fr 130px 3fr 130px;

  @include media-breakpoint-down(sm) {
    grid-template-rows: auto auto auto auto;
    grid-template-columns: 20px 1fr;

    .type {
      grid-row: 1 / 2;
      grid-column: 1 / 2;
    }

    .id {
      grid-row: 1 / 2;
      grid-column: 2 / 3;
    }

    .name {
      grid-row: 2 / 3;
      grid-column: 1 / 3;
    }

    .time {
      grid-row: 3 / 4;
      grid-column: 1 / 3;
    }

    .button {
      grid-row: 4 / 5;
      grid-column: 1 / 3;
    }
  }
}
</style>
