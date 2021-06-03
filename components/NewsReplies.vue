<template>
  <div>
    <b-button v-if="showEarlierRepliesOption" variant="link" size="sm" class="pl-0" @click.prevent="showAllReplies = true">
      Show earlier {{ numberOfRepliesNotShown | pluralize(['reply', 'replies']) }} ({{ numberOfRepliesNotShown }})
    </b-button>
    <ul v-for="reply in repliestoshow" :key="'newsfeed-' + reply.id" class="'p-0 pt-1 list-unstyled mb-1 pl-1 border-left">
      <li>
        <news-refer v-if="reply.type.indexOf('ReferTo') === 0" :type="reply.type" :threadhead="threadhead" />
        <news-reply
          v-else
          :key="'reply-' + reply.id"
          :replyid="reply.id"
          :users="users"
          :threadhead="threadhead"
          :scroll-to="scrollTo"
        />
      </li>
    </ul>
  </div>
</template>
<script>
import NewsRefer from '~/components/NewsRefer'

const NewsReply = () => import('~/components/NewsReply.vue')

const INITIAL_NUMBER_OF_REPLIES_TO_SHOW = 5

export default {
  name: 'NewsReplies',
  components: { NewsRefer, NewsReply },
  props: {
    replyIds: {
      type: Array,
      required: true
    },
    threadhead: {
      type: Object,
      required: true
    },
    users: {
      type: Object,
      required: true
    },
    replyTo: {
      type: Number,
      required: false,
      default: null
    },
    scrollTo: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      showAllReplies: false
    }
  },
  computed: {
    replies() {
      const ret = []

      this.replyIds.forEach(id => {
        ret.push(this.$store.getters['newsfeed/get'](id))
      })

      return ret
    },
    visiblereplies() {
      // These are the replies which are candidates to show, i.e. not deleted or hidden.
      const ret = []

      for (let i = 0; i < this.replies.length; i++) {
        if ((!this.replies[i].deleted && this.replies[i].visible) || this.mod) {
          ret.push(this.replies[i])
        }
      }

      return ret
    },
    repliestoshow() {
      let ret = []

      if (this.visiblereplies.length) {
        if (
          this.showAllReplies ||
          this.visiblereplies.length <= INITIAL_NUMBER_OF_REPLIES_TO_SHOW
        ) {
          // Return all the replies
          ret = this.visiblereplies
        } else if (!this.replyTo) {
          // Show the last 5
          ret = this.visiblereplies.slice(-5)
        } else {
          // We are need to show what we are replying to and everything after that.
          ret = []
          let seen = false

          for (let i = 0; i < this.visiblereplies.length; i++) {
            const reply = this.visiblereplies[i]

            if (reply.id === this.replyTo || seen) {
              seen = true
              ret.push(reply)
            }
          }

          if (!seen) {
            // Probably won't happen.
            ret = this.visiblereplies.slice(-5)
          }
        }
      }

      return ret
    },
    showEarlierRepliesOption() {
      // If we're not already showing all replies and there are still some to show after the default display
      return (
        !this.showAllReplies &&
        this.visiblereplies.length > INITIAL_NUMBER_OF_REPLIES_TO_SHOW
      )
    },
    numberOfRepliesNotShown() {
      if (
        !this.visiblereplies ||
        this.visiblereplies.length < INITIAL_NUMBER_OF_REPLIES_TO_SHOW
      ) {
        return 0
      }

      return this.visiblereplies.length - INITIAL_NUMBER_OF_REPLIES_TO_SHOW
    }
  }
}
</script>
