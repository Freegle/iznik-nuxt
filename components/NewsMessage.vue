<template>
  <div>
    <NewsUserIntro v-if="userid" :userid="userid" :users="users" :newsfeed="newsfeed" />
    <!-- eslint-disable-next-line-->
    <div v-if="newsfeed.html" v-html="newsfeed.html" />
    <read-more v-else-if="newsfeed.message && emessage" :text="emessage" :max-chars="1024" class="font-weight-bold preline forcebreak nopara" />
    <div>
      <b-img-lazy
        v-if="newsfeed.image"
        v-b-modal="'photoModal-' + newsfeed.id"
        rounded
        :src="newsfeed.image.path"
        class="clickme imgthumb mt-1"
      />
    </div>
    <div class="mt-2 d-flex justify-content-between">
      <NewsLoveComment :newsfeed="newsfeed" @focus-comment="$emit('focus-comment')" />
      <div class="d-flex">
        <ChatButton
          :userid="newsfeed.userid"
          title="Message"
          size="sm"
          variant="secondary"
          class="mr-2"
        />
        <b-btn variant="secondary" size="sm" class="d-inline-block" @click="share">
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
<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.imgthumb {
  width: 100%;

  @include media-breakpoint-up(md) {
    width: 400px;
  }
}
</style>
