<template>
  <div>
    <b-card class="p-0 mb-1" variant="success">
      <b-card-header class="pl-2 pr-2 clearfix">
        <b-card-title class="msgsubj mb-0">
          <span v-if="attachments && attachments.length > 0" class="float-right clickme" @click="showPhotos">
            <b-badge v-if="attachments.length > 1" class="photobadge" variant="primary">+{{ attachments.length - 1 }} <v-icon name="camera" /></b-badge>
            <b-img-lazy
              rounded
              thumbnail
              class="attachment p-0 square"
              alt="Item picture"
              title="Item picture"
              :src="attachments[0].paththumb"
            />
            <br>
          </span>
          <b-btn v-if="expanded" variant="white" class="float-right mr-1" title="Share" @click="share">
            <v-icon name="share-alt" />
          </b-btn>
          <Highlighter
            v-if="matchedon"
            :search-words="[matchedon.word]"
            :text-to-highlight="eSubject"
            highlight-class-name="highlight"
          />
          <span v-else>
            {{ eSubject }}
          </span>
        </b-card-title>
        <span v-for="group in groups" :key="'message-' + id + '-' + group.id" class="small muted">
          {{ group.arrival | timeago }} on {{ group.namedisplay }}
          <nuxt-link :to="'/message/' + id" class="text-sm small text-faded">
            #{{ id }}&nbsp;
          </nuxt-link>
        </span>
        <div v-if="eSnippet && eSnippet !== 'null' && !expanded">
          <h4 class="snippet">
            <Highlighter
              v-if="matchedon"
              :search-words="[matchedon.word]"
              :text-to-highlight="eSnippet"
              highlight-class-name="highlight"
            />
            <span v-else>{{ eSnippet }}</span>
            ...
          </h4>
        </div>
        <div v-if="!eSnippet || eSnippet === 'null' && !expanded">
          <i>There's no description.</i>
        </div>
        <b-button v-if="!expanded" variant="white" @click="expand">
          Read more and reply <v-icon name="angle-double-right" />
        </b-button>
      </b-card-header>
      <b-card-body v-if="expanded" class="pl-1">
        <b-alert v-if="expanded.promised" variant="info">
          This item has already been promised to someone.  You can still reply - you might get it if someone
          else drops out.
        </b-alert>

        <p class="prewrap pl-1">
          <Highlighter
            v-if="matchedon"
            :search-words="[matchedon.word]"
            :text-to-highlight="expanded.textbody"
            highlight-class-name="highlight"
          /><span v-else>{{ expanded.textbody }}</span>
        </p>

        <MessageUserInfo v-if="expanded.fromuser" :user="expanded.fromuser" />
        <span v-if="expanded.replycount" class="float-right small text-muted mr-1">
          <v-icon name="user" class="d-inline" />&nbsp;<span class="d-inline">{{ expanded.replycount }}&nbsp;freegler<span v-if="expanded.replycount != 1">s</span>&nbsp;replied&nbsp;</span>
        </span>
      </b-card-body>
      <b-card-footer v-if="expanded" class="p-1 pt-3">
        <b-row>
          <b-col class="d-flex">
            <b-form-textarea
              v-if="expanded.type == 'Offer'"
              v-model="reply"
              v-focus
              placeholder="Interested?  Please explain why you'd like it and when you can collect.  Always be polite and helpful."
              rows="3"
              max-rows="8"
              class="flex-shrink-2"
            />
            <b-form-textarea
              v-if="expanded.type == 'Wanted'"
              v-model="reply"
              v-focus
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
              <!--              TODO DESIGN If you've gone through sign in, and your eye is therefore elsewhere, this method of -->
              <!--              indicating that we are sending a reply is probably too subtle to notice.-->
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
        <ImageCarousel v-if="expanded.attachments.length > 1" message-id="message.id" :attachments="expanded.attachments" />
        <div v-else>
          <b-img
            slot="img"
            center
            class="d-block img-fluid w-100 messagePhoto"
            :src="attachments[0].path"
            :alt="'Message photo'"
          />
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <b-button variant="white" @click="cancel">
          Close
        </b-button>
      </template>
    </b-modal>
    <ShareModal v-if="expanded" ref="shareModal" :message="$props" />
    <ChatButton v-if="expanded && expanded.fromuser" ref="chatbutton" :userid="expanded.fromuser.id" class="d-none" />
  </div>
</template>
<style scoped>
.highlight {
  padding: 0;
}
</style>

<script>
// TODO Report this post
// Need to import rather than async otherwise the render doesn't happen and ref isn't set.
import ChatButton from './ChatButton'
import ShareModal from './ShareModal'
import twem from '~/assets/js/twem'

const Highlighter = () => import('vue-highlight-words')
const MessageUserInfo = () => import('~/components/MessageUserInfo')
const ImageCarousel = () => import('./ImageCarousel')

export default {
  components: {
    ChatButton,
    MessageUserInfo,
    Highlighter,
    ShareModal,
    ImageCarousel
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
    fromuser: {
      validator: prop => typeof prop === 'object' || typeof prop === 'number',
      default: null
    },
    startExpanded: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      reply: null,
      expanded: null,
      replying: false
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
      const me = this.$store.getters['auth/user']()

      if (me) {
        ret = this.$store.getters['reply/get']()
      }

      return ret
    }
  },
  watch: {
    replyToSend(newVal, oldVal) {
      // Because of the way persistent store is restored, we might only find out that we have a reply to send post-mount.
      if (newVal) {
        console.log('Send on watch')
        this.reply = newVal.replyMessage
        this.sendReply()
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
    },

    async showPhotos() {
      await this.expand()
      this.$bvModal.show('photoModal-' + this.id)
    },

    share() {
      this.$refs.shareModal.show()
    },

    async sendReply() {
      console.log('Send reply', this.reply, this.$refs, this.expanded)

      if (this.reply) {
        const me = this.$store.getters['auth/user']()

        if (me && me.id) {
          // We have several things to do:
          // - join a group if need be (doesn't matter which)
          // - post our reply
          // - open the popup chat so they see what happened
          this.replying = true
          const me = this.$store.getters['auth/user']()
          const myGroups = this.$store.getters['auth/groups']()
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
            await this.$store.dispatch('auth/joinGroup', {
              userid: me.id,
              groupid: tojoin
            })
          }

          // TODO If the group approves membership, then we will not actually be a member at this point, and might not
          // become one if we are rejected.  Probably in that case we shouldn't be allowed to reply to this message, but
          // we will.  I think this is the same behaviour as in the old version, but that needs testing and consideration
          // of how to handle.

          // Now create the chat and send the first message.
          await this.$refs.chatbutton.openChat(null, this.reply, this.id)
          this.replying = false

          // Clear message now sent
          this.reply = null

          await this.$store.dispatch('reply/set', {
            replyTo: null,
            replyMessage: null
          })
        } else {
          // We're not logged in yet.  We need to save the reply and force a sign in.
          //
          // Setting the reply text here will get persisted to the store.  Once we log in and return to the message
          // page, then we will find this in the store and trigger the send of the reply.
          // TODO The store is persisted asynchronously.  Probably it will have happened before the signin completes,
          // but we don't actually guarantee that.
          await this.$store.dispatch('reply/set', {
            replyTo: this.id,
            replyMessage: this.reply
          })

          // TODO We're getting redirected away from the page.
          this.$store.dispatch('auth/forceLogin', true)
        }
      }
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

img.attachment {
  max-height: 150px !important;
  max-width: 150px !important;
}

.messagePhoto {
  max-height: 600px !important;
}

.highlight {
  color: darkorange;
  background-color: initial;
}

.photobadge {
  left: 150px;
  top: -54px;
  position: relative;
}

.msgsubj {
  color: $colour-info-fg !important;
}
</style>
