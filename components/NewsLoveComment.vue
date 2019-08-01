<template>
  <ul class="list-unstyled list-inline d-inline-block">
    <li class="list-inline-item">
      <b-btn v-if="!newsfeed.loved" variant="white" size="sm" @click="love">
        <fa icon="heart" />&nbsp;Love this
      </b-btn>
      <b-btn v-if="newsfeed.loved" variant="white" size="sm" @click="unlove">
        <fa class="text-danger" icon="heart" />&nbsp;Unlove this
      </b-btn>
    </li>
    <li v-if="!newsfeed.closed" class="list-inline-item">
      <b-btn variant="white" size="sm" @click="focusComment">
        <fa icon="comment" />&nbsp;Comment
      </b-btn>
    </li>
    <li class="list-inline-item">
      <span v-if="newsfeed.loves">
        <fa icon="heart" class="text-danger" />&nbsp;{{ newsfeed.loves }}
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
