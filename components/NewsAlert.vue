<template>
  <div>
    <div class="d-flex">
      <ProfileImage :image="require(`@/static/icon.png`)" class="ml-1 mb-1 inline" is-thumbnail size="lg" />
      <div>
        <span class="text-success font-weight-bold pl-2">
          Freegle
        </span>
        <br>
        <span class="text-muted small pl-2">
          {{ timeago(newsfeed.added) }}
        </span>
      </div>
    </div>
    <!-- eslint-disable-next-line-->
    <div v-if="newsfeed.html" v-html="newsfeed.html" />
    <span v-else-if="newsfeed.message" class="font-weight-bold preline forcebreak">{{ emessage }}</span>
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
    <div class="mt-2 d-flex flex-wrap justify-content-between">
      <NewsLoveComment :newsfeed="newsfeed" @focus-comment="$emit('focus-comment')" />
      <b-btn variant="secondary" size="sm" class="d-inline-block" @click="share">
        <v-icon name="share-alt" /> Share
      </b-btn>
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
import NewsBase from '~/components/NewsBase'
import NewsLoveComment from '~/components/NewsLoveComment'
import ProfileImage from '~/components/ProfileImage'
const NewsShareModal = () => import('~/components/NewsShareModal')

export default {
  components: {
    NewsShareModal,
    NewsLoveComment,
    ProfileImage
  },
  extends: NewsBase
}
</script>
