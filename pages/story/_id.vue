<template>
  <div>
    <b-row v-if="invalid" class="m-0">
      <b-col cols="12" lg="6" class="p-0" offset-lg="3">
        <NoticeMessage variant="danger" class="mt-2">
          Sorry, that story isn't around any more.
        </NoticeMessage>
      </b-col>
    </b-row>
    <b-row v-else class="m-0">
      <b-col cols="0" md="3" class="d-none d-md-block" />
      <b-col cols="12" md="6" class="p-0">
        <div class="bg-white p-4">
          <p>
            We love to hear why you freegle and what your experiences have been - and it helps show new freeglers what it's all about.
          </p>
          <p>
            So please tell us your story!
          </p>
          <b-btn variant="primary" @click="showAddModal">
            <v-icon name="book-open" /> Tell us your story!
          </b-btn>
        </div>
        <Story :id="story.id" class="mt-2" />
        <b-btn variant="secondary" to="/stories" class="mt-2">
          View more stories
        </b-btn>
      </b-col>
      <b-col cols="0" md="3" class="d-none d-md-block" />
    </b-row>
    <StoriesAddModal ref="addmodal" />
  </div>
</template>
<script>
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
import NoticeMessage from '../../components/NoticeMessage'

const StoriesAddModal = () => import('~/components/StoriesAddModal')
const Story = () => import('~/components/Story')

export default {
  components: {
    NoticeMessage,
    StoriesAddModal,
    Story
  },
  mixins: [loginOptional, buildHead],
  data: function() {
    return {
      id: null
    }
  },
  computed: {
    story() {
      return this.$store.getters['stories/get'](this.id)
    }
  },
  async asyncData({ app, params, store }) {
    let invalid = false

    try {
      await store.dispatch('stories/fetch', {
        id: params.id
      })
    } catch (e) {
      invalid = true
    }

    return {
      invalid: invalid
    }
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
    if (this.invalid) {
      return this.buildHead('Story #' + this.id)
    } else {
      return this.buildHead(
        this.story
          ? 'Freegle Story: ' + this.story.headline
          : 'Freegle Stories',
        this.story.story,
        this.story.photo
      )
    }
  }
}
</script>
