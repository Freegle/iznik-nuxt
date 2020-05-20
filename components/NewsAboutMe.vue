<template>
  <div>
    <NewsUserIntro v-if="userid" :userid="userid" :users="users" :newsfeed="newsfeed" append="introduced themselves" />
    <read-more v-if="newsfeed.message && emessage" :text="emessage" :max-chars="1024" class="font-weight-bold preline forcebreak nopara" />
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
        <b-btn variant="white" size="sm" @click="showModal">
          <v-icon name="user" /> Introduce yourself to everyone
        </b-btn>
        <AboutMeModal ref="modal" />
      </span>
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
  </div>
</template>
<script>
import NewsBase from '~/components/NewsBase'
import NewsUserIntro from '~/components/NewsUserIntro'
import NewsLoveComment from '~/components/NewsLoveComment'
const AboutMeModal = () => import('./AboutMeModal')

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
