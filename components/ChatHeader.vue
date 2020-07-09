<template>
  <div v-if="chat" class="title d-flex flex-wrap justify-content-between">
    <div class="d-flex flex-wrap justify-content-between">
      <div class="ml-1 mr-1">
        <span v-if="chat.chattype === 'User2Mod' && mod && chat.group" class="d-inline clickme hidelink align-middle">
          <nuxt-link :to="'/modtools/members/approved/search/' + chat.group.id + '/' + otheruserid">
            {{ chat.name }}
          </nuxt-link>
        </span>
        <span v-else-if="(chat.chattype == 'User2User' || chat.chattype == 'User2Mod')" class="d-inline clickme align-middle">
          <span @click="showInfo">
            {{ chat.name }}
          </span>
        </span>
        <span v-else class="d-inline align-middle">
          {{ chat.name }}
        </span>
        <span v-if="unseen">
          <b-badge variant="danger">{{ unseen }}</b-badge>
        </span>
      </div>
      <div class="mr-2 d-none d-sm-inline-block">
        <Ratings v-if="otheruser" :id="otheruserid" :key="'otheruser-' + otheruserid" size="sm" />
      </div>
    </div>
    <div>
      <b-btn variant="white" size="sm" class="mr-2 d-none d-sm-inline-block" @click="markRead">
        Mark read
      </b-btn>
      <span class="pl-1 mr-1 clickme d-none d-sm-inline-block" title="Popup chat window" @click="popup">
        <v-icon name="window-restore" />
      </span>
      <b-dropdown v-if="mod && chat.chattype === 'User2Mod'" size="sm" variant="transparent" right>
        <template slot="button-content" />
        <b-dropdown-item v-if="otheruser" @click="showhide">
          Hide this chat
        </b-dropdown-item>
      </b-dropdown>
      <b-dropdown v-if="chat.chattype === 'User2User'" size="sm" variant="transparent" right>
        <template slot="button-content" />
        <b-dropdown-item v-if="otheruser" @click="showhide">
          Hide this chat
        </b-dropdown-item>
        <b-dropdown-item v-if="otheruser" @click="showblock">
          Block this person
        </b-dropdown-item>
        <b-dropdown-item v-if="otheruser" @click="report">
          Report this person
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <div class="d-sm-none d-flex justify-content-between flex-wrap w-100 pl-1 pb-1">
      <div>
        <Ratings v-if="otheruser" :id="otheruserid" :key="'otheruser-' + otheruser.id" size="sm" />
      </div>
      <b-btn variant="white" size="sm" @click="markRead">
        Mark read
      </b-btn>
    </div>
    <ChatBlockModal v-if="chat && chat.chattype === 'User2User' && otheruser" :id="id" ref="chatblock" :user="otheruser" @confirm="block" />
    <ChatHideModal v-if="chat && otheruser && ((chat.chattype === 'User2User') || (chat.chattype === 'User2Mod' && mod))" :id="id" ref="chathide" :user="otheruser" @confirm="hide" />
    <ChatReportModal
      v-if="otheruser && chat && chat.chattype === 'User2User'"
      :id="'report-' + id"
      ref="chatreport"
      :user="otheruser"
      :chatid="chat.id"
      @confirm="hide"
    />
  </div>
</template>
<script>
import chat from '@/mixins/chat.js'
import waitForRef from '@/mixins/waitForRef'

const ChatBlockModal = () => import('./ChatBlockModal')
const ChatHideModal = () => import('./ChatHideModal')
const Ratings = () => import('~/components/Ratings')
const ChatReportModal = () => import('~/components/ChatReportModal')

export default {
  components: {
    Ratings,
    ChatBlockModal,
    ChatHideModal,
    ChatReportModal
  },
  mixins: [waitForRef, chat],
  methods: {
    popup() {
      this.$store.dispatch('popupchats/popup', { id: this.chat.id })
    },
    hide() {
      this.$store.dispatch('chats/hide', {
        id: this.id
      })

      const modtools = this.$store.getters['misc/get']('modtools')
      this.$router.push((modtools ? '/modtools' : '') + '/chats')
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.title {
  background-color: $color-blue--light;
  color: $color-white;
  font-weight: bold;
}

.title div {
  background-color: $color-blue--light;
}

.hidelink a {
  text-decoration: none;
  color: white;
}

::v-deep .dropdown-toggle {
  color: $color-white;
}
</style>
