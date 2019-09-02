<template>
  <div v-if="showOld || !message.outcomes || !message.outcomes.length">
    <b-card no-body class="mb-1 border border-success">
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
            <b-col cols="8" class="text-truncate">
              <h3>{{ message.subject }}</h3>
            </b-col>
            <b-col cols="4" class="text-right">
              <b-btn class="float-right ml-1" variant="white">
                <v-icon v-if="!expanded" name="caret-down" />
                <v-icon v-else name="caret-up" />
                <template slot="button-content" />
              </b-btn>
              <span v-if="unseen > 0" class="float-right ml-1">
                <b-badge variant="danger">
                  <v-icon name="comments" class="fa-fw" /> {{ unseen }} unread
                </b-badge>
              </span>
              <span v-if="message.promisecount > 0" class="float-right ml-1">
                <b-badge variant="success">
                  <v-icon name="handshake" class="fa-fw" /> Promised
                </b-badge>
              </span>
              <span v-if="message.replycount > 0" class="float-right ml-1">
                <b-badge variant="info">
                  <v-icon name="user" class="fa-fw" /> {{ message.replycount | pluralize(['reply', 'replies'], { includeNumber: true }) }}
                </b-badge>
              </span>
            </b-col>
          </b-row>
        </b-button>
      </b-card-header>
      <b-collapse :id="'mypost-' + message.id" :visible="expanded" role="tabpanel">
        <b-card-body>
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
            <p :v-if="expanded">
              <span v-for="group in message.groups" :key="'message-' + message.id + '-' + group.id" class="small text-muted">
                {{ group.arrival | timeago }} on {{ group.namedisplay }} <span class="text-faded small">#{{ message.id }}</span>
              </span>
            </p>
            <span class="prewrap">{{ message.textbody }}</span>
            <hr>
            <span v-for="reply in replies" :key="'reply-' + reply.id">
              <MyMessageReply :reply="reply" :chats="chats" />
            </span>
          </b-card-text>
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-modal
      v-if="expanded && message.attachments.length"
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
  </div>
</template>
<style scoped>
.square {
  object-fit: cover;
  width: 100px;
  height: 100px;
}

img.attachment {
  max-height: 100px !important;
  max-width: 100px !important;
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
// TODO DESIGN How do we use text-truncate with ellipsis to make long subjects look nicer?  Also we may or may not
// have reply, promised, unread buttons - seems a shame to truncate if they are not even there.
// TODO DESIGN Visually the text body of the post needs to be distinguished from the replies.
// TODO When we click to expand, the visible text may be off the top or bottom of the screen.  Need to make it visible.
const MyMessageReply = () => import('~/components/MyMessageReply.vue')

export default {
  components: {
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
    }
  },
  data: function() {
    return {
      expandCount: 5,
      slide: 0
    }
  },
  computed: {
    expanded() {
      let count = 0
      for (const message of this.messages) {
        if (message.type === this.message.type) {
          count++
        }
      }

      return count <= this.expandCount
    },
    unseen() {
      // We want all the chats which reference this message.  We fetch them in myposts, here we only need to
      // get them from the store
      const chats = Object.values(this.$store.getters['chats/list']())
      let unseen = 0

      for (const chat of chats) {
        if (chat.refmsgids) {
          if (chat.refmsgids.indexOf(this.message.id) !== -1) {
            // This chat references this message
            unseen += chat.unseen
          }
        }
      }

      return unseen
    },

    replies() {
      // Show the replies with unseen messages first, then most recent
      console.log('Sort replies', this.message.replies, this)
      const self = this
      return [...this.message.replies].sort((a, b) => {
        const aunseen = self.countUnseen(a)
        const bunseen = self.countUnseen(b)
        const adate = new Date(a.lastdate).getTime()
        const bdate = new Date(b.lastdate).getTime()

        console.log('Unseen', aunseen, bunseen, adate, bdate)
        if (aunseen !== bunseen) {
          return bunseen - aunseen
        } else {
          return bdate - adate
        }
      })
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
    }
  }
}
</script>
