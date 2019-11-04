<template>
  <div>
    <b-card no-body variant="success">
      <b-card-header>
        &quot;{{ story.headline }}&quot;
        <b-btn variant="white" class="float-right" @click="share(story)">
          <v-icon name="share-alt" />
        </b-btn>
      </b-card-header>
      <b-card-text class="pl-2 pr-2">
        <div v-if="story.story" class="preline">
          <div v-if="story.photo" class="float-right">
            <b-img-lazy v-b-modal="'photoModal-' + story.photo.id" :src="story.photo.path" class="storyphoto clickme" thumbnail />
            <br>
          </div>
          {{ story.story }}
        </div>
        <span class="text-muted small">
          {{ story.date | timeago }} <span v-if="!groupid">on {{ story.groupname }}</span>
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
    <StoriesShareModal ref="share" :story="modalStory" />
  </div>
</template>
<style scoped>
.storyphoto {
  max-height: 250px !important;
  max-width: 250px !important;
}
</style>
<script>
// TODO Story loves
import StoriesShareModal from '~/components/StoriesShareModal'

export default {
  components: {
    StoriesShareModal
  },
  props: {
    story: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      modalStory: null
    }
  },
  methods: {
    share(story) {
      this.modalStory = story
      this.$nextTick(() => {
        this.$bvModal.show('storiesShareModal-' + story.id)
      })
    }
  }
}
</script>
