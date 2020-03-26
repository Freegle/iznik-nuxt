<template>
  <div>
    <NewsUserIntro v-if="userid" :userid="userid" :users="users" :newsfeed="newsfeed" />
    <read-more v-if="newsfeed.message && emessage" :text="emessage" :max-chars="1024" class="font-weight-bold prewrap forcebreak nopara" />
    <div>
      <b-img
        v-if="newsfeed.image"
        v-b-modal="'photoModal-' + newsfeed.id"
        thumbnail
        rounded
        lazy
        :src="newsfeed.image.paththumb"
        class="clickme"
      />
    </div>
    <div class="mt-2 d-flex justify-content-between">
      <NewsLoveComment :newsfeed="newsfeed" @focus-comment="$emit('focus-comment')" />
      <div>
        <ChatButton
          :userid="newsfeed.userid"
          title="Message"
          size="sm"
        />
        <b-btn variant="white" size="sm" class="d-inline-block" @click="share">
          <v-icon name="share-alt" /> Share
        </b-btn>
      </div>
    </div>
    <b-modal
      v-if="newsfeed.image"
      :id="'photoModal-' + newsfeed.id"
      ref="photoModal"
      title="ChitChat Photo"
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
          :src="newsfeed.image.path"
        />
      </template>
    </b-modal>
    <NewsShareModal v-if="newsfeedModal" :newsfeed="newsfeedModal" />
  </div>
</template>
<script>
import ChatButton from './ChatButton'
import NewsBase from '~/components/NewsBase'
import NewsUserIntro from '~/components/NewsUserIntro'

import NewsLoveComment from '~/components/NewsLoveComment'
const NewsShareModal = () => import('~/components/NewsShareModal')

export default {
  components: {
    ChatButton,
    NewsShareModal,
    NewsUserIntro,
    NewsLoveComment
  },
  extends: NewsBase
}
</script>
