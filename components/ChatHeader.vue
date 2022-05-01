<template>
  <div>
    <div v-if="chat && (chat.chattype !== 'User2User' || otheruser && otheruser.info)" class="outer position-relative">
      <div class="nameinfo pt-1 pb-1 pl-1">
        <div class="d-flex flex-column align-content-around justify-content-center" @click="showInfo">
          <div class="font-weight-bold black">
            {{ chat.name }}
          </div>
          <div v-if="!collapsed && otheruser && otheruser.info" class="userinfo small flex flex-wrap mr-2">
            <div v-if="otheruser.info.lastaccess" class="d-inline d-md-block">
              <span class="d-none d-md-inline">Last seen</span>
              <span class="d-inline d-md-none">Seen</span>
              <strong title=datetimeshort(otheruser.info.lastaccess)>{{ timeago(otheruser.info.lastaccess) }}</strong>.
            </div>
            <div v-if="replytime" class="d-inline d-md-block">
              <span class="d-none d-md-inline">Typically replies in</span>
              <span class="d-inline d-md-none">Replies in</span>
              <strong>{{ replytime }}</strong>.
            </div>
            <div v-if="milesaway" class="d-inline d-md-block">
              About <strong>{{ milesaway | pluralize('mile', { includeNumber: true }) }} away</strong>.
            </div>
          </div>
        </div>
        <div v-if="otheruser && otheruser.info" class="d-flex flex-column align-content-between pr-1">
          <template>
            <Ratings :id="otheruserid" :key="'otheruser-' + otheruserid" class="mt-1 d-flex justify-content-end" size="sm" />
            <Supporter v-if="otheruser.supporter" class="align-self-end" />
          </template>
        </div>
      </div>
      <b-btn v-if="unseen" variant="white" class="ml-1 d-block d-md-none" @click="markRead">
        Mark read
        <b-badge variant="danger">
          {{ unseen }}
        </b-badge>
      </b-btn>
      <div v-if="!collapsed" class="d-flex flex-wrap justify-content-between p-1 mt-1 actions">
        <div class="d-flex">
          <b-btn v-if="unseen" variant="white" class="d-none d-md-block mr-2" @click="markRead">
            Mark read
            <b-badge variant="danger">
              {{ unseen }}
            </b-badge>
          </b-btn>
          <div v-if="otheruser && otheruser.info" class="mr-2">
            <b-btn variant="secondary" class="d-none d-md-block" @click="showInfo">
              View profile
            </b-btn>
            <b-btn variant="link" size="sm" class="d-block d-md-none" @click="showInfo">
              View profile
            </b-btn>
          </div>
          <div v-if="chat.chattype === 'User2User' || chat.chattype === 'User2Mod'" class="mr-2">
            <b-btn variant="secondary" class="d-none d-md-block" @click="showhide">
              Hide chat
            </b-btn>
            <b-btn variant="link" size="sm" class="d-block d-md-none" @click="showhide">
              Hide chat
            </b-btn>
          </div>
        </div>
        <div v-if="!collapsed" class="d-flex flex-column justify-content-around clickme" @click="collapsed = true">
          <v-icon name="chevron-circle-up" scale="2" class="text-faded" title="Collapse this section" />
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
      <div v-if="collapsed" class="d-flex justify-content-around clickme collapsedbutton w-100" @click="collapsed = false">
        <v-icon name="chevron-down" scale="2" class="text-faded" title="Expand this section" />
      </div>
      <div v-if="otheruser && otheruser.info">
        <ChatBlockModal v-if="chat.chattype === 'User2User'" :id="id" ref="chatblock" :user="otheruser" @confirm="block" />
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
      <ChatHideModal v-if="chat.chattype === 'User2User' || chat.chattype === 'User2Mod'" :id="id" ref="chathide" :user="otheruser" @confirm="hide" />
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
  mixins: [chat],
  computed: {
    collapsed: {
      get() {
        return this.$store.getters['misc/get']('chatinfoheader')
      },
      set(newVal) {
        this.$store.dispatch('misc/set', {
          key: 'chatinfoheader',
          value: newVal
        })
      }
    },
    loaded() {
      return this.chat && this.otheruser && this.otheruser.info
    }
  },
  watch: {
    loaded() {
      this.$emit('update:loaded', true)
    }
  },
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
  box-shadow: 0px 4px 2px -2px $color-black-opacity-60 !important;
}

.nameinfo {
  display: grid;
  grid-template-columns: 1fr 121px;
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

.collapsedbutton {
  top: 8px;
  position: absolute;
}
</style>
