<template>
  <div>
    <b-row class="m-0">
      <b-col cols="0" md="3" class="d-none d-md-block" />
      <b-col cols="12" md="6" class="p-0">
        <div>
          <h1>Stories from Freeglers</h1>
          <p>
            These are stories we could send out in the next newsletter to freeglers. Please click the button to show
            which ones you love; we'll send out the most loved ones. They're in a random order so that each gets a fair chance.
          </p>
        </div>
        <div v-for="story in sortedStories" :key="'story-' + story.id" class="mt-2">
          <Story :id="story.id" />
        </div>
      </b-col>
      <b-col cols="0" md="3" class="d-none d-md-block" />
    </b-row>
  </div>
</template>
<style scoped>
</style>
<script>
import loginRequired from '@/mixins/loginRequired.js'
const Story = () => import('~/components/Story')

export default {
  components: {
    Story
  },
  mixins: [loginRequired],
  computed: {
    sortedStories() {
      const stories = this.$store.getters['stories/list']()
      return this.shuffle(stories)
    }
  },
  async mounted() {
    await this.$store.dispatch('stories/clear')
    await this.$store.dispatch('stories/fetch', {
      reviewnewsletter: true
    })
  },
  methods: {
    shuffle(array) {
      let counter = array.length

      while (counter > 0) {
        const index = Math.floor(Math.random() * counter)
        counter--
        const temp = array[counter]
        array[counter] = array[index]
        array[index] = temp
      }

      return array
    }
  }
}
</script>
