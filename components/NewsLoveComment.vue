<template>
  <span>
    <ul v-if="newsfeed" class="list-unstyled list-inline d-inline-block">
      <li class="list-inline-item">
        <b-btn v-if="!newsfeed.loved" variant="white" size="sm" @click="love">
          <v-icon name="heart" /><span class="d-none d-sm-inline">&nbsp;Love this</span>
        </b-btn>
        <b-btn v-if="newsfeed.loved" variant="white" size="sm" @click="unlove">
          <v-icon name="heart" class="text-danger" /><span class="d-none d-sm-inline">&nbsp;Unlove this</span>
        </b-btn>
      </li>
      <li v-if="!newsfeed.closed" class="list-inline-item">
        <b-btn variant="white" size="sm" @click="focusComment">
          <v-icon name="comment" /><span class="d-none d-sm-inline">&nbsp;Comment</span>
        </b-btn>
      </li>
      <li class="list-inline-item clickme" @click="showLove">
        <span v-if="newsfeed.loves">
          <v-icon name="heart" class="text-danger" />&nbsp;{{ newsfeed.loves }}
        </span>
      </li>
    </ul>
    <NewsLovesModal :id="newsfeed.id" ref="loveModal" />
  </span>
</template>
<script>
import NewsLovesModal from './NewsLovesModal'
import 'vue-awesome/icons/comment'

export default {
  components: {
    NewsLovesModal
  },
  props: {
    newsfeed: {
      type: Object,
      required: true
    }
  },
  methods: {
    love() {
      // TODO MINOR This is a bit sluggish to do.  Needs visual indication that something is happening.
      this.$store.dispatch('newsfeed/love', {
        id: this.newsfeed.id,
        threadhead: this.newsfeed.threadhead
      })
    },
    unlove() {
      this.$store.dispatch('newsfeed/unlove', {
        id: this.newsfeed.id,
        threadhead: this.newsfeed.threadhead
      })
    },
    focusComment() {
      this.$emit('focus-comment')
    },
    showLove() {
      this.$refs.loveModal.show()
    }
  }
}
</script>
