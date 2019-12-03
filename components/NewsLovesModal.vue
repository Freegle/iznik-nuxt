<template>
  <div>
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
                  <b-img-lazy
                    v-if="love.profile.turl"
                    rounded="circle"
                    thumbnail
                    class="profile p-0 ml-1 mb-1 inline float-left"
                    alt="Profile picture"
                    title="Profile"
                    :src="love.profile.turl"
                    @error.native="brokenImage"
                    @click="showInfo"
                  />
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
  </div>
</template>
<script>
const NewsUserInfo = () => import('~/components/NewsUserInfo')

export default {
  components: {
    NewsUserInfo
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
    brokenImage(event) {
      event.target.src = '/static/defaultprofile.png'
    },
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
