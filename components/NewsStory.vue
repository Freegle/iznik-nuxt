<template>
  <div>
    <NewsUserIntro v-if="userid" :userid="userid" :users="users" :newsfeed="newsfeed" append="told their Freegle story" />
    <b-row>
      <b-col>
        <b-card variant="success" no-body>
          <b-card-header>
            {{ newsfeed.story.headline }}
          </b-card-header>
          <b-card-text class="p-2">
            <b-img
              v-if="newsfeed.story.photo"
              v-b-modal="'photoModal-' + newsfeed.id"
              thumbnail
              rounded
              lazy
              :src="newsfeed.story.photo.paththumb"
              class="clickme float-right ml-2"
            />
            {{ story }}
          </b-card-text>
        </b-card>
        <read-more v-if="emessage" :text="emessage" :max-chars="500" class="font-weight-bold prewrap forcebreak nopara" />
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-col>
        <NewsLoveComment :newsfeed="newsfeed" @focus-comment="$emit('focus-comment')" />
        <b-btn variant="primary" size="sm" class="float-right" @click="showAddModal">
          <v-icon name="book-open" /> Tell your story!
        </b-btn>
        <b-btn variant="white" to="/stories" size="sm" class="float-right mr-1">
          <v-icon name="book-open" /> More stories
        </b-btn>
        <b-btn variant="white" size="sm" class="float-right d-inline-block mr-1" @click="shareStory">
          <v-icon name="share-alt" /> Share
        </b-btn>
      </b-col>
    </b-row>
    <b-modal
      v-if="newsfeed.story.photo"
      :id="'photoModal-' + newsfeed.id"
      ref="photoModal"
      title="ChitChat Photo"
      alt="ChitChat Photo"
      size="lg"
      no-stacking
      ok-only
    >
      <template slot="default">
        <b-img
          fluid
          rounded
          center
          :src="newsfeed.story.photo.path"
        />
      </template>
    </b-modal>
    <StoriesAddModal ref="addmodal" />
    <StoriesShareModal :story="newsfeed.story" />
  </div>
</template>
<script>
import twem from '~/assets/js/twem'
import NewsBase from '~/components/NewsBase'
const NewsUserIntro = () => import('~/components/NewsUserIntro')
const NewsLoveComment = () => import('~/components/NewsLoveComment')
const StoriesAddModal = () => import('~/components/StoriesAddModal')
const StoriesShareModal = () => import('~/components/StoriesShareModal')

export default {
  components: {
    NewsUserIntro,
    NewsLoveComment,
    StoriesAddModal,
    StoriesShareModal
  },
  extends: NewsBase,
  computed: {
    story() {
      let story = this.newsfeed.story.story
      story = story ? twem.twem(this.$twemoji, story) : ''
      story = story.trim()
      return story
    }
  },
  methods: {
    showAddModal() {
      this.$refs.addmodal.show()
    },
    shareStory() {
      this.$bvModal.show('storiesShareModal-' + this.newsfeed.story.id)
    }
  }
}
</script>
