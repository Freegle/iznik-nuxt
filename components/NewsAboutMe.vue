<template>
  <div>
    <NewsUserIntro v-if="userid" :userid="userid" :users="users" :newsfeed="newsfeed" append="introduced themselves" />
    <b-row v-if="newsfeed.message">
      <b-col>
        <span class="font-weight-bold prewrap">{{ emessage }}</span>
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
        <span class="float-right d-inline-block">
          <b-btn variant="primary" size="sm" @click="introduce">
            <v-icon name="user" /> Introduce yourself
          </b-btn>
        </span>
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
import NewsUserIntro from '~/components/NewsUserIntro'
import NewsLoveComment from '~/components/NewsLoveComment'

export default {
  components: {
    NewsUserIntro,
    NewsLoveComment
  },
  extends: NewsBase,
  methods: {
    introduce() {
      // TODO
    }
  }
}
</script>
