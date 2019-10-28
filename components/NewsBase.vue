<template>
  <div />
</template>

<style scoped lang="scss">
@import 'color-vars';

.showmod {
  top: 29px;
  left: 44px;
  border-radius: 50%;
  position: absolute;
  background-color: $color-white;
  width: 24px;
  height: 24px;
  padding-left: 5px;
  padding-top: 4px;
  border: 1px solid $color-green--darker;
}
</style>

<script>
import twem from '~/assets/js/twem'

export default {
  components: {},
  props: {
    id: {
      type: Number,
      required: true
    },
    users: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      replyingTo: null,
      threadcomment: null
    }
  },
  computed: {
    emessage() {
      return this.newsfeed.message
        ? twem.twem(this.$twemoji, this.newsfeed.message)
        : null
    },
    me() {
      return this.$store.state.auth.user
    },
    newsfeed() {
      return this.$store.getters['newsfeed/get'](this.id)
    },
    userid() {
      // The API returns userid in the summary and user.id when we get an individual object, so we need to
      // mess about to get the userid.
      const newsfeed = this.$store.getters['newsfeed/get'](this.id)
      let ret = null

      if (newsfeed) {
        if (newsfeed.userid) {
          ret = newsfeed.userid
        } else if (newsfeed.user) {
          ret = newsfeed.user.id
        }
      }

      return ret
    }
  },
  methods: {
    share() {
      // TODO
    },
    brokenImage(event) {
      event.target.src = '/static/defaultprofile.png'
    }
  }
}
</script>
