<template>
  <div>
    <NewsUserIntro v-if="userid" :userid="userid" :users="users" :newsfeed="newsfeed" append="told their Freegle story" />
    <b-row>
      <b-col>
        <b-card variant="success" no-body>
          <b-card-header>
            <b>{{ newsfeed.story.headline }}</b>
          </b-card-header>
          <b-card-text class="p-2 preline">
            <b-img
              v-if="newsfeed.story.photo"
              v-b-modal="'photoModal-' + newsfeed.id"
              thumbnail
              rounded
              lazy
              :src="newsfeed.story.photo.paththumb"
              class="clickme float-right ml-2"
              @click="showPhotoModal"
            />{{ story }}
          </b-card-text>
        </b-card>
        <read-more v-if="emessage" :text="emessage" :max-chars="500" class="font-weight-bold preline forcebreak nopara" />
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-col>
        <NewsLoveComment :newsfeed="newsfeed" @focus-comment="$emit('focus-comment')" />
        <b-btn variant="secondary" size="sm" class="float-right" @click="showAddModal">
          <v-icon name="book-open" />
          <span class="d-none d-inline-block-md">Tell your story!</span>
          <span class="d-inline-block d-none-md">Tell yours</span>
        </b-btn>
        <b-btn variant="white" to="/stories" size="sm" class="float-right mr-1">
          <v-icon name="book-open" />
          <span class="d-none d-inline-block-md">More stories</span>
          <span class="d-inline-block d-none-md">More</span>
        </b-btn>
        <b-btn variant="white" size="sm" class="float-right d-inline-block mr-1" @click="shareStory">
          <v-icon name="share-alt" /><span class="d-none d-inline-block-md"> Share</span>
        </b-btn>
      </b-col>
    </b-row>
    <NewsPhotoModal
      v-if="newsfeed.story.photo"
      :id="newsfeed.story.photo.id"
      ref="photoModal"
      :newsfeedid="newsfeed.id"
      :src="newsfeed.story.photo.path"
      imgtype="Story"
      imgflag="story"
    />
    <StoriesAddModal ref="addmodal" />
    <StoriesShareModal :story="newsfeed.story" />
  </div>
</template>
<script>
import twem from '~/assets/js/twem'
import NewsBase from '~/components/NewsBase'

import NewsUserIntro from '~/components/NewsUserIntro'
import NewsLoveComment from '~/components/NewsLoveComment'
import NewsPhotoModal from '~/components/NewsPhotoModal'
const StoriesAddModal = () => import('~/components/StoriesAddModal')
const StoriesShareModal = () => import('~/components/StoriesShareModal')

export default {
  components: {
    NewsPhotoModal,
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
