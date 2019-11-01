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
            <b-col v-if="oneOfOurs">
              <groupSelect id="stories" class="float-left" all @change="groupChange" />
            </b-col>
            <b-col>
              <b-btn variant="success" class="float-right" @click="showAddModal">
                <v-icon name="book-open" /> Tell us your story!
              </b-btn>
            </b-col>
          </b-row>
        </div>
        <div v-for="(story, $index) in sortedStories" :key="$index" class="mt-2">
          <b-card no-body variant="success">
            <b-card-header>
              &quot;{{ story.headline }}&quot;
            </b-card-header>
            <b-card-text class="pl-2 pr-2">
              <div v-if="story.story" class="preline">
                <div v-if="story.photo" class="float-right">
                  <b-img-lazy v-b-modal="'photoModal-' + story.photo.id" :src="story.photo.path" class="storyphoto clickme" thumbnail />
                  <br>
                </div>
                {{ story.story }}
              </div>
              <span class="text-muted small">
                <b-btn variant="white" class="float-right mb-1" @click="share(story)">
                  <v-icon name="share-alt" />
                </b-btn>
                {{ story.date | timeago }} <span v-if="!groupid">on {{ story.groupname }}</span>
              </span>
            </b-card-text>
          </b-card>
          <b-modal
            v-if="story.photo"
            :id="'photoModal-' + story.photo.id"
            ref="photoModal"
            title="Story Photo"
            alt="Story Photo"
            size="lg"
            no-stacking
            ok-only
          >
            <template slot="default">
              <b-img
                fluid
                rounded
                center
                :src="story.photo.path"
              />
            </template>
          </b-modal>
        </div>
      </b-col>
      <b-col cols="0" md="3" class="d-none d-md-block" />
    </b-row>
    <StoriesAddModal ref="addmodal" />
    <StoriesShareModal ref="share" :story="modalStory" />
  </div>
</template>
<style scoped>
.storyphoto {
  max-height: 250px !important;
  max-width: 250px !important;
}
</style>
<script>
// TODO MINOR Add infinite scroll
// TODO Story loves
// TODO Individual story page.
import loginOptional from '@/mixins/loginOptional.js'
import StoriesShareModal from '~/components/StoriesShareModal'
const GroupSelect = () => import('~/components/GroupSelect')
const StoriesAddModal = () => import('~/components/StoriesAddModal')

export default {
  components: {
    GroupSelect,
    StoriesAddModal,
    StoriesShareModal
  },
  mixins: [loginOptional],
  data: function() {
    return {
      groupid: null,
      context: null,
      infiniteId: +new Date(),
      complete: false,
      modalStory: null
    }
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
    },
    groupname() {
      let ret = null

      if (this.sortedStories && this.sortedStories.length && this.groupid) {
        ret = this.sortedStories[0].groupname
      }

      return ret
    },
    oneOfOurs() {
      const myGroups = this.$store.getters['auth/groups']()

      let ret = false

      for (const group of myGroups) {
        if (
          this.groupid === 0 ||
          parseInt(group.id) === parseInt(this.groupid)
        ) {
          ret = true
        }
      }

      return ret
    }
  },
  created() {
    this.groupid = this.$route.params.id
  },
  async mounted() {
    if (this.groupid) {
      // Ensure our select is set to the right value
      this.$store.commit('group/remember', {
        id: 'stories',
        val: this.groupid
      })
    }

    await this.$store.dispatch('stories/clear')
    await this.$store.dispatch('stories/fetchSummary', {
      groupid: this.groupid > 0 ? this.groupid : null
    })
  },
  methods: {
    groupChange: function(newGroup) {
      if (newGroup) {
        this.$router.push('/stories/' + newGroup)
      } else {
        this.$router.push('/stories')
      }
    },

    showAddModal() {
      this.$refs.addmodal.show()
    },

    share(story) {
      this.modalStory = story
      this.$nextTick(() => {
        this.$bvModal.show('storiesShareModal-' + story.id)
      })
    }
  }
}
</script>
