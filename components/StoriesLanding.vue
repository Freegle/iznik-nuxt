<template>
  <div>
    <b-card>
      <h3>Why Freegle?</h3>
      <p>Here's what freeglers have said recently:</p>
      <div v-for="story in sortedStories" :key="'story-' + story.id" class="">
        <h5 class="mt-2">
          &quot;{{ story.headline }}&quot;
        </h5>
        <read-more v-if="story.story" :text="story.story" :max-chars="80" class="nopara" />
        <span class="text-muted small">
          {{ timeago(story.date) }} on {{ story.groupname }}
        </span>
      </div>
      <b-row>
        <b-col class="text-center">
          <b-btn variant="secondary" to="/stories" class="mt-2">
            Discover more stories...
          </b-btn>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>
<script>
export default {
  // Cache this for performance as it's on the landing page.
  name: 'StoriesLanding',
  serverCacheKey: () => 'storiesLanding',
  data: function() {
    return {}
  },
  computed: {
    sortedStories() {
      let stories = this.$store.getters['stories/list']

      if (stories) {
        stories = Object.values(stories).slice(0, 3)
        return stories.sort(function(a, b) {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
      }

      return []
    }
  },
  async mounted() {
    await this.$store.dispatch('stories/fetch', {
      limit: 3
    })
  }
}
</script>
