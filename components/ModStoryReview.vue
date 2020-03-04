<template>
  <div>
    <b-card no-body>
      <b-card-header>
        <div class="d-flex justify-content-between flex-wrap w-100">
          <span>
            <ProfileImage :image="story.user.profile.turl" class="mr-1 ml-1 mb-1 mt-1 inline" is-thumbnail size="sm" />
            <b>{{ story.user.email }}</b>
            <span class="small">
              <v-icon name="hashtag" scale="0.75" class="text-muted" />{{ story.user.id }}
            </span>
          </span>
          <span>
            member of <b>{{ story.groupname }}</b>, posted {{ story.date | timeago }}
          </span>
          <span>
            <v-icon name="hashtag" scale="0.75" class="text-muted" />{{ story.id }}
          </span>
        </div>
      </b-card-header>
      <b-card-body>
        <!-- eslint-disable-next-line -->
        <h3>{{ story.headline }}</h3>
        <b>{{ story.story }}</b>
        <NoticeMessage v-if="!story.public" variant="info" class="mt-1">
          They've said this story isn't public, so this is just for you to read and then click Hide. You might also like to thank them via Chat.
        </NoticeMessage>
      </b-card-body>
      <b-card-footer>
        <div class="d-flex flex-wrap justify-content-start">
          <b-btn variant="warning" class="mr-2 mb-1" @click="dontUseForPublicity">
            <v-icon name="times" /> Hide
          </b-btn>
          <div v-if="story.public">
            <b-btn v-if="newsletter" variant="success" class="mr-2 mb-1" @click="useForNewsletter">
              <v-icon name="times" /> Good for newsletter
            </b-btn>
            <b-btn v-else variant="success" class="mr-2 mb-1" @click="useForPublicity">
              <v-icon name="times" /> Good for publicity
            </b-btn>
          </div>
          <ChatButton
            :userid="story.user.id"
            :groupid="story.groupid"
            title="Chat"
            variant="white"
            class="mr-2 mb-1"
          />
        </div>
      </b-card-footer>
    </b-card>
  </div>
</template>
<script>
import NoticeMessage from './NoticeMessage'
import ChatButton from './ChatButton'
import ProfileImage from './ProfileImage'

export default {
  components: { ProfileImage, ChatButton, NoticeMessage },
  props: {
    story: {
      type: Object,
      required: true
    },
    newsletter: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    groupname() {
      let ret = null
      const group = this.$store.getters['group/get'](this.story.groupid)

      if (group) {
        ret = group.namedisplay
      }

      return ret
    }
  },
  methods: {
    async useForNewsletter() {
      await this.$store.dispatch('stories/useForNewsletter', {
        id: this.story.id
      })
    },
    async useForPublicity() {
      await this.$store.dispatch('stories/useForPublicity', {
        id: this.story.id
      })
    },
    async dontUseForPublicity() {
      await this.$store.dispatch('stories/dontUseForPublicity', {
        id: this.story.id
      })
    }
  }
}
</script>
