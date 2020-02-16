<template>
  <div>
    <span ref="breakpoint" class="d-inline d-sm-none" />
    <b-card class="p-0 mb-1" variant="success">
      <b-card-header :class="'pl-2 pr-2 clearfix' + (ispromised ? ' promisedfade' : '')">
        <b-card-title class="msgsubj mb-0 d-block d-sm-none">
          <div>
            <div>
              <Highlighter
                v-if="matchedon"
                :search-words="[matchedon.word]"
                :text-to-highlight="eSubject"
                highlight-class-name="highlight"
              />
              <span v-else>
                {{ eSubject }}
              </span>
            </div>
            <MessageHistory :message="$props" />
          </div>
          <div v-if="attachments && attachments.length > 0" class="d-block mt-1 d-sm-none clickme position-relative" @click="showPhotos">
            <b-badge v-if="attachments.length > 1" class="photobadge" variant="primary">
              +{{ attachments.length - 1 }} <v-icon name="camera" />
            </b-badge>
            <b-img-lazy
              rounded
              fluid-grow
              class="attachment p-0 square"
              generator-unable-to-provide-required-alt=""
              title="Item picture"
              :src="attachments[0].paththumb"
            />
          </div>
          <div class="small">
            <div v-if="eSnippet && eSnippet !== 'null' && !expanded">
              <b class="snippet black">
                <Highlighter
                  v-if="matchedon"
                  :search-words="[matchedon.word]"
                  :text-to-highlight="eSnippet"
                  highlight-class-name="highlight"
                />
                <span v-else>{{ eSnippet }}</span>
                ...
              </b>
            </div>
            <div v-if="(!eSnippet || eSnippet === 'null') && !expanded">
              <i>There's no description.</i>
            </div>
            <b-button v-if="!expanded" variant="white" class="mt-1" @click="expand">
              See details and reply <v-icon name="angle-double-right" />
            </b-button>
          </div>
        </b-card-title>
        <b-card-title class="msgsubj mb-0 d-none d-sm-block">
          <div class="d-flex justify-content-between">
            <div class="d-flex flex-column flex-grow-1">
              <Highlighter
                v-if="matchedon"
                :search-words="[matchedon.word]"
                :text-to-highlight="eSubject"
                highlight-class-name="highlight"
              />
              <span v-else>
                {{ eSubject }}
              </span>
              <MessageHistory :message="$props" display-message-link />
              <div flex-grow-1 class="small">
                <div v-if="eSnippet && eSnippet !== 'null' && !expanded">
                  <b class="snippet black">
                    <Highlighter
                      v-if="matchedon"
                      :search-words="[matchedon.word]"
                      :text-to-highlight="eSnippet"
                      highlight-class-name="highlight"
                    />
                    <span v-else>{{ eSnippet }}</span>
                    ...
                  </b>
                </div>
                <div v-if="(!eSnippet || eSnippet === 'null') && !expanded">
                  <i>There's no description.</i>
                </div>
                <b-button v-if="!expanded" variant="white" class="mt-1" @click="expand">
                  See details and reply <v-icon name="angle-double-right" />
                </b-button>
              </div>
              <div class="d-flex justify-content-between">
                <b-button v-if="expanded && !hideClose" size="sm" variant="link" class="grey" @click="contract">
                  Close post
                </b-button>
                <b-btn
                  v-if="expanded && expanded.groups && expanded.groups.length"
                  variant="link"
                  class="mr-2 grey"
                  size="sm"
                  @click="report"
                >
                  Report this post
                </b-btn>
                <b-btn
                  v-if="expanded"
                  variant="white"
                  class="mr-4"
                  title="Share"
                  size="sm"
                  @click="share"
                >
                  <v-icon name="share-alt" />
                </b-btn>
              </div>
            </div>
            <div v-if="attachments && attachments.length > 0" class="clickme position-relative" @click="showPhotos">
              <b-badge v-if="attachments.length > 1" class="photobadge" variant="primary">
                +{{ attachments.length - 1 }} <v-icon name="camera" />
              </b-badge>
              <b-img-lazy
                rounded
                thumbnail
                class="attachment p-0 square nottoobig"
                generator-unable-to-provide-required-alt=""
                title="Item picture"
                :src="attachments[0].paththumb"
              />
            </div>
          </div>
        </b-card-title>
        <div v-if="expanded" class="d-flex justify-content-between mt-1 d-block d-sm-none">
          <div class="flex-grow-2 ">
            <b-button v-if="expanded && !hideClose" size="sm" variant="link" class="grey" @click="contract">
              Close post
            </b-button>
          </div>
          <div class="flex-grow-1">
            <b-btn
              v-if="expanded.groups && expanded.groups.length"
              variant="link"
              class="mr-2 grey"
              size="sm"
              @click="report"
            >
              Report this post
            </b-btn>
          </div>
          <b-btn
            v-if="expanded"
            variant="white"
            class="mr-1"
            title="Share"
            size="sm"
            @click="share"
          >
            <v-icon name="share-alt" />
          </b-btn>
        </div>
      </b-card-header>
      <b-card-body v-if="expanded" class="pl-1">
        <notice-message v-if="ispromised" variant="warning" class="mb-3 mt-1">
          This item has already been promised to someone.  You can still reply - you might get it if someone
          else drops out.
        </notice-message>

        <p class="prewrap pl-1">
          <Highlighter
            v-if="matchedon"
            :search-words="[matchedon.word]"
            :text-to-highlight="expanded.textbody"
            highlight-class-name="highlight"
          /><span v-else>{{ expanded.textbody }}</span>
        </p>

        <div class="d-flex justify-content-between">
          <MessageUserInfo v-if="expanded.fromuser" :user="expanded.fromuser" :milesaway="milesaway" class="flex-grow-1" />
          <MessageReplyInfo :message="expanded" />
        </div>
      </b-card-body>
      <b-card-footer v-if="expanded" class="p-1 pt-3">
        <NoticeMessage v-if="sent" variant="info" class="d-block d-sm-none mb-1">
          We've sent your message.  You can see replies in the
          <nuxt-link to="/chats">
            <v-icon name="comments" /> Chats
          </nuxt-link> section.
        </NoticeMessage>
        <b-row>
          <b-col class="d-flex">
            <b-form-textarea
              v-if="expanded.type == 'Offer'"
              v-model="reply"
              placeholder="Interested?  Please explain why you'd like it and when you can collect.  Always be polite and helpful."
              rows="3"
              max-rows="8"
              class="flex-shrink-2"
            />
            <b-form-textarea
              v-if="expanded.type == 'Wanted'"
              v-model="reply"
              placeholder="Can you help?  If you have what they're looking for, let them know."
              rows="3"
              max-rows="8"
              class="flex-shrink-2"
            />
            <div class="flex-grow-1 text-right ml-2 d-none d-md-block">
              <b-btn variant="success" :disabled="replying" @click="sendReply">
                Send
                <v-icon v-if="replying" name="sync" class="fa-spin" />
                <v-icon v-else name="angle-double-right" />&nbsp;
              </b-btn>
            </div>
          </b-col>
        </b-row>
        <b-row class="d-block d-md-none mt-2">
          <b-col>
            <b-btn variant="success" block :disabled="replying" @click="sendReply">
              Send
              <v-icon v-if="replying" name="sync" class="fa-spin" />
              <v-icon v-else name="angle-double-right" />&nbsp;
            </b-btn>
          </b-col>
        </b-row>
      </b-card-footer>
    </b-card>
    <b-modal
      v-if="expanded && expanded.attachments && expanded.attachments.length"
      :id="'photoModal-' + id"
      ref="photoModal"
      :title="subject"
      size="lg"
      no-stacking
      ok-only
    >
      <template slot="default">
        <ImageCarousel message-id="message.id" :attachments="expanded.attachments" />
      </template>
      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <b-button variant="white" @click="cancel">
          Close
        </b-button>
      </template>
    </b-modal>
    <ShareModal v-if="expanded && expanded.url" ref="shareModal" :message="expanded" />
    <ChatButton ref="chatbutton" :userid="replyToUser" class="d-none" @sent="sentReply" />
    <MessageReportModal v-if="expanded" ref="reportModal" :message="$props" />
  </div>
</template>

<script>
// Need to import rather than async otherwise the render doesn't happen and ref isn't set.
import ChatButton from './ChatButton'
import ShareModal from './ShareModal'
import MessageReportModal from './MessageReportModal'

import MessageReplyInfo from './MessageReplyInfo'
import twem from '~/assets/js/twem'

const Highlighter = () => import('vue-highlight-words')
const MessageUserInfo = () => import('~/components/MessageUserInfo')
const ImageCarousel = () => import('./ImageCarousel')
const NoticeMessage = () => import('~/components/NoticeMessage')
const MessageHistory = () => import('~/components/MessageHistory')

export default {
  components: {
    MessageReplyInfo,
    ChatButton,
    MessageUserInfo,
    Highlighter,
    ShareModal,
    MessageReportModal,
    ImageCarousel,
    NoticeMessage,
    MessageHistory
  },
  props: {
    id: {
      type: Number,
      default: 0
    },
    subject: {
      type: String,
      default: null
    },
    textbody: {
      type: String,
      default: null
    },
    snippet: {
      type: [String, Boolean],
      default: null
    },
    groups: {
      type: Array,
      default: () => []
    },
    attachments: {
      type: Array,
      default: () => []
    },
    matchedon: {
      type: Object,
      default: null
    },
    promised: {
      type: Boolean,
      required: false,
      default: false
    },
    startExpanded: {
      type: Boolean,
      required: false,
      default: false
    },
    hideClose: {
      type: Boolean,
      required: false,
      default: false
    },
    url: {
      type: String,
      required: false,
      default: null
    },
    milesaway: {
      type: Number,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      reply: null,
      expanded: null,
      replying: false,
      sent: false
    }
  },
  computed: {
    eSubject() {
      return twem.twem(this.$twemoji, this.subject)
    },
    safeBody() {
      return twem.twem(this.$twemoji, this.textbody)
    },
    eSnippet() {
      let snip = null

      if (this.snippet) {
        snip = twem.twem(this.$emoji, this.snippet)
      }

      return snip
    },
    replyToSend() {
      let ret = null
      const me = this.$store.getters['auth/user']

      if (me) {
        ret = this.$store.getters['reply/get']
      }

      return ret
    },
    ispromised() {
      return this.promised || (this.expanded && this.expanded.promised)
    },
    replyToUser() {
      const msg = this.$store.getters['messages/get'](this.id)

      if (msg && msg.fromuser) {
        return msg.fromuser.id
      }

      return null
    }
  },
  watch: {
    async replyToSend(newVal, oldVal) {
      // Because of the way persistent store is restored, we might only find out that we have a reply to send post-mount.
      console.log('replyToSend')
      if (newVal && newVal.replyTo === this.id) {
        await this.expand()
        this.reply = newVal.replyMessage
        this.$nextTick(() => {
          console.log('send it')
          this.sendReply()
        })
      }
    }
  },
  async mounted() {
    if (this.startExpanded) {
      this.expanded = this.$store.getters['messages/get'](this.id)
    }

    const reply = this.replyToSend

    if (reply && reply.replyTo === this.id) {
      // Because of the way persistent store is restored, we might or might not know that we have a reply to send here.
      this.reply = reply.replyMessage
      await this.expand()
      console.log('Send it')
      this.sendReply()
    }
  },
  methods: {
    async expand() {
      await this.$store.dispatch('messages/fetch', {
        id: this.id
      })

      const message = this.$store.getters['messages/get'](this.id)

      this.expanded = message

      const me = this.$store.getters['auth/user']

      if (me) {
        this.$store.dispatch('messages/view', {
          id: this.id
        })
      }
    },

    contract() {
      this.expanded = null
    },

    async showPhotos() {
      await this.expand()
      this.$bvModal.show('photoModal-' + this.id)
    },

    share() {
      this.$refs.shareModal.show()
    },

    report() {
      this.$refs.reportModal.show()
    },

    async sendReply() {
      // We have different buttons which display at different screen sizes.  Which of those is visible and hence
      // clicked tells us whether we want to open this chat in a popup or not.
      const popup = this.sm()
      console.log('Send reply', this.reply, popup)
      if (this.reply) {
        const me = this.$store.getters['auth/user']

        if (me && me.id) {
          // We have several things to do:
          // - join a group if need be (doesn't matter which)
          // - post our reply
          // - open the popup chat so they see what happened
          this.replying = true
          const me = this.$store.getters['auth/user']
          const myGroups = this.$store.getters['auth/groups']
          let found = false
          let tojoin = null

          for (const messageGroup of this.groups) {
            tojoin = messageGroup.groupid
            Object.keys(myGroups).forEach(key => {
              const group = myGroups[key]

              if (messageGroup.groupid === group.id) {
                found = true
              }
            })
          }

          if (!found) {
            // Not currently a member.
            console.log('Need to join')
            await this.$store.dispatch('auth/joinGroup', {
              userid: me.id,
              groupid: tojoin
            })

            // Have to get the message back, because as a non-member we couldn't see who sent it, and therefore
            // who to reply to.
            await this.$store.dispatch('messages/fetch', {
              id: this.id
            })
          }

          // Now create the chat and send the first message.
          console.log('Prepare chat', this.reply, this.id, this.replyToUser)
          this.$nextTick(() => {
            console.log(
              'Now open chat',
              this.reply,
              this.id,
              this.replyToUser,
              popup
            )

            // Open the chat.  We don't want to move from this page - either we'll get a popup chat (so we can
            // see the reply went) or we're on mobile and we'll display the sent message notice.
            this.$refs.chatbutton.openChat(
              null,
              this.reply,
              this.id,
              popup,
              false
            )
          })
        } else {
          // We're not logged in yet.  We need to save the reply and force a sign in.
          //
          // Setting the reply text here will get persisted to the store.  Once we log in and return to the message
          // page, then we will find this in the store and trigger the send of the reply.
          await this.$store.dispatch('reply/set', {
            replyTo: this.id,
            replyMessage: this.reply
          })

          this.$store.dispatch('auth/forceLogin', true)
        }
      }
    },
    async sentReply() {
      // This gets invoked when we have sent a message we passed to ChatButton.
      this.replying = false
      this.sent = true

      // Clear message now sent
      this.reply = null

      await this.$store.dispatch('reply/set', {
        replyTo: null,
        replyMessage: null
      })
    },

    sm() {
      // Detect breakpoint by checking computing style of an element which uses the bootstrap classes
      let ret = false

      if (process.client) {
        const el = this.$refs.breakpoint
        if (el) {
          const display = getComputedStyle(el, null).display
          console.log('Display', display)

          if (display === 'none') {
            ret = true
          }
        }
      }

      console.log('>= Small?', ret)

      return ret
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.card-body {
  padding: 0px;
}

h4 {
  color: $colour-info-fg !important;
  font-weight: bold;
}

h4.snippet {
  color: $color-black !important;
  font-weight: 500;
}

.square {
  object-fit: cover;
  width: 200px;
  height: 200px;
}

.nottoobig {
  max-height: 150px !important;
  max-width: 150px !important;
}

.messagePhoto {
  max-height: 600px !important;
}

.highlight {
  color: $color-orange--dark;
  background-color: initial;
}

.photobadge {
  right: 10px;
  position: absolute;
  top: 10px;
}

.msgsubj {
  color: $colour-info-fg !important;
}

.highlight {
  padding: 0;
}

.promisedfade {
  opacity: 0.3;
}

.grey {
  color: $color-gray--base;
}
</style>
