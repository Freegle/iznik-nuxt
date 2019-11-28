<template>
  <div />
</template>
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
      threadcomment: null,
      newsfeedModal: null
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
    brokenImage(event) {
      event.target.src = '/static/defaultprofile.png'
    },
    share() {
      // TODO MINOR We have this method in here, but we put the actual modal in the template of the extending component.  Is this right?
      this.newsfeedModal = this.newsfeed
      this.$nextTick(() => {
        this.$bvModal.show('newsShareModal-' + this.newsfeed.id)
      })
    }
  }
}
</script>
