<template>
  <div v-if="me">
    <client-only>
      <div :style="'position: fixed; right: ' + right + 'px; bottom: 0'">
        <vue-draggable-resizable
          :handles="['tl']"
          :w="width"
          :h="height"
          :parent="false"
          :draggable="false"
          :active="true"
          :prevent-deactivation="true"
          :min-width="320"
          :min-height="minheight"
          :max-height="maxheight"
          :style="'right: ' + width"
          @resizing="onResize"
        >
          <div class="shadow chatHolder w-100">
            <div v-if="chat" class="chatTitle flex-shrink-0">
              <span class="chatname text-truncate align-middle ml-3">
                <span v-if="(chat.chattype == 'User2User' || chat.chattype == 'User2Mod')">
                  <span @click="showInfo">
                    {{ chat.name }}
                  </span>
                </span>
                <span v-else>
                  {{ chat.name }}
                </span>
              </span>
              <span v-if="chat.unseen">
                <b-badge variant="danger">{{ chat.unseen }}</b-badge>
              </span>
              <ratings v-if="otheruser" :id="otheruser.id" :key="'otheruser-' + (otheruser ? otheruser.id : null)" size="sm" class="pl-1 pt-1" />
              <span class="pl-2 pr-1 float-right" @click="hide">
                <v-icon name="times" scale="1.5" class="clickme mt-1" title="Hide chat window" />
              </span>
              <span class="pl-1 float-right" @click="maximise">
                <v-icon name="window-maximize" scale="1.5" class="clickme mt-1" title="Maximise chat window" />
              </span>
            </div>
            <div v-if="chat" class="chatContent m-0" infinite-wrapper>
              <infinite-loading direction="top" force-use-infinite-wrapper="true" :distance="distance" @infinite="loadMore">
                <span slot="no-results" />
                <span slot="no-more" />
                <span slot="spinner">
                  <b-img-lazy src="~/static/loader.gif" alt="Loading" />
                </span>
              </infinite-loading>
              <ul v-for="chatmessage in chatmessages" :key="'chatmessage-' + chatmessage.id" class="p-0 pt-1 list-unstyled mb-1">
                <li v-if="chatmessage">
                  <ChatMessage
                    :key="'chatmessage-' + chatmessage.id"
                    :chatmessage="chatmessage"
                    :chat="chat"
                    :otheruser="otheruser"
                    :last="chatmessage.id === chatmessages[chatmessages.length - 1].id"
                    :chatusers="chatusers"
                  />
                </li>
              </ul>
            </div>
            <div class="chatFooter flex-shrink-0">
              <p v-if="spammer && spammer.collection !== 'Whitelisted'" class="bg-danger white p-2 mb-0">
                This person has been reported as a spammer or scammer.  Please do not talk to them and under no circumstances
                send them any money.
              </p>
              <div v-if="showNotices && mod && chat && chat.chattype === 'User2Mod' && otheruser">
                <span class="float-right mr-2 mt-2 clickme" title="Hide warnings" @click="showNotices = false">
                  <v-icon name="times-circle" scale="1.5" />
                </span>
                <ModComments v-if="mod && chat && chat.chattype === 'User2Mod' && otheruser" :user="otheruser" class="mt-1" />
              </div>
              <b-form-textarea
                v-if="!spammer && enterNewLine"
                ref="chatarea"
                v-model="sendmessage"
                placeholder="Type here..."
                rows="2"
                max-rows="4"
                @focus="markRead"
              />
              <b-form-textarea
                v-else-if="!spammer"
                ref="chatarea"
                v-model="sendmessage"
                placeholder="Type here..."
                rows="2"
                max-rows="4"
                autocapitalize="none"
                @keydown.enter.exact.prevent
                @keyup.enter.exact="send"
                @keydown.enter.shift.exact="newline"
                @keydown.alt.shift.exact="newline"
                @focus="markRead"
              />
              <div v-if="!spammer" class="pt-1 pb-1">
                <b-btn v-b-tooltip.hover.top variant="white" title="Promise an item to this person" class="ml-1" @click="promise">
                  <v-icon name="handshake" />
                </b-btn>
                <b-btn v-if="!simple" v-b-tooltip.hover.top variant="white" title="Send your address" @click="addressBook">
                  <v-icon name="address-book" />
                </b-btn>
                <b-btn v-if="!simple" v-b-tooltip.hover.top variant="white" title="Update your availability" @click="availability">
                  <v-icon name="calendar-alt" />
                </b-btn>
                <b-btn v-b-tooltip.hover.top variant="white" title="Info about this freegler" @click="showInfo">
                  <v-icon name="info-circle" />
                </b-btn>
                <b-btn v-if="!simple && !tooSoonToNudge" v-b-tooltip.hover.top variant="white" title="Waiting for a reply?  Nudge this freegler." @click="nudge">
                  <v-icon name="bell" />
                </b-btn>
                <b-btn v-if="!simple && tooSoonToNudge" v-b-tooltip.hover.top variant="white" title="It's too soon to nudge" disabled>
                  <v-icon name="bell" />
                </b-btn>

                <b-btn variant="primary" class="float-right mr-1" @click="send">
                  <v-icon v-if="sending" name="sync" class="fa-spin" title="Sending..." />
                  <v-icon v-else name="angle-double-right" title="Send" />
                </b-btn>
              </div>
            </div>
          </div>
        </vue-draggable-resizable>
        <PromiseModal ref="promise" :messages="ouroffers" :selected-message="likelymsg ? likelymsg : 0" :users="otheruser ? [ otheruser ] : []" :selected-user="otheruser ? otheruser.id : null" />
        <ProfileModal v-if="otheruser" :id="otheruser ? otheruser.id : null" ref="profile" />
        <AvailabilityModal ref="availabilitymodal" :otheruid="otheruser ? otheruser.id : null" :thisuid="me.id" />
        <AddressModal ref="addressModal" :choose="true" @chosen="sendAddress" />
        <NudgeWarningModal ref="nudgewarning" @confirm="doNudge" />
      </div>
    </client-only>
  </div>
</template>
<script>
import { TooltipPlugin } from 'bootstrap-vue'
import Vue from 'vue'
import InfiniteLoading from 'vue-infinite-loading'
import VueDraggableResizable from 'vue-draggable-resizable/src/components/vue-draggable-resizable'
import ModComments from './ModComments'
import waitForRef from '@/mixins/waitForRef'
import chat from '@/mixins/chat.js'

// Don't use dynamic imports because it stops us being able to scroll to the bottom after render.
import ChatMessage from '~/components/ChatMessage.vue'
import chatCollate from '@/mixins/chatCollate.js'

Vue.use(TooltipPlugin)
const Ratings = () => import('~/components/Ratings')
const PromiseModal = () => import('./PromiseModal')
const ProfileModal = () => import('./ProfileModal')
const AvailabilityModal = () => import('~/components/AvailabilityModal')
const AddressModal = () => import('~/components/AddressModal')
const NudgeWarningModal = () => import('~/components/NudgeWarningModal')

const HEIGHT = 400

export default {
  components: {
    ModComments,
    InfiniteLoading,
    VueDraggableResizable,
    Ratings,
    ChatMessage,
    PromiseModal,
    ProfileModal,
    AvailabilityModal,
    AddressModal,
    NudgeWarningModal
  },
  mixins: [chatCollate, waitForRef, chat],
  computed: {
    minheight() {
      return Math.min(this.maxheight, HEIGHT)
    },
    maxheight() {
      // We should not exceed the height of the navbar
      let ret = null

      if (process.client) {
        ret = window.innerHeight - 68 - 50
      }

      return ret
    },
    width() {
      return this.chat && this.chat.remember && this.chat.remember.width
        ? this.chat.remember.width
        : 320
    },
    height() {
      return this.chat && this.chat.remember && this.chat.remember.height
        ? this.chat.remember.height
        : HEIGHT
    },
    right() {
      let right = 0
      const popups = Object.values(this.$store.getters['popupchats/list'])

      if (popups) {
        for (const popup of popups) {
          const width = popup.width ? parseInt(popup.width) : 320
          right += width

          if (parseInt(popup.id) === this.id) {
            break
          }
        }
      }
      return right
    }
  },
  mounted() {
    if (this.notVisible) {
      // This is an invalid chatid.  Remove it to stop it causing problems.
      this.hide()
    }

    if (process.client) {
      // Slightly clunky way to spot if a chat popup is too large for the screen.
      setTimeout(() => {
        const els = document.getElementsByClassName('resizable')
        for (let i = 0; i < els.length; i++) {
          const el = els[i]
          const height = el.style.height

          if (height) {
            if (parseInt(el.style.height.replace('px', '')) > this.maxheight) {
              el.style.height = this.maxheight + 'px'
            }
          }
        }
      }, 5000)
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('popupchats/hide', { id: this.chat.id })
    },
    maximise() {
      const modtools = this.$store.getters['misc/get']('modtools')
      this.$store.dispatch('popupchats/hide', { id: this.chat.id })
      this.$router.push(
        (modtools ? '/modtools' : '') + '/chats/' + this.chat.id
      )
    },
    onResize: function(x, y, width, height) {
      this.$store.dispatch('popupchats/popup', {
        id: this.id,
        width: width,
        height: height
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.vdr {
  position: absolute;
  top: initial !important;
  left: initial !important;
  bottom: 0;
  z-index: 900;
  background-color: $color-yellow--base;
  animation: chatIn 2s;
  transform-origin: right bottom;
  background-color: transparent !important;
  display: flex;
}

.chatHolder {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid $color-gray--dark;
}

.chatname {
  display: inline-block;
  max-width: 100px;
  font-weight: bold;
  color: $color-white;
}

.shadow {
  box-shadow: 1px 3px 5px 3px $color-black-opacity-60 !important;
}

@keyframes chatIn {
  0% {
    transform: scale(0.1);
    opacity: 0;
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.chatTitle {
  background-color: $color-blue--light;
  color: $color-white;
  font-weight: bold;
  order: 1;
  flex-shrink: 0;
}

.chatContent {
  order: 3;
  justify-content: flex-start;
  flex-grow: 1;
  overflow-y: auto;
  background-color: $color-yellow--base;
}

.chatFooter {
  order: 4;
  justify-content: flex-end;
  background-color: $color-white;
  flex-shrink: 0;
}
</style>
