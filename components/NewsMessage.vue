<template>
  <div>
    <NewsUserIntro v-if="userid" :userid="userid" :users="users" :newsfeed="newsfeed" />
    <read-more v-if="newsfeed.message && emessage" :text="emessage" :max-chars="1024" class="font-weight-bold prewrap forcebreak nopara" />
    <div>
      <b-row v-if="newsfeed.image">
        <b-col>
          <b-img
            v-b-modal="'photoModal-' + newsfeed.id"
            thumbnail
            rounded
            lazy
            :src="newsfeed.image.paththumb"
            class="clickme"
          />
        </b-col>
      </b-row>
    </div>
    <b-row class="mt-2">
      <b-col>
        <NewsLoveComment :newsfeed="newsfeed" @focus-comment="$emit('focus-comment')" />
        <b-btn variant="white" size="sm" class="float-right d-inline-block" @click="share">
          <v-icon name="share-alt" /> Share
        </b-btn>
      </b-col>
    </b-row>
    <b-modal
      v-if="newsfeed.image"
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
          :src="newsfeed.image.path"
        />
      </template>
    </b-modal>
    <NewsShareModal v-if="newsfeedModal" :newsfeed="newsfeedModal" />
  </div>
</template>
<script>
import NewsBase from '~/components/NewsBase'
import NewsUserIntro from '~/components/NewsUserIntro'
const NewsShareModal = () => import('~/components/NewsShareModal')
const NewsLoveComment = () => import('~/components/NewsLoveComment')

export default {
  components: {
    NewsShareModal,
    NewsUserIntro,
    NewsLoveComment
  },
  extends: NewsBase
}
</script>
