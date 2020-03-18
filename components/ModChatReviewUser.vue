<template>
  <div class="bg-white rounded border border-info p-2">
    <div>
      {{ tag }}<b>{{ user.displayname }}</b>
      <span class="small">
        <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ user.id }}
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
import waitForRef from '../mixins/waitForRef'
import ModComment from './ModComment'
import ModCommentAddModal from './ModCommentAddModal'

const REVIEWCHAT = null

export default {
  components: { ModCommentAddModal, ModComment },
  mixins: [waitForRef],
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
