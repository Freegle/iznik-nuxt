<template>
  <div>
    <b-card variant="white">
      <h3>Why Freegle?</h3>
      <p>Here's what freeglers have said recently:</p>
      <div v-for="(story, $index) in sortedStories" :key="$index" class="">
        <h5 class="mt-2">
          &quot;{{ story.headline }}&quot;
        </h5>
        <read-more v-if="story.story" :text="story.story" :max-chars="80" class="nopara" />
        <span class="text-muted small">
          {{ story.date | timeago }} on {{ story.groupname }}
        </span>
      </div>
      <b-row>
        <b-col class="text-center">
          <b-btn variant="white" to="/stories" class="mt-2">
            Read more stories...
          </b-btn>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>
<script>
export default {
  data: function() {
    return {}
  },
  computed: {
    sortedStories() {
      let stories = this.$store.getters['stories/list']()

      if (stories) {
        stories = Object.values(stories)
        return stories.sort(function(a, b) {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
      }

      return []
    }
  },
  async mounted() {
    await this.$store.dispatch('stories/fetchSummary', {
      limit: 3
    })
  }
}
</script>
