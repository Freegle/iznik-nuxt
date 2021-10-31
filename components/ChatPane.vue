<template>
  <div>
    <b-alert v-if="notVisible" variant="warning" class="mt-2" show>
      <h3>
        That chat isn't for this account.
      </h3>
      <p>
        Please check your email in <nuxt-link to="/settings">
          Settings
        </nuxt-link>.  If you have trouble, please contact
        <!-- eslint-disable-next-line -->
        <ExternalLink href="mailto:support@ilovefreegle.org">support@ilovefreegle.org</ExternalLink>
        who can help you merge multiple accounts.
      </p>
    </b-alert>
    <div v-else-if="me">
      <client-only>
        <div class="chatHolder">
          <ChatHeader v-bind="$props" class="chatTitle" :loaded.sync="headerLoaded" />
          <div v-if="chat" ref="chatContent" class="chatContent" infinite-wrapper>
            <infinite-loading
              v-if="otheruser || chat.chattype === 'User2Mod' || chat.chattype === 'Mod2Mod'"
              direction="top"
              force-use-infinite-wrapper="true"
              :distance="distance"
              class="w-100"
              @infinite="loadMore"
            >
              <span slot="no-results" />
              <span slot="no-more" />
              <div slot="spinner" class="w-100">
                <div class="col text-center">
                  <b-img-lazy src="~/static/loader.gif" alt="Loading" />
                </div>
              </div>
            </infinite-loading>
            <div v-if="otheruser || chat.chattype === 'User2Mod' || chat.chattype === 'Mod2Mod'" class="pt-1 mb-1 w-100">
              <ChatMessage
                v-for="(chatmessage, index) in chatmessages"
                :key="'chatmessage-' + chatmessage.id"
                :chatmessage="chatmessage"
                :chat="chat"
                :otheruser="otheruser"
                :last="chatmessage.id === chatmessages[chatmessages.length - 1].id"
                :chatusers="chatusers"
                :prevmessage="index > 0 ? chatmessages[index - 1].id : null"
              />
            </div>
            <div v-if="chatBusy && headerLoaded" class="text-center">
              <b-img class="float-right" src="~static/loader.gif" />
            </div>
          </div>
          <ChatFooter v-bind="$props" class="chatFooter" @scrollbottom="scrollToBottom(true)" />
        </div>
      </client-only>
    </div>
  </div>
</template>
<script>
import { TooltipPlugin } from 'bootstrap-vue'
import Vue from 'vue'
import InfiniteLoading from 'vue-infinite-loading'
import chatCollate from '@/mixins/chatCollate.js'
import chat from '@/mixins/chat.js'
import ChatHeader from './ChatHeader'
import ChatFooter from './ChatFooter'

// Don't use dynamic imports because it stops us being able to scroll to the bottom after render.
import ChatMessage from '~/components/ChatMessage.vue'
import ExternalLink from '~/components/ExternalLink'
Vue.use(TooltipPlugin)

export default {
  components: {
    ExternalLink,
    ChatHeader,
    ChatFooter,
    InfiniteLoading,
    ChatMessage
  },
  mixins: [chatCollate, chat],
  data: function() {
    return {
      headerLoaded: false
    }
  },
  watch: {
    me(newVal, oldVal) {
      if (!oldVal && newVal) {
        this.fetchChat()
      }
    }
  },
  created() {
    this.urlid = this.$route.query.u
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.chatpane {
  min-height: 100vh;
}

.chatHolder {
  height: calc(100vh - 74px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chatTitle {
  order: 1;
  z-index: 1000;
}

.chatContent {
  order: 3;
  justify-content: flex-start;
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.chatFooter {
  order: 4;
}
</style>
