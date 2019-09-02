<template>
  <div>
    <NewsUserIntro v-if="userid" :userid="userid" :users="users" :newsfeed="newsfeed" append="told their Freegle story" />
    <b-row>
      <b-col>
        <b-card variant="success">
          <b-card-header>
            {{ newsfeed.story.headline }}
          </b-card-header>
          <b-card-text>
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
        <span class="font-weight-bold prewrap forcebreak">{{ emessage }}</span>
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-col>
        <NewsLoveComment :newsfeed="newsfeed" @focus-comment="$emit('focus-comment')" />
        <b-btn variant="white" size="sm" class="float-right d-inline-block" @click="share">
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
  </div>
</template>
<script>
import twem from '~/assets/js/twem'
import NewsBase from '~/components/NewsBase'
const NewsUserIntro = () => import('~/components/NewsUserIntro')
const NewsLoveComment = () => import('~/components/NewsLoveComment')

export default {
  components: {
    NewsUserIntro,
    NewsLoveComment
  },
  extends: NewsBase,
  computed: {
    story() {
      let story = this.newsfeed.story.story
      story = story ? twem.twem(this.$twemoji, story) : ''
      story = story.trim()
      return story
    }
  }
}
</script>
