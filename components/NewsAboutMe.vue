<template>
  <div>
    <NewsUserIntro v-if="userid" :userid="userid" :users="users" :newsfeed="newsfeed" append="introduced themselves" />
    <span v-if="newsfeed.message" class="font-weight-bold prewrap forcebreak">{{ emessage }}</span>
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
    <div class="mt-2">
      <NewsLoveComment :newsfeed="newsfeed" @focus-comment="$emit('focus-comment')" />
      <span class="float-right d-inline-block">
        <b-btn variant="primary" size="sm" @click="showModal">
          <v-icon name="user" /> Introduce yourself
        </b-btn>
        <AboutMeModal ref="modal" />
      </span>
    </div>
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
import 'vue-awesome/icons/user'
import NewsBase from '~/components/NewsBase'
const AboutMeModal = () => import('./AboutMeModal')
const NewsUserIntro = () => import('~/components/NewsUserIntro')
const NewsLoveComment = () => import('~/components/NewsLoveComment')

export default {
  components: {
    AboutMeModal,
    NewsUserIntro,
    NewsLoveComment
  },
  extends: NewsBase,
  methods: {
    showModal() {
      this.$refs.modal.show()
    }
  }
}
</script>
