<template>
  <div class="bg-white rounded border border-info p-2">
    <div>
      {{ tag }}<strong>{{ user.displayname }}</strong>
      <span class="small">
        <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ user.id }}
      </span>
      <span v-if="email">
        (<ExternalLink :href="'mailto:' + email">{{ email }}</ExternalLink> <Clipboard :value="email" />)
      </span>
    </div>
    <b-btn variant="white" size="xs" class="mt-1" @click="addAComment">
      <v-icon name="tag" /> Add note
    </b-btn>
    <div v-if="user.comments" class="mt-1">
      <ModComment v-for="comment in user.comments" :key="'comment-' + comment.id" :comment="comment" :user="user" @updated="updateComments" />
    </div>
    <ModCommentAddModal v-if="addComment" ref="addComment" :user="user" :groupid="groupid" @added="updateComments" />
  </div>
</template>
<script>
import ModComment from './ModComment'
import ModCommentAddModal from './ModCommentAddModal'
import Clipboard from './Clipboard.vue'
import ExternalLink from '~/components/ExternalLink'

const REVIEWCHAT = null

export default {
  components: { Clipboard, ExternalLink, ModCommentAddModal, ModComment },

  props: {
    user: {
      type: Object,
      required: true
    },
    tag: {
      type: String,
      required: false,
      default: null
    },
    groupid: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      addComment: false
    }
  },
  computed: {
    email() {
      let ret = null

      if (this.user && this.user.emails) {
        this.user.emails.forEach(e => {
          if (!e.ourdomain && (!ret || e.preferred)) {
            ret = e.email
          }
        })
      }

      return ret
    }
  },
  methods: {
    addAComment() {
      this.addComment = true
      this.waitForRef('addComment', () => {
        this.$refs.addComment.show()
      })
    },
    updateComments() {
      // Bit fiddly.  The user is in the chat messages in the store, not in the user store, so we need to refetch
      // everything up to where we're at.
      const messages = this.$store.getters['chatmessages/getMessages'](
        REVIEWCHAT
      )

      this.$store.dispatch('chatmessages/clearContext', {
        chatid: REVIEWCHAT
      })

      this.$store.dispatch('chatmessages/fetch', {
        chatid: REVIEWCHAT,
        limit: messages.length
      })
    }
  }
}
</script>
