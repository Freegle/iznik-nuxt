<template>
  <div v-if="chat" class="title pb-1">
    <div class="thename pl-1 pr-1">
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
    <div class="themenu">
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
    <Ratings v-if="otheruser" :id="otheruserid" :key="'otheruser-' + otheruserid" class="theratings pl-1" size="sm" />
    <b-btn variant="white" size="sm" class="thebutton mr-1" @click="markRead">
      Mark read
    </b-btn>
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
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

// Mobile view has two columns, with the name/menu in the first row and ratings/button in the second.
// Desktop view has a single row, with name/ratings on the left and button/menu on the right.
.title {
  background-color: $color-blue--light;
  color: $color-white;
  font-weight: bold;

  display: grid;
  grid-template-columns: auto max-content;
  grid-template-rows: max-content max-content;

  @include media-breakpoint-up(sm) {
    // We want the ratings to use up all the residual space, hence the 1fr.
    grid-template-columns: max-content 1fr max-content 70px;
    grid-template-rows: max-content;
  }
}

.title div {
  background-color: $color-blue--light;
}

.thename {
  grid-column: 1 / 2;
  order: 1;
}

.themenu {
  grid-column: 2 / 3;
  justify-self: end;
  order: 2;

  @include media-breakpoint-up(sm) {
    grid-column: 4 / 5;
    order: 4;
  }
}

.theratings {
  grid-column: 1 / 2;
  order: 2;

  @include media-breakpoint-up(sm) {
    grid-column: 2 / 3;
    order: 2;
  }
}

.thebutton {
  grid-column: 2 / 3;
  order: 4;

  @include media-breakpoint-up(sm) {
    grid-column: 3 / 4;
    order: 3;
  }
}

.hidelink a {
  text-decoration: none;
  color: white;
}

::v-deep .dropdown-toggle {
  color: $color-white;
}
</style>
