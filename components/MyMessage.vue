<template>
  <div>
    <div v-if="showOld || !message.outcomes || !message.outcomes.length">
      <b-card no-body class="mb-1 border" :border-variant="expanded ? 'primary' : 'success'">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button
            :v-b-toggle="'mypost-' + message.id"
            block
            href="#"
            variant="white"
            class="text-left text-truncate noborder"
            @click="toggle"
          >
            <b-row>
              <b-col>
                <div class="d-flex">
                  <h3 class="text-wrap flex-shrink-2">
                    {{ message.subject }}
                    <span v-if="rejected" class="text-danger">
                      <v-icon name="exclamation-triangle" scale="2" />
                    </span>
                  </h3>
                  <div class="flex-grow-1 text-right">
                    <span v-if="message.replycount > 0" class="ml-1">
                      <b-badge variant="info">
                        <v-icon name="user" class="fa-fw" /> {{ message.replycount | pluralize(['reply', 'replies'], { includeNumber: true }) }}
                      </b-badge>
                    </span>
                    <span v-if="message.promisecount > 0" class="ml-1">
                      <b-badge variant="success">
                        <v-icon name="handshake" class="fa-fw" /> Promised
                      </b-badge>
                    </span>
                    <span v-if="unseen > 0" class="ml-1">
                      <b-badge variant="danger">
                        <v-icon name="comments" class="fa-fw" /> {{ unseen }} unread
                      </b-badge>
                    </span>
                    <b-btn class="ml-1" variant="white">
                      <v-icon v-if="!expanded" name="caret-down" />
                      <v-icon v-else name="caret-up" />
                      <template slot="button-content" />
                    </b-btn>
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-button>
        </b-card-header>
        <b-collapse :id="'mypost-' + message.id" :visible="expanded" role="tabpanel" @show="expanded = true" @hidden="expanded = false">
          <div v-if="expanded">
            <b-card-body class="p-2">
              <b-card-text>
                <notice-message v-if="rejected" class="mb-3">
                  <v-icon name="exclamation-triangle" scale="2" /> This post has been returned to you.
                </notice-message>
                <span v-if="message.attachments.length > 0" class="float-right clickme" @click="showPhotos">
                  <b-badge v-if="message.attachments.length > 1" class="photobadge" variant="primary">+{{ message.attachments.length - 1 }} <v-icon name="camera" /></b-badge>
                  <b-img-lazy
                    rounded
                    thumbnail
                    class="attachment p-0 square mb-1"
                    alt="Item picture"
                    title="Item picture"
                    :src="message.attachments[0].paththumb"
                  />
                </span>
                <p>
                  <span v-for="group in message.groups" :key="'message-' + message.id + '-' + group.id" class="small text-muted">
                    {{ group.arrival | timeago }} on {{ group.namedisplay }} <span class="text-faded small">#{{ message.id }}</span>
                  </span>
                </p>
                <span class="prewrap">
                  <read-more v-if="message && message.textbody" :text="message.textbody" :max-chars="maxChars" class="nopara" />
                </span>
                <hr>
                <table v-if="replies.length > 0" class="table table-borderless table-striped mb-0">
                  <tbody>
                    <tr v-for="reply in replies" :key="'reply-' + reply.id">
                      <MyMessageReply :reply="reply" :chats="chats" :message="message" />
                    </tr>
                  </tbody>
                </table>
                <p v-else class="text-muted">
                  No replies yet. <span v-if="message.willautorepost && message.canrepostat">Will auto-repost {{ message.canrepostat | timeago }}.</span>
                </p>
              </b-card-text>
            </b-card-body>
            <b-card-footer>
              <div class="float-right text-faded">
                <b-btn variant="white" title="Share" @click="share">
                  <v-icon name="share-alt" /> Share
                </b-btn>
                <br>
                <nuxt-link :to="'/message/' + message.id" target="_blank" class="text-faded">
                  #{{ message.id }}
                </nuxt-link>
              </div>
              <b-list-group v-if="rejected" horizontal class="flex-wrap">
                <b-list-group-item>
                  <b-btn variant="warning" class="d-inline mr-1" @click="repost">
                    <v-icon name="pen" /> Edit and Resend
                  </b-btn>
                </b-list-group-item>
                <b-list-group-item>
                  <b-btn variant="white" class="d-inline mr-1" @click="outcome('Withdrawn')">
                    <v-icon name="trash-alt" /> Withdraw
                  </b-btn>
                </b-list-group-item>
              </b-list-group>
              <b-list-group v-else horizontal class="flex-wrap">
                <b-list-group-item v-if="message.type === 'Offer' && (!message.outcomes || !message.outcomes.length)" li>
                  <b-btn variant="success" class="d-inline mr-1" @click="outcome('Taken')">
                    <v-icon name="check" /> Mark as TAKEN
                  </b-btn>
                </b-list-group-item>
                <b-list-group-item v-else-if="message.type === 'Wanted' && (!message.outcomes || !message.outcomes.length)">
                  <b-btn variant="success" class="d-inline mr-1" @click="outcome('Received')">
                    <v-icon name="check" /> Mark as Received
                  </b-btn>
                </b-list-group-item>
                <b-list-group-item v-if="!message.outcomes || !message.outcomes.length">
                  <b-btn variant="white" class="d-inline mr-1" @click="outcome('Withdrawn')">
                    <v-icon name="trash-alt" /> Withdraw
                  </b-btn>
                </b-list-group-item>
                <b-list-group-item>
                  <b-btn variant="primary" class="d-inline mr-1" @click="edit">
                    <v-icon name="pen" /> Edit
                  </b-btn>
                </b-list-group-item>
                <b-list-group-item v-if="message.canrepost">
                  <b-btn variant="white" class="d-inline mr-1" @click="repost">
                    <v-icon name="sync" /> Post Again
                  </b-btn>
                </b-list-group-item>
                <b-list-group-item v-else-if="message.canrepostat">
                  <b-btn variant="white" disabled class="d-inline mr-1" title="You will be able to repost this soon">
                    <v-icon name="sync" /> Post Again <span class="small">{{ message.canrepostat | timeago }}</span>
                  </b-btn>
                </b-list-group-item>
              </b-list-group>
            </b-card-footer>
          </div>
        </b-collapse>
      </b-card>
      <b-modal
        v-if="expanded && message.attachments.length"
        :id="'photoModal-' + message.id"
        ref="photoModal"
        :title="message.subject"
        size="lg"
        no-stacking
        ok-only
      >
        <template slot="default">
          <ImageCarousel message-id="message.id" :attachments="message.attachments" />
        </template>
      </b-modal>
    </div>
    <OutcomeModal ref="outcomeModal" :message="message" :users="replyusers" />
    <ShareModal ref="shareModal" :message="message" />
    <MessageEditModal ref="editModal" :message="message" />
  </div>
</template>

<style scoped lang="scss">
@import 'color-vars';

.square {
  object-fit: cover;
  width: 75px;
  height: 75px;
}

img.attachment {
  max-height: 75px !important;
  max-width: 75px !important;
}

.messagePhoto {
  max-height: 600px !important;
}

.photobadge {
  left: 150px;
  top: -54px;
  position: relative;
}

.noborder {
  border: none !important;
  border-color: $color-white !important;
}
</style>
<script>
import ResizeText from 'vue-resize-text'
import OutcomeModal from './OutcomeModal'
const MyMessageReply = () => import('./MyMessageReply.vue')
const ShareModal = () => import('./ShareModal')
const MessageEditModal = () => import('./MessageEditModal')
const ImageCarousel = () => import('./ImageCarousel')
const NoticeMessage = () => import('~/components/NoticeMessage')

export default {
  directives: {
    ResizeText
  },
  components: {
    OutcomeModal,
    ShareModal,
    MyMessageReply,
    MessageEditModal,
    ImageCarousel,
    NoticeMessage
  },
  props: {
    message: {
      type: Object,
      required: true
    },
    messages: {
      type: Array,
      required: true
    },
    showOld: {
      type: Boolean,
      required: true
    },
    expand: {
      type: Boolean,
      required: false
    }
  },
  data: function() {
    return {
      maxChars: 60,
      expanded: false
    }
  },
  computed: {
    unseen() {
      // We want all the chats from replies.  We fetch them in myposts, here we only need to
      // get them from the store
      const chats = Object.values(this.$store.getters['chats/list'])
      let unseen = 0

      for (const reply of this.message.replies) {
        for (const chat of chats) {
          if (chat.id === reply.chatid) {
            unseen += chat.unseen
          }
        }
      }

      return unseen
    },

    rejected() {
      let rejected = false

      for (const group of this.message.groups) {
        if (group.collection === 'Rejected') {
          rejected = true
        }
      }

      return rejected
    },

    replies() {
      // Show the replies with unseen messages first, then most recent
      // console.log('Sort replies', this.message.replies, this)
      const self = this
      return [...this.message.replies].sort((a, b) => {
        const aunseen = self.countUnseen(a)
        const bunseen = self.countUnseen(b)
        const adate = new Date(a.lastdate).getTime()
        const bdate = new Date(b.lastdate).getTime()

        // console.log('Unseen', aunseen, bunseen, adate, bdate)
        if (aunseen !== bunseen) {
          return bunseen - aunseen
        } else {
          return bdate - adate
        }
      })
    },

    replyusers() {
      const ret = []
      const retids = []

      for (const reply of this.message.replies) {
        if (retids.indexOf(reply.user.id) === -1) {
          ret.push(reply.user)
          retids[reply.userid] = true
        }
      }

      return ret
    },

    chats() {
      // We want all the chats which reference this message.  We fetch them in myposts, here we only need to
      // get them from the store
      const chats = Object.values(this.$store.getters['chats/list'])
      const ret = []

      for (const chat of chats) {
        if (chat.refmsgids) {
          if (chat.refmsgids.indexOf(this.message.id) !== -1) {
            // This chat references this message
            ret.push(chat)
            console.log('Chat ', this.message.id, chat.name)
          }
        }
      }

      return ret
    }
  },
  mounted() {
    this.expanded = this.expand
  },
  methods: {
    toggle() {
      this.$root.$emit('bv::toggle::collapse', 'mypost-' + this.message.id)
    },
    showPhotos() {
      this.$bvModal.show('photoModal-' + this.message.id)
    },
    countUnseen(reply) {
      let unseen = 0

      for (const chat of this.chats) {
        if (chat.id === reply.chatid) {
          unseen = chat.unseen
        }
      }

      return unseen
    },
    outcome(type) {
      this.$refs.outcomeModal.show(type)
    },
    share() {
      this.$refs.shareModal.show()
    },
    edit() {
      this.$refs.editModal.show()
    },
    async repost() {
      // Remove any partially composed messages we currently have, because they'll be confusing.
      await this.$store.dispatch('compose/clearMessages')

      // Add this message to the compose store so that it will show up on the compose page.
      await this.$store.dispatch('compose/setMessage', {
        id: this.message.id,
        item: this.message.item.name.trim(),
        description: this.message.textbody.trim(),
        type: this.message.type
      })

      await this.$store.dispatch('compose/setAttachmentsForMessage', {
        id: this.message.id,
        attachments: this.message.attachments
      })

      this.$router.push(
        this.message.type === 'Offer' ? '/give/whatisit' : 'find/whatisit'
      )
    }
  }
}
</script>
