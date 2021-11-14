<template>
  <client-only>
    <b-container fluid>
      <h1 class="sr-only">
        Chats
      </h1>
      <b-row class="m-0">
        <b-col id="chatlist" cols="12" md="4" xl="3" class="chatlist p-0 bg-white">
          <Visible :at="selectedChatId ? ['md', 'lg', 'xl'] : ['xs', 'sm', 'md', 'lg', 'xl']">
            <b-card class="p-0">
              <b-card-body class="p-0">
                <div class="d-flex justify-content-between flex-wrap">
                  <form role="search" class="mb-1 mr-1">
                    <label for="search-bar" class="sr-only">Search chats</label>
                    <b-form-input id="search-bar" v-model="search" placeholder="Search chats" class="flex-shrink-1" />
                  </form>
                  <b-btn variant="primary" class="mb-1" @click="markAllRead">
                    <v-icon name="check" /> Mark all read
                  </b-btn>
                </div>
              </b-card-body>
            </b-card>
            <ChatListEntry v-for="chat in visibleChats" :id="chat.id" :key="'chat-' + chat.id" :class="{ chat: true, active: chat && parseInt(selectedChatId) === parseInt(chat.id) }" />
            <p v-if="!visibleChats || !visibleChats.length" class="ml-2">
              <span v-if="searching" class="pulsate">
                Searching...
              </span>
              <span v-else>
                No chats to show.
              </span>
            </p>
            <infinite-loading :identifier="bump" force-use-infinite-wrapper="#chatlist" :distance="distance" @infinite="loadMore">
              <span slot="no-results" />
              <span slot="no-more" />
            </infinite-loading>
            <div class="d-flex justify-content-around">
              <b-btn v-if="!search && mightBeOldChats && complete && !showingOlder" variant="link" size="sm" @click="fetchOlder">
                Show older chats
              </b-btn>
            </div>
            <div class="d-flex justify-content-around mt-2">
              <b-btn v-if="complete && visibleChats && visibleChats.length" variant="link" size="sm" @click="showHideAll">
                Hide all chats
              </b-btn>
            </div>
          </Visible>
        </b-col>
        <b-col cols="12" md="8" xl="6" class="chatback p-0">
          <Visible :at="selectedChatId ? ['xs', 'sm', 'md', 'lg', 'xl'] : ['md', 'lg', 'xl']">
            <ChatPane v-if="selectedChatId" :id="selectedChatId" :key="'chatpane-' + selectedChatId" />
            <p v-else class="text-center text-info font-weight-bold mt-2">
              Please click on a chat in the left pane.
            </p>
          </Visible>
        </b-col>
        <b-col cols="0" xl="3" class="p-0 pl-1">
          <Visible :at="['xl']">
            <SidebarRight :show-volunteer-opportunities="false" :show-job-opportunities="true" />
          </Visible>
        </b-col>
      </b-row>
      <ChatHideModal v-if="showHideAllModal" ref="chathideall" @confirm="hideAll" />
    </b-container>
  </client-only>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import buildHead from '@/mixins/buildHead'
import chatPage from '@/mixins/chatPage'
import loginRequired from '@/mixins/loginRequired.js'
import dayjs from 'dayjs'
import Visible from '../../components/Visible'
import SidebarRight from '~/components/SidebarRight'

// We can't use async on ChatListEntry else the infinite scroll kicks in and tries to load everything while we are
// still waiting for the import to complete.
import ChatListEntry from '~/components/ChatListEntry.vue'
const ChatPane = () => import('~/components/ChatPane.vue')
const ChatHideModal = () => import('~/components/ChatHideModal')

export default {
  components: {
    Visible,
    InfiniteLoading,
    SidebarRight,
    ChatPane,
    ChatListEntry,
    ChatHideModal
  },
  mixins: [loginRequired, buildHead, chatPage],
  data: function() {
    return {
      showingOlder: false,
      showHideAllModal: false
    }
  },
  computed: {
    mightBeOldChats() {
      const now = dayjs()

      if (this.me) {
        const daysago = now.diff(dayjs(this.me.added), 'days')

        if (daysago > 31) {
          // They've been on the platform log enough that there might be old chats
          return true
        }
      }

      return false
    }
  },
  methods: {
    fetchOlder() {
      this.showingOlder = true
      this.listChats('11 September 2009')
    },
    showHideAll() {
      this.showHideAllModal = true

      this.waitForRef('chathideall', () => {
        this.$refs.chathideall.show()
      })
    },
    async hideAll() {
      const self = this

      for (let i = 0; i < this.visibleChats.length; i++) {
        await self.$store.dispatch('chats/hide', {
          id: this.visibleChats[i].id
        })
      }

      const modtools = this.$store.getters['misc/get']('modtools')
      this.$router.push((modtools ? '/modtools' : '') + '/chats')
    }
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
  background-color: $color-gray-4 !important;
}

.chat:hover {
  background-color: $color-gray--lighter;
}

.chatlist {
  max-height: calc(100vh - 74px);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
