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
          <div class="chatFooter">
            <b-row v-if="uploading" class="bg-white">
              <b-col class="p-0">
                <OurFilePond
                  imgtype="ChatMessage"
                  imgflag="chatmessage"
                  @photoProcessed="photoProcessed"
                />
              </b-col>
            </b-row>
            <b-row>
              <b-col class="p-0">
                <div v-if="showNotices && (badratings || expectedreply || otheruser && otheruser.hasReneged || !spammer && replytime || spammer && spammer.collection !== 'Whitelisted' || mod && chat && chat.chattype === 'User2Mod' && otheruser)">
                  <span class="float-right mr-2 mt-2 clickme" title="Hide warnings" @click="showNotices = false">
                    <v-icon name="times-circle" scale="1.5" />
                  </span>
                  <notice-message v-if="badratings" variant="warning" class="clickme" @click.native="showInfo">
                    <p>
                      <v-icon name="exclamation-triangle" />&nbsp;This freegler has a lot of thumbs down ratings.
                      That might not be their fault, but please make very clear arrangements.  If you have a good
                      experience with them, give them a thumbs up.
                    </p>
                    <Ratings v-if="otheruser" :id="otheruserid" :key="'otheruser-' + otheruserid" />
                  </notice-message>
                  <notice-message v-else-if="expectedreply" variant="warning" class="clickme" @click.native="showInfo">
                    <v-icon name="exclamation-triangle" />&nbsp;{{ expectedreply | pluralize(['freegler is', 'freeglers are'], { includeNumber: true }) }} still waiting for them to reply.  You might not hear back from them.
                  </notice-message>
                  <notice-message v-else-if="otheruser && otheruser.hasReneged" variant="warning" class="clickme" @click.native="showInfo">
                    <v-icon name="exclamation-triangle" />&nbsp;Things haven't always worked out for this freegler.  That might not be their fault, but please make very clear arrangements.
                  </notice-message>
                  <notice-message v-if="!spammer && replytime" class="clickme" @click.native="showInfo">
                    <v-icon name="info-circle" />&nbsp;Typically replies in <b>{{ replytime }}</b>.  Click for more info.
                  </notice-message>
                  <notice-message v-if="spammer && spammer.collection !== 'Whitelisted'" variant="danger">
                    This person has been reported as a spammer or scammer.  Please do not talk to them and under no circumstances
                    send them any money.
                  </notice-message>
                  <ModComments v-if="mod && chat && chat.chattype === 'User2Mod' && otheruser" :user="otheruser" class="mt-1" />
                </div>
                <b-form-textarea
                  v-if="enterNewLine && !spammer"
                  ref="chatarea"
                  v-model="sendmessage"
                  placeholder="Type here..."
                  rows="3"
                  max-rows="8"
                  @focus="markRead"
                />
                <b-form-textarea
                  v-else-if="!spammer"
                  ref="chatarea"
                  v-model="sendmessage"
                  placeholder="Type here..."
                  rows="3"
                  autocapitalize="none"
                  @keydown.enter.exact.prevent
                  @keyup.enter.exact="send"
                  @keydown.enter.shift.exact.prevent="newline"
                  @keydown.alt.shift.exact.prevent="newline"
                  @focus="markRead"
                />
              </b-col>
            </b-row>
            <b-row v-if="!spammer" class="bg-white">
              <b-col class="p-0 pt-1 pb-1">
                <div class="d-none d-lg-block">
                  <span v-if="chat && chat.chattype === 'User2User' && otheruser">
                    <b-btn v-b-tooltip.hover.top variant="white" title="Promise an item to this person" @click="promise">
                      <v-icon name="handshake" class="fa-fw" />&nbsp;Promise
                    </b-btn>
                    <b-btn v-if="!simple" v-b-tooltip.hover.top variant="white" title="Send your address" @click="addressBook">
                      <v-icon name="address-book" class="fa-fw" />&nbsp;Address
                    </b-btn>
                    <b-btn v-if="!simple" v-b-tooltip.hover.top variant="white" title="Update your availability" @click="availability">
                      <v-icon name="calendar-alt" class="fa-fw" />&nbsp;Availability
                    </b-btn>
                    <b-btn v-b-tooltip.hover.top variant="white" title="Info about this freegler" @click="showInfo">
                      <v-icon name="info-circle" class="fa-fw" />&nbsp;Info
                    </b-btn>
                    <b-btn v-if="!simple" v-b-tooltip.hover.top variant="white" title="Waiting for a reply?  Nudge this freegler." @click="nudge">
                      <v-icon name="bell" class="fa-fw" />&nbsp;Nudge
                    </b-btn>
                  </span>
                  <span v-if="chat && chat.chattype === 'User2Mod'">
                    <b-btn v-if="otheruser" v-b-tooltip.hover.top variant="white" title="Info about this freegler" @click="showInfo">
                      <v-icon name="info-circle" />&nbsp;Info
                    </b-btn>
                    <b-btn v-if="mod" variant="white" @click="spamReport">
                      <v-icon name="ban" /> Spammer
                    </b-btn>
                    <external-link href="https://discourse.ilovefreegle.org/c/central" class="nocolor btn btn-white">
                      <v-icon name="question-circle" /> Central
                    </external-link>
                    <ModSpammerReport v-if="showSpamModal" ref="spamConfirm" :user="otheruser" />
                  </span>
                  <b-btn variant="primary" class="float-right ml-1" @click="send">
                    Send&nbsp;
                    <v-icon v-if="sending" name="sync" class="fa-spin" title="Sending..." />
                    <v-icon v-else name="angle-double-right" title="Send" />
                  </b-btn>
                  <b-btn variant="white" class="float-right" @click="photoAdd">
                    <v-icon name="camera" />
                  </b-btn>
                </div>
                <div class="d-flex d-lg-none justify-content-between align-middle">
                  <div v-if="chat && chat.chattype === 'User2User' && otheruser" v-b-tooltip.hover.top title="Promise an item to this person" class="ml-1 mr-2" @click="promise">
                    <v-icon scale="2" name="handshake" class="fa-mob" />
                    <div class="mobtext">
                      Promise
                    </div>
                  </div>
                  <div
                    v-if="chat && chat.chattype === 'User2User' && otheruser"
                    v-b-tooltip.hover.top
                    title="Send your address"
                    disabled
                    class="mr-2"
                    @click="addressBook"
                  >
                    <v-icon scale="2" name="address-book" class="fa-mob" />
                    <div class="mobtext">
                      Address
                    </div>
                  </div>
                  <div v-if="chat && chat.chattype === 'User2User' && otheruser" v-b-tooltip.hover.top title="Update your availability" class="mr-2" @click="availability">
                    <v-icon scale="2" name="calendar-alt" class="fa-mob" />
                    <div class="mobtext">
                      Available
                    </div>
                  </div>
                  <div v-if="otheruser" v-b-tooltip.hover.top title="Info about this freegler" class="mr-2" @click="showInfo">
                    <v-icon scale="2" name="info-circle" class="fa-mob" />
                    <div class="mobtext">
                      Info
                    </div>
                  </div>
                  <div v-if="chat && chat.chattype === 'User2Mod' && mod" v-b-tooltip.hover.top title="Report as spammer" class="mr-2" @click="spamReport">
                    <v-icon scale="2" name="ban" class="fa-mob" />
                    <div class="mobtext">
                      Spammer
                    </div>
                  </div>
                  <div v-if="chat && chat.chattype === 'User2Mod' && mod" v-b-tooltip.hover.top title="Ask on Central for help" class="mr-2">
                    <external-link href="https://discourse.ilovefreegle.org/c/central" class="nocolor">
                      <v-icon scale="2" name="question-circle" class="fa-mob" />
                    </external-link>
                    <div class="mobtext">
                      Central
                    </div>
                  </div>
                  <div v-if="chat && chat.chattype === 'User2User' && otheruser" v-b-tooltip.hover.top title="Waiting for a reply?  Nudge this freegler." class="mr-2" @click="nudge">
                    <v-icon scale="2" name="bell" class="fa-mob" />
                    <div class="mobtext">
                      Nudge
                    </div>
                  </div>
                  <div class="" @click="photoAdd">
                    <v-icon scale="2" name="camera" class="fa-mob" />
                    <div class="mobtext">
                      Photo
                    </div>
                  </div>
                  <b-btn variant="secondary" @click="send">
                    Send
                    <v-icon v-if="sending" name="sync" class="fa-spin" title="Sending..." />
                    <v-icon v-else name="angle-double-right" title="Send" />
                  </b-btn>
                </div>
              </b-col>
            </b-row>
          </div>
          <PromiseModal ref="promise" :messages="ouroffers" :selected-message="likelymsg ? likelymsg : 0" :users="otheruser ? [ otheruser ] : []" :selected-user="otheruser ? otheruser.id : null" />
          <ProfileModal v-if="otheruser" :id="otheruser ? otheruser.id : null" ref="profile" />
          <AvailabilityModal v-if="me && chat" ref="availabilitymodal" :otheruid="otheruser ? otheruser.id : null" :chatid="chat.id" :thisuid="me.id" />
          <AddressModal ref="addressModal" :choose="true" @chosen="sendAddress" />
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
          <ChatRSVPModal v-if="RSVP" :id="id" ref="rsvp" :user="otheruser" />
        </div>
      </client-only>
    </div>
  </div>
</template>
<script>
import { TooltipPlugin } from 'bootstrap-vue'
import Vue from 'vue'
import InfiniteLoading from 'vue-infinite-loading'
import ChatFooter from './ChatFooter'
import ChatHeader from './ChatHeader'
import chatCollate from '@/mixins/chatCollate.js'
import chat from '@/mixins/chat.js'
import waitForRef from '@/mixins/waitForRef'

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
