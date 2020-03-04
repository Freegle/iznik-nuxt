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
      this.newsfeedModal = this.newsfeed
      this.$nextTick(() => {
        if (process.env.IS_APP) { // CC..
          const href = 'https://www.ilovefreegle.org/chitchat/' + this.newsfeed.id + '?src=mobileshare'
          console.log('NewsBase.vue share', href)
          const subject = 'Sharing Freegle chitchat'
          // https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
          const options = {
            message: this.newsfeed.message + "\n\n",  // not supported on some apps (Facebook, Instagram)
            subject: 'Sharing Freegle chitchat',      // for email
            //files: ['', ''], // an array of filenames either locally or remotely
            url: href,
            //chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
          }

          const onSuccess = function (result) {
            console.log("Share completed? " + result.completed)   // On Android apps mostly return false even while it's true
            console.log("Shared to app: " + result.app)           // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
          }

          const onError = function (msg) {
            console.log("Sharing failed with message: " + msg)
          }

          window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError)
        } else {
          this.$bvModal.show('newsShareModal-' + this.newsfeed.id)
        }
      })
    },
    showPhotoModal() {
      this.$refs.photoModal.show()
    }
  }
}
</script>
