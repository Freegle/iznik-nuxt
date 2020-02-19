<template>
  <span>
    <b-modal
      :id="'newsLovesModal-' + id"
      v-model="showModal"
      :title="title"
      no-stacking
    >
      <template slot="default">
        <ul v-if="newsfeed" class="p-0">
          <li v-for="(love, index) in newsfeed.lovelist" :key="'love-' + love.id" class="p-0 pt-1 list-unstyled">
            <div class="media clickme">
              <div class="media-left">
                <div class="media-object">
                  <ProfileImage v-if="love.profile.turl" :image="love.profile.turl" class="ml-1 mb-1 inline" is-thumbnail size="lg" />
                </div>
              </div>
              <div class="media-body ml-2">
                <span class="text-success font-weight-bold">
                  {{ love.displayname }}
                </span>
                <br>
                <NewsUserInfo :user="love" :index="index" />
              </div>
            </div>
          </li>
        </ul>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="white" @click="cancel">
          Close
        </b-button>
      </template>
    </b-modal>
  </span>
</template>
<script>
import NewsUserInfo from '~/components/NewsUserInfo'
import ProfileImage from '~/components/ProfileImage'

export default {
  components: {
    NewsUserInfo,
    ProfileImage
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      showModal: false,
      newsfeed: null
    }
  },
  computed: {
    title() {
      let ret = null

      if (this.newsfeed) {
        ret =
          this.newsfeed.loves +
          ' freegler' +
          (this.newsfeed.loves !== 1 ? 's' : '') +
          ' love' +
          (this.newsfeed.loves === 1 ? 's' : '') +
          ' this'
      }

      return ret
    },
    loveusers() {
      const ret = {}

      if (this.newsfeed) {
        this.newsfeed.lovelist.forEach(user => {
          ret[user.id] = user
        })
      }

      return ret
    }
  },
  methods: {
    async show() {
      this.newsfeed = await this.$store.dispatch('newsfeed/fetch', {
        id: this.id,
        lovelist: true
      })

      this.showModal = true
    },
    hide() {
      this.showModal = false
    }
  }
}
</script>
