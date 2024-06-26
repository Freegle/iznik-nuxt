<template>
  <div>
    <b-row class="m-0">
      <b-col cols="12" lg="6" class="p-0" offset-lg="3">
        <div class="bg-white p-4">
          <h1>Stories from Freeglers<span v-if="groupname"> on {{ groupname }}</span></h1>
          <p>
            We love to hear why you freegle and what your experiences have been - and it helps show new freeglers what it's all about.
          </p>
          <p>
            So please tell us your story!
          </p>
          <b-row>
            <b-col>
              <groupSelect v-if="loggedIn" v-model="groupid" class="float-left" all :restrict="false" />
            </b-col>
            <b-col>
              <b-btn variant="primary" class="float-right" @click="showAddModal">
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
<script>
import loginOptional from '@/mixins/loginOptional.js'
import createGroupRoute from '@/mixins/createGroupRoute'
import buildHead from '@/mixins/buildHead.js'

const GroupSelect = () => import('~/components/GroupSelect')
const StoriesAddModal = () => import('~/components/StoriesAddModal')
const Story = () => import('~/components/Story')

const LIMIT = 20

export default {
  components: {
    GroupSelect,
    StoriesAddModal,
    Story
  },
  mixins: [
    loginOptional,
    createGroupRoute('stories', { routeParam: 'groupid' }),
    buildHead
  ],
  data: function() {
    return {
      context: null,
      infiniteId: +new Date(),
      complete: false,
      modalStory: null,
      limit: LIMIT
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
    groupname() {
      if (this.groupid) {
        // Find selected in our groups
        for (const group of this.myGroups) {
          if (group.id === this.groupid) {
            return group.namedisplay
          }
        }
      }

      if (this.asyncGroupid) {
        const group = this.$store.getters['group/get'](this.asyncGroupid)
        if (group) {
          return group.namedisplay
        }
      }

      return null
    }
  },
  async asyncData({ app, params, store }) {
    await store.dispatch('stories/fetch', {
      groupid: params.groupid > 0 ? params.groupid : null
    })

    if (params.groupid) {
      await store.dispatch('group/fetch', {
        id: params.groupid
      })
    }

    return {
      asyncGroupid: params.groupid
    }
  },
  created() {
    this.limit = this.$route.query.limit || LIMIT
  },
  mounted() {
    if (this.limit) {
      // Secret parameter to pick up more stories.
      this.$store.dispatch('stories/fetch', {
        groupid: this.asyncGroupid,
        limit: this.limit
      })
    }
  },
  methods: {
    showAddModal() {
      this.$refs.addmodal.show()
    }
  },
  head() {
    return this.buildHead(
      this.groupname
        ? 'Stories for ' + this.groupname
        : 'Stories from freeglers',
      'Real stories from real freeglers.'
    )
  }
}
</script>
