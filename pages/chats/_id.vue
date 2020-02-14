<template>
  <client-only>
    <b-row class="m-0">
      <b-col id="chatlist" cols="12" md="3" xl="2" :class="'chatlist p-0 bg-white ' + (selectedChatId ? 'd-none d-md-block' : '') + ' ' + selectedChatId">
        <b-card class="p-0">
          <b-card-body class="p-0">
            <b-row>
              <b-col>
                <b-form-input v-model="search" placeholder="Search chats" @update="searchChange" />
              </b-col>
              <b-col>
                <b-btn class="float-right" variant="white" @click="markAllRead">
                  <v-icon name="check" /> Mark all read
                </b-btn>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
        <ul v-for="chat in sortedChats" :key="'chat-' + chat.id" class="p-0 pt-1 list-unstyled mb-1">
          <li :class="{ active: chat && parseInt(activeChat) === parseInt(chat.id) }">
            <ChatListEntry :id="chat.id" />
          </li>
        </ul>
        <client-only>
          <infinite-loading force-use-infinite-wrapper="#chatlist" :distance="distance" @infinite="loadMore">
            <span slot="no-results" />
            <span slot="no-more" />
          </infinite-loading>
        </client-only>
      </b-col>
      <b-col cols="12" md="9" xl="7" :class="'chatback ' + (selectedChatId ? 'd-block' : 'd-none d-md-block')">
        <ChatPane v-if="activeChat" :id="activeChat" />
      </b-col>
      <b-col cols="0" xl="3" class="d-none d-xl-block p-0 pl-1">
        <SidebarRight :show-volunteer-opportunities="false" :show-job-opportunities="true" />
      </b-col>
    </b-row>
  </client-only>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import SidebarRight from '@/components/SidebarRight'
import buildHead from '@/mixins/buildHead'
import chatPage from '@/mixins/chatPage'
import loginRequired from '@/mixins/loginRequired.js'

// We can't use async on ChatListEntry else the infinite scroll kicks in and tries to load everything while we are
// still waiting for the import to complete.
import ChatListEntry from '~/components/ChatListEntry.vue'
const ChatPane = () => import('~/components/ChatPane.vue')

export default {
  components: {
    InfiniteLoading,
    SidebarRight,
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
      "See the conversations you're having with other freeglers."
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
</style>
