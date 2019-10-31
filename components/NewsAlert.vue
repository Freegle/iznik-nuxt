<template>
  <div>
    <b-row>
      <b-col v-if="userid">
        <b-img-lazy
          v-if="users[userid].profile.turl"
          rounded="circle"
          thumbnail
          class="profile p-0 ml-1 mb-1 inline float-left"
          alt="Freegle logo"
          title="Freegle logo"
          :src="require(`@/static/icon.png`)"
          @error.native="brokenImage"
        />
        <span class="text-success font-weight-bold pl-2">
          Freegle
        </span>
        <br>
        <span class="text-muted small pl-2">
          {{ $dayjs(newsfeed.timestamp).fromNow() }}
        </span>
      </b-col>
    </b-row>
    <b-row v-if="newsfeed.message">
      <b-col>
        <span class="font-weight-bold prewrap forcebreak">{{ emessage }}</span>
      </b-col>
    </b-row>
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
  </div>
</template>
<script>
import NewsBase from '~/components/NewsBase'
const NewsLoveComment = () => import('~/components/NewsLoveComment')

export default {
  components: {
    NewsLoveComment
  },
  extends: NewsBase,
  methods: {}
}
</script>
