<template>
  <div>
    <b-alert v-if="notVisible" variant="warning" class="mt-2" show>
      <h3>
        That chat isn't for
        <span v-if="me && me.email">{{ me.email }}</span>
        <span v-else>this account </span>
      </h3>
      <p>
        Please change your email from <nuxt-link to="/settings">
          Settings
        </nuxt-link> if necessary - we'll
        merge your accounts.
      </p>
    </b-alert>
    <div v-else-if="me">
      <client-only>
        <div class="chatHolder">
          <ChatHeader v-bind="$props" class="chatTitle" />
          <div v-if="chat" class="chatContent" infinite-wrapper>
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
              <span slot="spinner" class="w-100">
                <div class="col text-center">
                  <b-img-lazy src="~/static/loader.gif" alt="Loading" />
                </div>
              </span>
            </infinite-loading>
            <div v-if="otheruser || chat.chattype === 'User2Mod' || chat.chattype === 'Mod2Mod'" class="pt-1 mb-1 w-100">
              <ChatMessage
                v-for="chatmessage in chatmessages"
                :key="'chatmessage-' + chatmessage.id"
                :chatmessage="chatmessage"
                :chat="chat"
                :otheruser="otheruser"
                :last="chatmessage.id === chatmessages[chatmessages.length - 1].id"
                :chatusers="chatusers"
              />
            </div>
            <div v-if="chatBusy" class="text-center">
              <b-img class="float-right" src="~static/loader.gif" />
            </div>
          </div>
          <ChatFooter v-bind="$props" class="chatFooter" @scrollbottom="scrollBottom" />
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
import waitForRef from '@/mixins/waitForRef'
import ChatHeader from './ChatHeader'
import ChatFooter from './ChatFooter'

// Don't use dynamic imports because it stops us being able to scroll to the bottom after render.
import ChatMessage from '~/components/ChatMessage.vue'
Vue.use(TooltipPlugin)

export default {
  components: {
    ChatHeader,
    ChatFooter,
    InfiniteLoading,
    ChatMessage
  },
  mixins: [chatCollate, waitForRef, chat],
  watch: {
    me(newVal, oldVal) {
      if (!oldVal && newVal) {
        this.fetchChat()
      }
    }
  },
  created() {
    this.urlid = this.$route.query.u
  },
  methods: {
    scrollBottom() {
      // Scroll to the bottom so we can see it.
      this.$nextTick(() => {
        if (this.$el && this.$el.querySelector) {
          const container = this.$el.querySelector('.chatContent')
          container.scrollTop = container.scrollHeight
        }
      })
    }
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
