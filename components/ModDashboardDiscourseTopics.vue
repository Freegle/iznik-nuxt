<template>
  <b-card v-if="DiscourseTopics" no-body>
    <b-card-body>
      <b-card-title>
        Latest Discourse Topics
      </b-card-title>
      <p>
        Discourse is where we can chat to each other and ask questions.  Join in!
      </p>
      <ModDashboardDiscourseTopic v-for="topic in top5" :key="topic.id" :topic="topic" />
      <NoticeMessage variant="info">
        We also have a couple of groups on WhatsApp for
        <!-- eslint-disable-next-line -->
        <ExternalLink href="https://chat.whatsapp.com/DLS6UdRxXxr5slNN48SOwK">chat</ExternalLink>
        and
        <!-- eslint-disable-next-line -->
        <ExternalLink href="https://chat.whatsapp.com/EFdLHJ8IqSOIcUDlLlWxpy">announcements</ExternalLink>.
      </NoticeMessage>
    </b-card-body>
  </b-card>
</template>
<script>
import ModDashboardDiscourseTopic from '@/components/ModDashboardDiscourseTopic'
import ExternalLink from './ExternalLink.vue'
import NoticeMessage from './NoticeMessage.vue'
import ModDashboardBase from '~/components/ModDashboardBase'

export default {
  components: { NoticeMessage, ExternalLink, ModDashboardDiscourseTopic },
  extends: ModDashboardBase,
  data: function() {
    return {
      askfor: ['DiscourseTopics'],
      DiscourseTopics: null,
      refreshTimer: null
    }
  },
  computed: {
    top5() {
      let ret = []

      if (this.DiscourseTopics) {
        const topics = JSON.parse(this.DiscourseTopics)
        if (topics && topics.latest_posts) {
          ret = topics.latest_posts.slice(0, 5)
        }
      }

      return ret
    }
  },
  mounted() {
    this.refreshTimer = setTimeout(this.doRefresh, 10 * 60 * 1000)
  },
  beforeDestroy() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
      this.refreshTimer = null
    }
  },
  methods: {
    doRefresh() {
      this.maybeFetch()
      this.refreshTimer = setTimeout(this.doRefresh, 10 * 60 * 1000)
    }
  }
}
</script>
