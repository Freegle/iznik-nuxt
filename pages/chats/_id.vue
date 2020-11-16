<template>
  <client-only>
    <b-container fluid>
      <h1 class="sr-only">
        Chats
      </h1>
      <MicroVolunteering />
      <b-row class="m-0">
        <b-col id="chatlist" cols="12" md="4" xl="3" :class="'chatlist p-0 bg-white ' + (selectedChatId ? 'd-none d-md-block' : '') + ' ' + selectedChatId">
          <b-card class="p-0">
            <b-card-body class="p-0">
              <div class="d-flex justify-content-between">
                <form role="search">
                  <label for="search-bar" class="sr-only">Search chats</label>
                  <b-form-input id="search-bar" v-model="search" placeholder="Search chats" class="flex-shrink-1" />
                </form>
                <b-btn class="float-right" variant="white" @click="markAllRead">
                  <v-icon name="check" /> Mark all read
                </b-btn>
              </div>
            </b-card-body>
          </b-card>
          <ChatListEntry v-for="chat in visibleChats" :id="chat.id" :key="'chat-' + chat.id" :class="{ active: chat && parseInt(selectedChatId) === parseInt(chat.id) }" />
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
        <b-col cols="12" md="8" xl="6" :class="'chatback p-0 ' + (selectedChatId ? 'd-block' : 'd-none d-md-block')">
          <ChatPane v-if="selectedChatId" :id="selectedChatId" :key="'chatpane-' + selectedChatId" />
          <p v-else class="text-center text-muted mt-2">
            Please click on a chat in the left pane.
          </p>
        </b-col>
        <b-col cols="0" xl="3" class="d-none d-xl-block p-0 pl-1">
          <SidebarRight :show-volunteer-opportunities="false" :show-job-opportunities="true" />
        </b-col>
      </b-row>
    </b-container>
  </client-only>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import MicroVolunteering from '../../components/MicroVolunteering'
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
    MicroVolunteering,
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
