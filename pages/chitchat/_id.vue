<template>
  <b-col>
    <b-row class="m-0">
      <b-col cols="3">
        Community Events go here
      </b-col>
      <b-col cols="6" class="newsfeedHolder p-0">
        <b-card>
          <b-card-text>
            <b-row>
              <b-col class="text-center">
                <h4>
                  Looking for your own posts?  Click <nuxt-link to="/myposts">
                    here
                  </nuxt-link>
                </h4>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="5">
                <nuxt-link to="/give">
                  <b-btn block variant="success" class="float-left">
                    <fa icon="gift" />&nbsp;Give stuff
                  </b-btn>
                </nuxt-link>
              </b-col>
              <b-col cols="2" />
              <b-col cols="5">
                <nuxt-link to="/find">
                  <b-btn block variant="primary" class="float-right">
                    <fa icon="search" />&nbsp;Find stuff
                  </b-btn>
                </nuxt-link>
              </b-col>
            </b-row>
          </b-card-text>
        </b-card>
        <b-row class="mt-2">
          <b-col>
            <b-card no-body>
              <b-tabs card>
                <b-tab active>
                  <template slot="title">
                    <fa icon="pen" />&nbsp;ChitChat
                  </template>
                  <b-card-text>
                    <b-textarea v-model="startThread" v-focus rows="2" max-rows="8" placeholder="Chat to nearby freeglers...ask for advice, recommendations, or just have a good old blether.  If you're looking to give or find stuff, please use the OFFER/WANTED tabs.  Everything on here is public." />
                  </b-card-text>
                </b-tab>
                <b-tab>
                  <template slot="title">
                    <fa icon="gift" />&nbsp;OFFER
                  </template>
                  <b-card-text>TODO</b-card-text>
                </b-tab>
                <b-tab>
                  <template slot="title">
                    <fa icon="search" />&nbsp;WANTED
                  </template>
                  <b-card-text>TODO</b-card-text>
                </b-tab>
                <b-tab>
                  <template slot="title">
                    <fa icon="calendar-alt" />&nbsp;Event
                  </template>
                  <b-card-text>TODO</b-card-text>
                </b-tab>
                <b-tab>
                  <template slot="title">
                    <fa icon="star" />&nbsp;Volunteer
                  </template>
                  <b-card-text>TODO</b-card-text>
                </b-tab>
              </b-tabs>
              <hr class="mt-1 mb-1">
              <b-row>
                <b-col cols="3" class="pl-4 text-muted">
                  <div v-if="me.settings.mylocation && me.settings.mylocation.area.name">
                    <fa icon="map-marker-alt" />&nbsp;{{ me.settings.mylocation.area.name }}
                  </div>
                </b-col>
                <b-col cols="6">
                  <b-form-select v-model="selectedArea" :options="areaOptions" @change="areaChange" />
                </b-col>
                <b-col cols="3">
                  <b-row>
                    <b-col>
                      <div class="float-right pb-1 pr-1">
                        <b-btn variant="primary">
                          Add photo
                        </b-btn>
                        <b-btn variant="success" @click="postIt">
                          Post it!
                        </b-btn>
                      </div>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-card>
          </b-col>
        </b-row>
        <div class=" p-0 pt-1 mb-1">
          <ul v-for="(entry, $index) in newsfeed" :key="'newsfeed-' + $index + '-area-' + selectedArea" class="list-unstyled">
            <li v-if="entry && entry.visible && !entry.unfollowed">
              <NewsThread :id="entry.id" :key="'newsfeed-' + entry.id" :users="users" />
            </li>
          </ul>
          <infinite-loading :identifier="infiniteId" force-use-infinite-wrapper="body" @infinite="loadMore">
            <span slot="no-results" />
            <span slot="spinner">
              <b-img-lazy src="~/static/loader.gif" />
            </span>
          </infinite-loading>
        </div>
      </b-col>
      <b-col cols="3">
        Volunteer ops and ads go here
      </b-col>
    </b-row>
  </b-col>
</template>
<style scoped>
.newsfeedHolder {
  height: calc(100vh - 74px);
}

.tab-content,
.tab-pane {
  background-color: white;
}
</style>
<script>
// TODO Post photos
import NewsThread from '~/components/NewsThread.vue'
import twem from '~/assets/js/twem'

export default {
  components: {
    NewsThread
  },

  validate({ params }) {
    // Must be a number if present
    return !params.id || /^\d+$/.test(params.id)
  },

  data() {
    return {
      id: null,
      newsfeed: null,
      users: [],
      busy: false,
      startThread: null,
      areaOptions: [
        {
          value: 'nearby',
          text: 'Show chitchat from nearby'
        },
        {
          value: 1609,
          text: 'Show chitchat within 1 mile'
        },
        {
          value: 3128,
          text: 'Show chitchat within 2 miles'
        },
        {
          value: 8046,
          text: 'Show chitchat within 5 miles'
        },
        {
          value: 16093,
          text: 'Show chitchat within 10 miles'
        },
        {
          value: 32186,
          text: 'Show chitchat within 20 miles'
        },
        {
          value: 80467,
          text: 'Show chitchat within 50 miles'
        },
        {
          value: 0,
          text: 'Show chitchat from anywhere'
        }
      ],
      infiniteId: +new Date()
    }
  },

  computed: {
    me() {
      return this.$store.state.auth.user
    },
    selectedArea: {
      get: function() {
        const remembered = this.$store.getters['newsfeed/area']()

        return remembered || 0
      },
      set: function(newval) {
        this.$store.commit('newsfeed/area', {
          area: newval
        })
      }
    }
  },

  beforeCreate() {
    // Clear the store.  This is to ensure that we remove any delete items, but it does mean that we're not using
    // the store to improve performance.  TODO
    this.$store.commit('newsfeed/clearFeed')

    this.id = this.$route.params.id
  },

  mounted() {
    // We want this to be our next home page.
    try {
      localStorage.setItem('Iznik>lasthomepage', 'news')
    } catch (e) {
      console.log('Save last route failed', e)
    }
  },

  methods: {
    async loadMore($state) {
      this.busy = true

      if (!this.$store.$auth.loggedIn) {
        console.log('Not logged in')

        if ($state.complete) {
          $state.complete()
        }
      } else {
        try {
          const context = this.$store.getters['newsfeed/getContext']()
          await this.$store.dispatch('newsfeed/fetchFeed', {
            context: context,
            distance: this.selectedArea
          })

          this.newsfeed = this.$store.getters['newsfeed/newsfeed']()
          this.users = this.$store.getters['newsfeed/users']()
          // TODO Handle ID case

          if ($state.loaded) {
            $state.loaded()
          }
        } catch (e) {
          console.log('Load failed', e)

          if ($state.complete) {
            $state.complete()
          }
        }

        this.busy = false
      }
    },

    areaChange: function() {
      console.log('Area change', this.selectedArea)
      this.infiniteId++
      this.$store.commit('newsfeed/clearFeed')
      this.newsfeed = null
    },

    async postIt() {
      let msg = this.startThread

      // Encode up any emojis.
      msg = twem.untwem(msg)

      await this.$store.dispatch('newsfeed/send', {
        message: msg
      })

      // Show the new message
      this.newsfeed = this.$store.getters['newsfeed/newsfeed']()

      // Clear the textarea now it's sent.
      this.startThread = null
    }
  }
}
</script>
