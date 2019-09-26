<template>
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
    <li class="list-inline-item">
      <span v-if="newsfeed.loves">
        <v-icon name="heart" class="text-danger" />&nbsp;{{ newsfeed.loves }}
      </span>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    newsfeed: {
      type: Object,
      required: true
    }
  },
  methods: {
    love() {
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
    }
  }
}
</script>
