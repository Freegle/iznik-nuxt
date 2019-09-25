<template>
  <div>
    <b-card class="p-0 mb-1" variant="success">
      <b-card-header class="pl-2 pr-2 clearfix">
        <b-card-title class="msgsubj mb-0">
          <b-btn v-if="expanded" variant="white" class="float-right" title="Share" @click="share">
            <v-icon name="share-alt" />
          </b-btn>
          <span v-if="attachments.length > 0" class="float-right clickme" @click="showPhotos">
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
          <span class="text-sm small text-faded">
            #{{ id }}&nbsp;
          </span>
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
          Read more and reply >>
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
              <b-btn variant="success">
                Send >>
              </b-btn>
            </div>
          </b-col>
        </b-row>
        <b-row class="d-block d-md-none mt-2">
          <b-col>
            <b-btn variant="success" block>
              Send >>
            </b-btn>
          </b-col>
        </b-row>
      </b-card-footer>
    </b-card>
    <b-modal
      v-if="expanded && expanded.attachments.length"
      :id="'photoModal-' + id"
      ref="photoModal"
      :title="subject"
      size="lg"
      no-stacking
    >
      <template slot="default">
        <b-carousel
          v-if="expanded.attachments.length > 1"
          :id="'message-carousel-' + expanded.id"
          v-model="slide"
          :interval="5000"
          controls
          indicators
          img-width="100%"
        >
          <b-carousel-slide v-for="(attachment, index) in expanded.attachments" :key="'mesagephohoto-' + index + '-' + attachment.id">
            <b-img
              slot="img"
              center
              class="d-block img-fluid w-100 messagePhoto"
              :src="attachment.path"
              :alt="'Message photo ' + slide"
            />
          </b-carousel-slide>
        </b-carousel>
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
  </div>
</template>
<script>
// TODO Focus on textbox when expand.
import twem from '~/assets/js/twem'
const Highlighter = () => import('vue-highlight-words')
const MessageUserInfo = () => import('~/components/MessageUserInfo')
const ShareModal = () => import('./ShareModal')

export default {
  components: {
    MessageUserInfo,
    Highlighter,
    ShareModal
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
    }
  },
  data: function() {
    return {
      reply: null,
      expanded: null,
      slide: 0
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
    }
  }
}
</script>
<style scoped>
.card-body {
  padding: 0px;
}

h4 {
  color: #000080 !important;
  font-weight: bold;
}

h4.snippet {
  color: black !important;
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
</style>
