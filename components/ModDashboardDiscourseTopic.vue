<template>
  <div>
    <div class="d-flex">
      <ProfileImage
        :image="avatar"
        class="ml-1 mb-1 inline"
        is-thumbnail
        size="lg"
      />
      <div>
        <div class="d-flex">
          <strong>{{ topic.name }}</strong>&nbsp;
          <div class="text-muted small d-flex flex-column justify-content-center">
            &nbsp;posted
            {{ topic.updated_at | timeago }}
            on&nbsp;
          </div>
          <ExternalLink :href="link">
            {{ topic.topic_title }}
          </ExternalLink>
        </div>
        <!-- eslint-disable-next-line -->
        <div v-html="snippet" />
      </div>
    </div>
  </div>
</template>
<script>
import ProfileImage from '@/components/ProfileImage'
import ExternalLink from '@/components/ExternalLink'
export default {
  components: { ExternalLink, ProfileImage },
  props: {
    topic: {
      type: Object,
      required: true
    }
  },
  computed: {
    avatar() {
      return (
        'https://discourse.ilovefreegle.org/' +
        this.topic.avatar_template.replace('{size}', '45')
      )
    },
    snippet() {
      return this.topic.raw.replace('\n', ' ')
    },
    link() {
      return (
        'https://discourse.ilovefreegle.org/t/' +
        this.topic.topic_slug +
        '/' +
        this.topic.topic_id +
        '/' +
        this.topic.post_number
      )
    }
  }
}
</script>
