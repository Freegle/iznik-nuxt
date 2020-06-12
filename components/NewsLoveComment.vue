<template>
  <span>
    <ul v-if="newsfeed" class="list-unstyled list-inline d-flex align-items-center">
      <li class="list-inline-item">
        <b-btn v-if="!newsfeed.loved" variant="white" size="sm" @click="love">
          <v-icon v-if="loving" name="sync" class="fa-spin text-success" />
          <v-icon v-else name="heart" />
          <span class="d-none d-sm-inline">Love this</span>
        </b-btn>
        <b-btn v-if="newsfeed.loved" variant="white" size="sm" @click="unlove">
          <v-icon name="heart" class="text-danger" /><span class="d-none d-sm-inline">&nbsp;Unlove this</span>
        </b-btn>
      </li>
      <li v-if="!newsfeed.closed" class="list-inline-item">
        <b-btn variant="white" size="sm" @click="focusComment">
          <v-icon name="comment" /><span class="d-none d-sm-inline">&nbsp;Reply</span>
        </b-btn>
      </li>
      <li class="list-inline-item clickme">
        <span v-if="newsfeed.loves" tabindex="0" class="showlove" @click="showLove">
          <v-icon name="heart" class="text-danger" />&nbsp;{{ newsfeed.loves }}
        </span>
      </li>
    </ul>
    <NewsLovesModal :id="newsfeed.id" ref="loveModal" />
  </span>
</template>
<script>
import NewsLovesModal from './NewsLovesModal'

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
  data: function() {
    return {
      loving: false
    }
  },
  methods: {
    async love() {
      this.loving = true

      await this.$store.dispatch('newsfeed/love', {
        id: this.newsfeed.id,
        threadhead: this.newsfeed.threadhead
      })

      this.loving = false
    },
    async unlove() {
      this.loving = true

      await this.$store.dispatch('newsfeed/unlove', {
        id: this.newsfeed.id,
        threadhead: this.newsfeed.threadhead
      })

      this.loving = false
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

<style scoped lang="scss">
@import 'color-vars';

.showlove {
  padding: 3px;

  &:hover {
    border-radius: 0.2rem;
    background-color: $color-blue--light;
    color: white;
  }

  &:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    border-radius: 0.2rem;
  }
}
</style>
