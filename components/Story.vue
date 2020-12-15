<template>
  <div>
    <b-card no-body variant="success">
      <b-card-header>
        &quot;{{ story.headline }}&quot;
        <span v-if="story.likes">
          <v-icon name="heart" class="fa-fw" /> {{ story.likes }}
        </span>
        <b-btn v-if="loggedIn && !story.liked" variant="secondary" class="float-right" @click="love">
          <v-icon name="heart" class="fa-fw" /><span class="d-none d-sm-inline">&nbsp;Love this</span>
        </b-btn>
        <b-btn v-if="loggedIn && story.liked" variant="secondary" class="float-right" @click="unlove">
          <v-icon name="heart" class="text-danger fa-fw" /><span class="d-none d-sm-inline">&nbsp;Unlove this</span>
        </b-btn>
        <b-btn variant="secondary" class="float-right mr-1" @click="share(story)">
          <v-icon name="share-alt" class="fa-fw" />
        </b-btn>
      </b-card-header>
      <b-card-text class="pl-4 pr-4">
        <div v-if="story.story" class="preline">
          <div v-if="story.photo" class="float-right">
            <b-img-lazy v-b-modal="'photoModal-' + story.photo.id" :src="story.photo.path" class="storyphoto clickme" thumbnail />
            <br>
          </div>{{ story.story }}
        </div>
        <div class="text-muted small d-flex justify-content-between">
          <span>
            {{ story.date | timeago }} on {{ story.groupname }}
            <span v-if="amAModOn(story.groupid)">
              (by {{ story.user.email }} <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ story.user.id }})
            </span>
          </span>
          <nuxt-link :to="'/story/' + story.id">
            #{{ story.id }}
          </nuxt-link>
        </div>
      </b-card-text>
    </b-card>
    <b-modal
      v-if="story.photo"
      :id="'photoModal-' + story.photo.id"
      ref="photoModal"
      title="Story Photo"
      generator-unable-to-provide-required-alt=""
      size="lg"
      no-stacking
      ok-only
    >
      <template slot="default">
        <b-img
          fluid
          rounded
          center
          :src="story.photo.path"
        />
      </template>
    </b-modal>
    <StoriesShareModal v-if="modalStory" ref="share" :story="modalStory" />
  </div>
</template>
<style scoped>
.storyphoto {
  max-height: 250px !important;
  max-width: 250px !important;
}
</style>
<script>
import StoriesShareModal from '~/components/StoriesShareModal'

export default {
  components: {
    StoriesShareModal
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      modalStory: null
    }
  },
  computed: {
    story() {
      return this.$store.getters['stories/get'](this.id)
    }
  },
  methods: {
    share(story) {
      this.modalStory = story
      this.$nextTick(() => {
        if (process.env.IS_APP) { // CC..
          const href = 'https://www.ilovefreegle.org/story/' + this.story.id + '?src=mobileshare'
          console.log('Story.vue share', href)
          const subject = 'Sharing Freegle story: ' + this.story.headline
          // https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
          const options = {
            message: this.story.story + "\n\n",  // not supported on some apps (Facebook, Instagram)
            subject: 'Sharing Freegle story: ' + this.story.headline,      // for email
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
          this.$bvModal.show('storiesShareModal-' + story.id)
        }
      })
    },
    async love() {
      await this.$store.dispatch('stories/love', {
        id: this.story.id
      })
    },
    async unlove() {
      await this.$store.dispatch('stories/unlove', {
        id: this.story.id
      })
    }
  }
}
</script>
