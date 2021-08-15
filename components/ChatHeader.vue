<template>
  <div>
    <div v-if="chat && otheruser && otheruser.info" class="outer">
      <div class="d-flex justify-content-between pl-1 pt-1 pb-1">
        <div class="d-flex flex-column align-content-start" @click="showInfo">
          <div class="font-weight-bold black">
            {{ chat.name }}
          </div>
          <div class="userinfo small">
            <div v-if="otheruser.info.lastaccess">
              Last seen <strong :title="otheruser.info.lastaccess | datetimeshort">{{ otheruser.info.lastaccess | timeago }}</strong>.
            </div>
            <div v-if="replytime">
              Typically replies in <strong>{{ replytime }}</strong>.
            </div>
            <div v-if="milesaway">
              About <strong>{{ milesaway | pluralize('mile', { includeNumber: true }) }} away</strong>.
            </div>
          </div>
        </div>
        <div class="d-flex flex-column align-content-between pr-1">
          <template>
            <Ratings :id="otheruserid" :key="'otheruser-' + otheruserid" class="mt-1 d-flex justify-content-end" size="sm" />
            <Supporter v-if="otheruser.supporter" class="ml-2 align-self-center" />
          </template>
        </div>
      </div>
      <b-btn v-if="unseen" variant="white" class="ml-1 d-block d-md-none" @click="markRead">
        Mark read
        <b-badge variant="danger">
          {{ unseen }}
        </b-badge>
      </b-btn>
      <div class="d-flex flex-wrap justify-content-between p-1 mt-1 actions">
        <div class="d-flex">
          <b-btn v-if="unseen" variant="white" class="d-none d-md-block mr-2" @click="markRead">
            Mark read
            <b-badge variant="danger">
              {{ unseen }}
            </b-badge>
          </b-btn>
          <div class="mr-2">
            <b-btn variant="secondary" class="d-none d-md-block" @click="showInfo">
              View profile
            </b-btn>
            <b-btn variant="link" size="sm" class="d-block d-md-none" @click="showInfo">
              View profile
            </b-btn>
          </div>
          <div v-if="chat.chattype === 'User2User' || chat.chattype === 'User2Mod'" class="mr-2">
            <b-btn variant="secondary" class="d-none d-md-block" @click="showhide">
              Hide for now
            </b-btn>
            <b-btn variant="link" size="sm" class="d-block d-md-none" @click="showhide">
              Hide for now
            </b-btn>
          </div>
        </div>
        <div class="d-flex">
          <div v-if="chat.chattype === 'User2User' && otheruser" class="mr-2">
            <b-btn variant="secondary" class="d-none d-md-block" @click="showblock">
              Block
            </b-btn>
            <b-btn variant="link" size="sm" class="d-block d-md-none" @click="showblock">
              Block
            </b-btn>
          </div>
          <div v-if="chat.chattype === 'User2User' && otheruser">
            <b-btn variant="secondary" class="d-none d-md-block" @click="report">
              Report
            </b-btn>
            <b-btn variant="link" size="sm" class="d-block d-md-none" @click="report">
              Report
            </b-btn>
          </div>
        </div>
      </div>
      <ChatBlockModal v-if="chat.chattype === 'User2User'" :id="id" ref="chatblock" :user="otheruser" @confirm="block" />
      <ChatHideModal v-if="chat.chattype === 'User2User' || chat.chattype === 'User2Mod'" :id="id" ref="chathide" :user="otheruser" @confirm="hide" />
      <ChatReportModal
        v-if="chat.chattype === 'User2User'"
        :id="'report-' + id"
        ref="chatreport"
        :user="otheruser"
        :chatid="chat.id"
        @confirm="hide"
      />
      <ProfileModal :id="otheruser.id" ref="profile" />
    </div>
    <div v-else class="w-100">
      <div class="col text-center">
        <b-img-lazy src="~/static/loader.gif" alt="Loading" />
      </div>
    </div>
  </div>
</template>
<script>
import chat from '@/mixins/chat.js'
import waitForRef from '@/mixins/waitForRef'
import Supporter from '~/components/Supporter'

const ChatBlockModal = () => import('./ChatBlockModal')
const ChatHideModal = () => import('./ChatHideModal')
const Ratings = () => import('~/components/Ratings')
const ChatReportModal = () => import('~/components/ChatReportModal')
const ProfileModal = () => import('~/components/ProfileModal')

export default {
  components: {
    ProfileModal,
    Supporter,
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

.outer {
  background-color: $color-blue--x-light;
  border: 1px solid $color-gray--light;
}

.hidelink a {
  text-decoration: none;
  color: white;
}

/deep/ .dropdown-toggle {
  color: $color-white;

  &::after {
    border-top: 0.75em solid;
    border-right: 0.75em solid transparent;
    border-bottom: 0;
    border-left: 0.75em solid transparent;
  }
}

pre {
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
  width: 200px;

  @include media-breakpoint-up(md) {
    width: 300px;
  }

  @include media-breakpoint-up(lg) {
    width: 450px;
  }
}

.userinfo {
  color: $colour-info-fg;
}

.actions {
  border-top: 1px solid $color-gray--light;
}
</style>
