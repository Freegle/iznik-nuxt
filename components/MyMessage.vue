<template>
  <div v-if="showOld || !message.outcomes || !message.outcomes.length">
    <b-card no-body class="mb-1 border" border-variant="success">
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
                    <v-icon v-if="!expand" name="caret-down" />
                    <v-icon v-else name="caret-up" />
                    <template slot="button-content" />
                  </b-btn>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-button>
      </b-card-header>
      <b-collapse :id="'mypost-' + message.id" :visible="expand" role="tabpanel">
        <b-card-body class="p-2">
          <b-card-text>
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
            <p :v-if="expand">
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
              No replies yet.
            </p>
          </b-card-text>
        </b-card-body>
        <b-card-footer>
          <div class="float-right text-faded">
            #{{ message.id }}
          </div>
          <b-list-group horizontal>
            <b-list-group-item v-if="message.type === 'Offer'" li>
              <b-btn variant="success" class="d-inline mr-1" @click="outcome('Taken')">
                <v-icon name="check" /> Mark as TAKEN
              </b-btn>
            </b-list-group-item>
            <b-list-group-item v-else>
              <b-btn variant="success" class="d-inline mr-1" @click="outcome('Received')">
                <v-icon name="check" /> Mark as Received
              </b-btn>
            </b-list-group-item>
            <b-list-group-item>
              <b-btn variant="white" class="d-inline mr-1" @click="outcome('Withdrawn')">
                <v-icon name="trash-alt" /> Withdraw
              </b-btn>
            </b-list-group-item>
          </b-list-group>
        </b-card-footer>
      </b-collapse>
    </b-card>
    <b-modal
      v-if="expand && message.attachments.length"
      :id="'photoModal-' + message.id"
      ref="photoModal"
      :title="message.subject"
      size="lg"
      no-stacking
    >
      <template slot="default">
        <b-carousel
          :id="'message-carousel-' + message.id"
          v-model="slide"
          :interval="5000"
          controls
          indicators
          img-width="100%"
        >
          <b-carousel-slide v-for="(attachment, index) in message.attachments" :key="'mesagephohoto-' + index + '-' + attachment.id">
            <b-img
              slot="img"
              center
              class="d-block img-fluid w-100 messagePhoto"
              :src="attachment.path"
              :alt="'Message photo ' + slide"
            />
          </b-carousel-slide>
        </b-carousel>
      </template>
    </b-modal>
    <OutcomeModal ref="outcomeModal" :message="message" :users="replyusers" />
  </div>
</template>
<style scoped>
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
  border-color: white !important;
}
</style>
<script>
// TODO DESIGN This is better than the old version, but it's still not quite right, in terms of alignment and sizes
// of things.
// TODO DESIGN The badge and the dropdown arrow are different sizes.
// TODO When we click to expand, the visible text may be off the top or bottom of the screen.  Need to make it visible.
// TODO MINOR The caret doesn't toggle when we expand.
// TODO Action buttons - mark received, edit, withdraw, share, repost
import ResizeText from 'vue-resize-text'
const OutcomeModal = () => import('./OutcomeModal')
const MyMessageReply = () => import('~/components/MyMessageReply.vue')

export default {
  directives: {
    ResizeText
  },
  components: {
    OutcomeModal,
    MyMessageReply
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
      slide: 0,
      maxChars: 60
    }
  },
  computed: {
    unseen() {
      // We want all the chats from replies.  We fetch them in myposts, here we only need to
      // get them from the store
      const chats = Object.values(this.$store.getters['chats/list']())
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

      console.log('Reply users', ret)
      return ret
    },

    chats() {
      // We want all the chats which reference this message.  We fetch them in myposts, here we only need to
      // get them from the store
      const chats = Object.values(this.$store.getters['chats/list']())
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
      console.log(this.$refs)
      this.$refs.outcomeModal.show(type)
    }
  }
}
</script>
