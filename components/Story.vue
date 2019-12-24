<template>
  <div>
    <b-card no-body variant="success">
      <b-card-header>
        &quot;{{ story.headline }}&quot;
        <span v-if="story.likes">
          <v-icon name="heart" class="fa-fw" /> {{ story.likes }}
        </span>
        <b-btn v-if="loggedIn && !story.liked" variant="white" class="float-right" @click="love">
          <v-icon name="heart" class="fa-fw" /><span class="d-none d-sm-inline">&nbsp;Love this</span>
        </b-btn>
        <b-btn v-if="loggedIn && story.liked" variant="white" class="float-right" @click="unlove">
          <v-icon name="heart" class="text-danger fa-fw" /><span class="d-none d-sm-inline">&nbsp;Unlove this</span>
        </b-btn>
        <b-btn variant="white" class="float-right mr-1" @click="share(story)">
          <v-icon name="share-alt" class="fa-fw" />
        </b-btn>
      </b-card-header>
      <b-card-text class="pl-2 pr-2">
        <div v-if="story.story" class="preline">
          <div v-if="story.photo" class="float-right">
            <b-img-lazy v-b-modal="'photoModal-' + story.photo.id" :src="story.photo.path" class="storyphoto clickme" thumbnail />
            <br>
          </div>{{ story.story }}
        </div>
        <span class="text-muted small">
          {{ story.date | timeago }} on {{ story.groupname }}
        </span>
      </b-card-text>
    </b-card>
    <b-modal
      v-if="story.photo"
      :id="'photoModal-' + story.photo.id"
      ref="photoModal"
      title="Story Photo"
      alt="Story Photo"
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
<script type="module">
import 'vue-awesome/icons/share-alt'
import 'vue-awesome/icons/heart'
</script>
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
    loggedIn() {
      const ret = Boolean(this.$store.getters['auth/user'])
      return ret
    },
    story() {
      return this.$store.getters['stories/get'](this.id)
    }
  },
  methods: {
    share(story) {
      this.modalStory = story
      this.$nextTick(() => {
        this.$bvModal.show('storiesShareModal-' + story.id)
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
