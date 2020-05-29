<template>
  <client-only>
    <b-row class="m-0">
      <b-col id="chatlist" cols="12" md="4" :class="'chatlist p-0 bg-white ' + (selectedChatId ? 'd-none d-md-block' : '') + ' ' + selectedChatId">
        <b-card class="p-0">
          <b-card-body class="p-0">
            <div class="d-flex justify-content-between flex-wrap">
              <b-form-input v-model="search" placeholder="Search chats" class="flex-shrink-1" :disabled="searching !== null" />
              <b-btn class="mt-1" variant="white" @click="markAllRead">
                <v-icon name="check" /> Mark all read
              </b-btn>
            </div>
          </b-card-body>
        </b-card>
        <ChatListEntry v-for="chat in visibleChats" :id="chat.id" :key="'chat-' + chat.id" :class="{ active: chat && selectedChatId === parseInt(chat.id) }" @click="selectedChatId=parseInt(chat.id)" />
        <p v-if="!visibleChats || !visibleChats.length" class="ml-2">
          No chats to show.
        </p>
        <infinite-loading :identifier="bump" force-use-infinite-wrapper="#chatlist" :distance="distance" @infinite="loadMore">
          <span slot="no-results" />
          <span slot="no-more" />
        </infinite-loading>
        <div class="d-flex justify-content-around">
          <b-btn v-if="search && complete" variant="white" class="mt-2" @click="searchMore">
            <v-icon v-if="searching" name="sync" class="text-success fa-spin" />
            <v-icon v-else name="search" /> Search old chats
          </b-btn>
        </div>
      </b-col>
      <b-col cols="12" md="8" :class="'chatback ' + (selectedChatId ? 'd-block' : 'd-none d-md-block')">
        <ChatPane v-if="selectedChatId" :id="selectedChatId" />
        <p v-else class="text-center text-muted mt-2">
          Please click on a chat in the left pane.
        </p>
      </b-col>
    </b-row>
  </client-only>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import buildHead from '@/mixins/buildHead'
import chatPage from '@/mixins/chatPage'
import loginRequired from '@/mixins/loginRequired.js'

// We can't use async on ChatListEntry else the infinite scroll kicks in and tries to load everything while we are
// still waiting for the import to complete.
import ChatListEntry from '~/components/ChatListEntry.vue'
const ChatPane = () => import('~/components/ChatPane.vue')

export default {
  layout: 'modtools',
  components: {
    InfiniteLoading,
    ChatPane,
    ChatListEntry
  },
  mixins: [loginRequired, buildHead, chatPage],
  data: function() {
    return {}
  },
  head() {
    return this.buildHead(
      'Chats',
      "See the conversations you're having with freeglers."
    )
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.chatback {
  background-color: $color-yellow--light;
}

.active {
  background-color: $color-gray--lighter;
}

.chatlist {
  max-height: calc(100vh - 74px);
  overflow-y: auto;
  overflow-x: hidden;
}

.greybord {
  border-color: $color-gray-4;
}
</style>
