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
    </b-card-body>
  </b-card>
</template>
<script>
import ModDashboardDiscourseTopic from '@/components/ModDashboardDiscourseTopic'
import ModDashboardBase from '~/components/ModDashboardBase'

export default {
  components: { ModDashboardDiscourseTopic },
  extends: ModDashboardBase,
  data: function() {
    return {
      askfor: ['DiscourseTopics'],
      DiscourseTopics: null
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
  }
}
</script>
