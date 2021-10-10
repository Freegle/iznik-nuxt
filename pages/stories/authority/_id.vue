<template>
  <div>
    <b-row class="m-0">
      <b-col cols="12" lg="6" class="p-0" offset-lg="3">
        <div class="bg-white p-4">
          <h1>Stories from Freeglers<span v-if="authorityname"> on {{ authorityname }}</span></h1>
          <p>
            We love to hear why you freegle and what your experiences have been - and it helps show new freeglers what it's all about.
          </p>
          <p>
            So please tell us your story!
          </p>
          <b-btn variant="primary" class="mt-2" @click="showAddModal">
            <v-icon name="book-open" /> Tell us your story!
          </b-btn>
        </div>
        <div v-for="story in sortedStories" :key="'story-' + story.id" class="mt-2">
          <Story :id="story.id" />
        </div>
      </b-col>
      <b-col cols="0" md="3" class="d-none d-md-block" />
    </b-row>
    <StoriesAddModal ref="addmodal" />
  </div>
</template>
<script>
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'

const StoriesAddModal = () => import('~/components/StoriesAddModal')
const Story = () => import('~/components/Story')

export default {
  components: {
    StoriesAddModal,
    Story
  },
  mixins: [loginOptional, buildHead],
  data: function() {
    return {
      id: null,
      context: null,
      infiniteId: +new Date(),
      complete: false,
      modalStory: null
    }
  },
  computed: {
    sortedStories() {
      let stories = this.$store.getters['stories/list']

      if (stories) {
        stories = Object.values(stories)
        return stories.sort(function(a, b) {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
      }

      return []
    },
    authority() {
      return this.$store.getters['authorities/get'](this.id)
    },
    authorityname() {
      return this.authority ? this.authority.name : null
    }
  },
  async asyncData({ app, params, store }) {
    await store.dispatch('stories/fetch', {
      authorityid: params.id
    })

    await store.dispatch('authorities/fetch', {
      id: params.id
    })

    return {}
  },
  created() {
    this.id = this.$route.params.id
  },
  methods: {
    showAddModal() {
      this.$refs.addmodal.show()
    }
  },
  head() {
    return this.buildHead(
      this.authorityname
        ? 'Stories for ' + this.authorityname
        : 'Stories from freeglers',
      'Real stories from real freeglers.'
    )
  }
}
</script>
