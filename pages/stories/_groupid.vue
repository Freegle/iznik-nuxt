<template>
  <div>
    <b-row class="m-0">
      <b-col cols="0" md="3" class="d-none d-md-block" />
      <b-col cols="12" md="6" class="p-0">
        <div>
          <h1>Stories from Freeglers<span v-if="groupname"> on {{ groupname }}</span></h1>
          <p>
            We love to hear why people Freegle - it keeps our volunteers volunteering, and it helps show new freeglers what it's all about.
          </p>
          <p>
            So please tell us your story!
          </p>
          <b-row>
            <b-col>
              <groupSelect v-if="loggedIn" v-model="groupid" class="float-left" all />
            </b-col>
            <b-col>
              <b-btn variant="success" class="float-right" @click="showAddModal">
                <v-icon name="book-open" /> Tell us your story!
              </b-btn>
            </b-col>
          </b-row>
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
<style scoped>
</style>
<script>
// TODO MINOR Add infinite scroll
import loginOptional from '@/mixins/loginOptional.js'
import createGroupRoute from '@/mixins/createGroupRoute'
const GroupSelect = () => import('~/components/GroupSelect')
const StoriesAddModal = () => import('~/components/StoriesAddModal')
const Story = () => import('~/components/Story')

export default {
  components: {
    GroupSelect,
    StoriesAddModal,
    Story
  },
  mixins: [
    loginOptional,
    createGroupRoute('stories', { routeParam: 'groupid' })
  ],
  data: function() {
    return {
      context: null,
      infiniteId: +new Date(),
      complete: false,
      modalStory: null
    }
  },
  computed: {
    loggedIn() {
      const ret = Boolean(this.$store.getters['auth/user'])
      return ret
    },
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
    groupname() {
      let ret = null

      if (this.sortedStories && this.sortedStories.length && this.groupid) {
        ret = this.sortedStories[0].groupname
      }

      return ret
    }
  },
  async mounted() {
    await this.$store.dispatch('stories/clear')
    await this.$store.dispatch('stories/fetch', {
      groupid: this.groupid > 0 ? this.groupid : null
    })
  },
  methods: {
    showAddModal() {
      this.$refs.addmodal.show()
    }
  }
}
</script>
