<template>
  <div>
    <b-card class="p-0 mb-1" variant="success">
      <b-card-header class="pl-2 pr-2 clearfix">
        <b-card-title class="msgsubj mb-0">
          <span v-if="attachments.length > 0" class="float-right clickme" @click="showPhotos">
            <b-img-lazy
              rounded
              thumbnail
              class="attachment p-0"
              alt="Item picture"
              title="Item picture"
              :src="attachments[0].paththumb"
            />
            <br>
          </span>
          {{ safeSubject }}
        </b-card-title>
        <span v-for="group in groups" :key="'message-' + id + '-' + group.id" class="small muted">
          {{ group.arrival | timeago }} on {{ group.namedisplay }}
        </span>
        <div v-if="safeSnippet && safeSnippet !== 'null' && !expanded">
          <h4>{{ safeSnippet }}...</h4>
        </div>
        <div v-if="!safeSnippet || safeSnippet === 'null' && !expanded">
          <i>There's no description.</i>
        </div>
        <b-button v-if="!expanded" variant="white" @click="expand">
          Read more and reply >>
        </b-button>
      </b-card-header>
      <b-card-body v-if="expanded">
        <b-alert v-if="expanded.promised" variant="info">
          This item has already been promised to someone.  You can still reply - you might get it if someone
          else drops out.
        </b-alert>

        <p>{{ expanded.textbody }}</p>
        <span v-if="expanded.fromuser" class="text-sm small text-muted">
          <b-img-lazy
            rounded="circle"
            thumbnail
            class="profile p-0 ml-1 mb-1"
            alt="Profile picture"
            title="Profile"
            :src="expanded.fromuser.profile.turl"
          />
          Posted by {{ expanded.fromuser.displayname }}
        </span>
        <span v-if="expanded.replycount" class="float-right small text-muted">
          <fa icon="user" class="d-inline" />&nbsp;<span class="d-inline">{{ expanded.replycount }}&nbsp;freegler<span v-if="expanded.replycount != 1">s</span>&nbsp;replied&nbsp;</span>
        </span>
      </b-card-body>
      <b-card-footer v-if="expanded">
        <b-row>
          <b-col cols="9">
            <b-form-textarea
              v-if="expanded.type == 'Offer'"
              v-model="reply"
              placeholder="Interested?  Please explain why you'd like it and when you can collect.  Always be polite and helpful."
              rows="3"
              max-rows="8"
            />
            <b-form-textarea
              v-if="expanded.type == 'Wanted'"
              v-model="reply"
              placeholder="Can you help?  If you have what they're looking for, let them know."
              rows="3"
              max-rows="8"
            />
          </b-col>
          <b-col cols="3">
            <b-btn variant="success">
              <fa icon="envelope" />&nbsp;Send
            </b-btn>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <span class="text-sm small text-muted float-right">
              #{{ id }}&nbsp;
            </span>
          </b-col>
        </b-row>
      </b-card-footer>
    </b-card>
    <b-modal :id="'photoModal-' + id" ref="photoModal" :title="subject" size="lg" no-stacking>
      <template slot="default">
        <b-img
          v-if="expanded"
          fluid
          rounded
          center
          :src="expanded.attachments[0].path"
          class="messagePhoto"
        />
      </template>
    </b-modal>
  </div>
</template>
<script>
import sanitizeHtml from 'sanitize-html'
import twem from '~/assets/js/twem'

export default {
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
      type: String,
      default: null
    },
    groups: {
      type: Array,
      default: () => []
    },
    attachments: {
      type: Array,
      default: () => []
    }
  },
  data: function() {
    return {
      reply: null,
      expanded: null
    }
  },
  computed: {
    safeSubject() {
      return sanitizeHtml(this.subject)
    },
    safeBody() {
      let bod = twem(this.$twemoji, this.textbody)
      bod = sanitizeHtml(this.textbody)
      return bod
    },
    safeSnippet() {
      let snip = twem(this.$emoji, this.snippet)
      snip = sanitizeHtml(this.snippet)
      return snip
    }
  },
  methods: {
    async expand() {
      console.log('Expand')
      await this.$store.dispatch('messages/fetch', {
        id: this.id
      })

      const message = this.$store.getters['messages/get'](this.id)
      console.log('Fetched', message)

      this.expanded = message
    },

    async showPhotos() {
      console.log('Show photos')
      await this.expand()
      this.$bvModal.show('photoModal-' + this.id)
    }
  }
}
</script>
<style>
.card-body {
  padding: 0px;
}

h4 {
  color: black !important;
}

img.attachment {
  max-height: 150px !important;
  max-width: 150px !important;
}

img.profile {
  max-height: 25px !important;
  max-width: 25px !important;
}

.messagePhoto {
  max-height: 600px !important;
}
</style>
