<template>
  <div v-if="!hide">
    <div v-if="showOld || !message.outcomes || !message.outcomes.length">
      <b-card no-body class="mb-1 bnuorder" :border-variant="expanded ? 'primary' : 'success'">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button
            :v-b-toggle="'mypost-' + message.id"
            block
            variant="white"
            class="text-left text-truncate noborder hover"
            @click="toggle"
          >
            <div class="d-flex justify-content-between">
              <h3 class="text-wrap flex-shrink-2">
                <span v-if="message.isdraft">
                  {{ message.type.toUpperCase() }}: {{ message.subject }} ({{ message.area.name }} {{ message.postcode.name }})
                </span>
                <span v-else>
                  {{ message.subject }}
                </span>
                <span v-if="rejected" class="text-danger">
                  <v-icon name="exclamation-triangle" scale="2" />
                </span>
              </h3>
              <span>
                <b-btn class="ml-1" variant="white">
                  <v-icon v-if="!expanded" name="caret-down" />
                  <v-icon v-else name="caret-up" />
                  <template slot="button-content" />
                </b-btn>
              </span>
            </div>
            <div>
              <span v-if="message.replycount > 0" class="ml-1">
                <b-badge variant="info">
                  <v-icon name="user" class="fa-fw" /> {{ message.replycount | pluralize(['reply', 'replies'], { includeNumber: true }) }}
                </b-badge>
              </span>
              <span v-if="message.outcomes && message.outcomes.length > 0" class="ml-1">
                <b-badge v-if="taken" variant="success">
                  <v-icon name="check" class="fa-fw" /> Taken
                </b-badge>
                <b-badge v-if="received" variant="success">
                  <v-icon name="check" class="fa-fw" /> Received
                </b-badge>
                <b-badge v-if="withdrawn" variant="secondary">
                  <v-icon name="check" class="fa-fw" /> Withdrawn
                </b-badge>
              </span>
              <span v-else-if="message.promisecount > 0" class="ml-1">
                <b-badge variant="success">
                  <v-icon name="handshake" class="fa-fw" /> Promised
                </b-badge>
              </span>
              <span v-if="unseen > 0" class="ml-1">
                <b-badge variant="danger">
                  <v-icon name="comments" class="fa-fw" /> {{ unseen }} unread
                </b-badge>
              </span>
            </div>
          </b-button>
        </b-card-header>
        <b-collapse :id="'mypost-' + message.id" :visible="expanded" role="tabpanel" @show="expanded = true" @hidden="expanded = false">
          <div v-if="expanded">
            <b-card-body class="p-2">
              <b-card-text>
                <notice-message v-if="rejected" class="mb-3">
                  <v-icon name="exclamation-triangle" scale="2" /> This post has been returned to you.
                </notice-message>
                <div class="d-flex justify-content-between">
                  <div>
                    <p>
                      <span v-for="group in message.groups" :key="'message-' + message.id + '-' + group.id" class="small text-muted">
                        {{ group.arrival | timeago }} on {{ group.namedisplay }} <nuxt-link :to="'/message/' + message.id"><span class="text-muted small">#{{ message.id }}</span></nuxt-link>
                      </span>
                    </p>
                    <span class="prewrap">
                      <read-more v-if="message && message.textbody" :text="message.textbody" :max-chars="maxChars" class="nopara" />
                    </span>
                  </div>
                  <div>
                    <div v-if="message.attachments.length > 0" class="clickme position-relative" @click="showPhotos">
                      <div class="small">
                        <b-badge v-if="message.attachments.length > 1" class="photobadge" variant="primary">
                          {{ message.attachments.length }} <v-icon name="camera" />
                        </b-badge>
                      </div>
                      <b-img-lazy
                        rounded
                        thumbnail
                        class="attachment p-0 square mb-1"
                        generator-unable-to-provide-required-alt=""
                        title="Item picture"
                        :src="message.attachments[0].paththumb"
                      />
                    </div>
                  </div>
                </div>
                <hr>
                <table v-if="replies.length > 0" class="table table-borderless table-striped mb-0">
                  <tbody>
                    <tr v-for="reply in replies" :key="'reply-' + reply.id">
                      <MyMessageReply
                        :reply="reply"
                        :chats="chats"
                        :message="message"
                        :taken="taken"
                        :received="received"
                        :withdrawn="withdrawn"
                      />
                    </tr>
                  </tbody>
                </table>
                <p v-else class="text-muted">
                  No replies yet. <span v-if="!taken && !received && message.willautorepost && message.canrepostat">Will auto-repost {{ message.canrepostat | timeago }}.</span>
                </p>
              </b-card-text>
            </b-card-body>
            <b-card-footer class="p-1">
              <div class="d-flex justify-content-start flex-wrap">
                <b-btn v-if="queued" variant="primary" class="m-1" @click="submitQueued">
                  <v-icon name="check" /> Still applies - Submit
                </b-btn>
                <b-btn v-if="rejected" variant="warning" class="m-1" @click="repost">
                  <v-icon name="pen" /> Edit and Resend
                </b-btn>
                <b-btn v-if="rejected && !withdrawn" variant="white" class="m-1" @click="outcome('Withdrawn')">
                  <v-icon name="trash-alt" /> Withdraw
                </b-btn>
                <b-btn v-if="!rejected && !queued && message.type === 'Offer' && !taken" variant="primary" class="m-1" @click="outcome('Taken')">
                  <v-icon name="check" /> Mark as TAKEN
                </b-btn>
                <b-btn v-if="!rejected && !queued && message.type === 'Wanted' && !received" variant="primary" class="m-1" @click="outcome('Received')">
                  <v-icon name="check" /> Mark as RECEIVED
                </b-btn>
                <b-btn v-if="!rejected && !taken && !received && !withdrawn" variant="white" class="m-1" @click="outcome('Withdrawn')">
                  <v-icon name="trash-alt" /> Withdraw
                </b-btn>
                <b-btn v-if="!rejected && !queued && message.canedit" variant="secondary" class="m-1" @click="edit">
                  <v-icon name="pen" /> Edit
                </b-btn>
                <b-btn v-if="!rejected && message.canrepost" variant="white" class="m-1" @click="repost">
                  <v-icon name="sync" /> Repost
                </b-btn>
                <b-btn v-else-if="!rejected && !taken && !received && message.canrepostat" variant="white" disabled class="m-1" title="You will be able to repost this soon">
                  <v-icon name="sync" /> Repost <span class="small">{{ message.canrepostat | timeago }}</span>
                </b-btn>
                <b-btn v-if="!rejected && !queued && !simple" variant="white" title="Share" class="m-1" @click="share">
                  <v-icon name="share-alt" /> Share
                </b-btn>
                <div class="align-self-end">
                  <nuxt-link :to="'/message/' + message.id" target="_blank" class="text-faded">
                    #{{ message.id }}
                  </nuxt-link>
                </div>
              </div>
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
        <template slot="modal-footer" slot-scope="{ ok, cancel }">
          <b-button variant="white" @click="cancel">
            Close
          </b-button>
        </template>
      </b-modal>
    </div>
    <OutcomeModal ref="outcomeModal" :message="message" :users="replyusers" @outcome="hide = true" />
    <ShareModal :id="message.id" ref="shareModal" />
    <MessageEditModal ref="editModal" :message="message" />
  </div>
</template>
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
      required: false,
      default: false
    },
    action: {
      type: String,
      required: false,
      default: null
    },
    queued: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      maxChars: 60,
      expanded: false,
      hide: false
    }
  },
  computed: {
    unseen() {
      // We want all the chats from replies.  We fetch them in myposts, here we only need to
      // get them from the store
      const chats = Object.values(this.$store.getters['chats/list'])
      let unseen = 0

      if (this.message && this.message.replies) {
        for (const reply of this.message.replies) {
          for (const chat of chats) {
            if (chat.id === reply.chatid) {
              unseen += chat.unseen
            }
          }
        }
      }

      return unseen
    },

    taken() {
      return this.hasOutcome('Taken')
    },

    received() {
      return this.hasOutcome('Received')
    },

    withdrawn() {
      return this.hasOutcome('Withdrawn')
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
      if (this.message.isdraft) {
        return []
      } else {
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
      }
    },

    replyusers() {
      const ret = []
      const retids = []

      if (this.message && this.message.replies) {
        for (const reply of this.message.replies) {
          if (retids.indexOf(reply.user.id) === -1) {
            ret.push(reply.user)
            retids[reply.userid] = true
          }
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
          }
        }
      }

      return ret
    }
  },
  mounted() {
    this.expanded = this.expand

    const me = this.$store.getters['auth/user']

    if (me) {
      switch (this.action) {
        case 'repost':
          this.repost()
          break
        case 'withdraw':
          this.outcome('Withdrawn')
          break
        case 'taken':
          this.outcome('Taken')
          break
        case 'received':
          this.outcome('Received')
          break
      }
    }
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
      if (process.env.IS_APP) { // CC..
        console.log('MyMessage.vue')
        const href = 'https://www.ilovefreegle.org/message/' + this.message.id + '?src=mobileshare'
        console.log('MyMessage.vue href', href)
        const subject = this.message.subject
        console.log('MyMessage.vue subject', subject)
        // https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
        const options = {
          message: "I saw this on Freegle - interested?\n\n", // not supported on some apps (Facebook, Instagram)
          subject: 'Freegle post: ' + subject, // for email
          //files: ['', ''], // an array of filenames either locally or remotely
          url: href,
          //chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
        }

        const onSuccess = function (result) {
          console.log("Share completed? " + result.completed)   // On Android apps mostly return false even while it's true
          console.log("Shared to app: " + result.app)           // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
        }

        const onError = function (msg) {
          console.log("Sharing failed with message: " + msg)
        }

        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError)
      } else {
        this.$refs.shareModal.show()
      }
    },
    edit() {
      this.$refs.editModal.show()
    },
    async submitQueued() {
      await this.$store.dispatch('auth/fetchUser', {
        components: ['me']
      })
      const me = this.$store.getters['auth/user']
      await this.$store.dispatch('compose/submitQueued', {
        id: this.message.id,
        email: me.email
      })

      this.hide = true
    },
    async repost() {
      // Remove any partially composed messages we currently have, because they'll be confusing.
      await this.$store.dispatch('compose/clearMessages')

      // Add this message to the compose store so that it will show up on the compose page.
      await this.$store.dispatch('compose/setMessage', {
        id: this.message.id,
        item: this.message.item.name.trim(),
        description: this.message.textbody
          ? this.message.textbody.trim()
          : null,
        type: this.message.type
      })

      // Set the current location and nearby groups, too, since we're about to use them
      const loc = await this.$axios.get(process.env.API + '/locations', {
        params: {
          typeahead: this.message.location.name
        }
      })
      await this.$store.dispatch('compose/setPostcode', loc.data.locations[0])

      await this.$store.dispatch('compose/setAttachmentsForMessage', {
        id: this.message.id,
        attachments: this.message.attachments
      })

      this.$router.push(
        this.message.type === 'Offer' ? '/give/whatisit' : '/find/whatisit'
      )
    },

    hasOutcome(val) {
      let ret = false

      if (this.message.outcomes && this.message.outcomes.length) {
        for (const outcome of this.message.outcomes) {
          if (outcome.outcome === val) {
            ret = true
          }
        }
      }

      return ret
    }
  }
}
</script>
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
  right: 5px;
  position: absolute;
  top: 5px;
}

.noborder {
  border: none !important;
  border-color: $color-white !important;
}

.hover:hover {
  color: initial;
  background-color: $colour-success-bg !important;
}
</style>
