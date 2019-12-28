<template>
  <b-container v-if="me" fluid>
    <b-row class="m-0">
      <b-col cols="0" lg="3" class="d-none d-lg-block">
        <SidebarLeft :show-community-events="true" :show-bot-left="true" />
      </b-col>
      <b-col cols="12" lg="6" class="newsfeedHolder p-0">
        <b-card v-if="!id">
          <b-card-text>
            <h5 class="text-center mb-3">
              Looking for your posts?  Click
              <nuxt-link to="/myposts">
                here
              </nuxt-link>
            </h5>
            <h5 class="text-center mb-3">
              Browse OFFERs/WANTEDs
              <nuxt-link to="/communities">
                here
              </nuxt-link>
            </h5>
            <div class="d-flex justify-content-between">
              <b-btn id="givebutton" ref="givebutton" to="/give" variant="success" class="post__button">
                <v-icon name="gift" class="mr-1" />
                Give stuff
              </b-btn>
              <b-btn id="findbutton" ref="findbutton" to="/find" variant="primary" class="post__button">
                <v-icon name="search" class="mr-1" />
                Find stuff
              </b-btn>
            </div>
          </b-card-text>
          <b-tooltip :show.sync="showToolGive" target="givebutton" placement="bottom" triggers="">
            Giving something away?  Click the Give button.  Chitchat is for other discussion.
          </b-tooltip>
          <b-tooltip :show.sync="showToolFind" target="findbutton" placement="bottom" triggers="">
            Looking for an item?  Click the Find button.  Chitchat is for other discussion.
          </b-tooltip>
        </b-card>
        <div v-if="!id" class="mt-2">
          <b-card no-body class="mb-2">
            <b-card-text>
              <b-textarea v-model="startThread" rows="2" max-rows="8" placeholder="Chat to nearby freeglers...ask for advice, recommendations, or just have a good old blether.  If you're looking to give or find stuff, please use the Give/Find buttons.  Everything on here is public." />
              <b-img v-if="imageid" lazy thumbnail :src="imagethumb" class="image__uploaded" />
            </b-card-text>
            <hr class="mt-1 mb-1">
            <OurFilePond
              v-if="uploading"
              class="bg-white m-0 pondrow"
              imgtype="Newsfeed"
              imgflag="newsfeed"
              @photoProcessed="photoProcessed"
            />
            <div class="pb-1 d-flex justify-content-end">
              <b-btn variant="primary" class="mr-2" @click="photoAdd">
                Add photo
              </b-btn>
              <b-btn variant="success" class="mr-2" @click="postIt">
                Post it!
              </b-btn>
            </div>
          </b-card>
        </div>
        <NewsLocation v-if="!id" class="p-2" @changed="areaChange" />
        <div class=" p-0 pt-1 mb-1">
          <ul v-for="entry in newsfeed" :key="'newsfeed-' + entry.id + '-area-' + selectedArea" class="list-unstyled">
            <li v-if="entry && entry.visible && !entry.unfollowed && entry.threadhead === entry.id">
              <NewsThread :id="entry.id" :key="'newsfeed-' + entry.id" :users="users" :scroll-to="scrollTo" />
            </li>
          </ul>
          <infinite-loading :identifier="infiniteId" force-use-infinite-wrapper="body" :distance="distance" @infinite="loadMore">
            <span slot="no-results" />
            <span slot="no-more" />
            <span slot="spinner">
              <b-img-lazy src="~/static/loader.gif" alt="Loading" />
            </span>
          </infinite-loading>
        </div>
      </b-col>
      <b-col cols="0" lg="3" class="d-none d-lg-block">
        <sidebar-right show-volunteer-opportunities show-job-opportunities />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { TooltipPlugin } from 'bootstrap-vue'
import Vue from 'vue'
import loginRequired from '@/mixins/loginRequired.js'
import buildHead from '@/mixins/buildHead'
import twem from '~/assets/js/twem'
import NewsThread from '~/components/NewsThread.vue'
Vue.use(TooltipPlugin)

const OurFilePond = () => import('~/components/OurFilePond')
const SidebarLeft = () => import('~/components/SidebarLeft')
const SidebarRight = () => import('~/components/SidebarRight')
const NewsLocation = () => import('~/components/NewsLocation')

// TODO MINOR Refetch feed using the visibility plugin.

export default {
  components: {
    NewsThread,
    OurFilePond,
    SidebarLeft,
    SidebarRight,
    NewsLocation
  },
  mixins: [loginRequired, buildHead],

  validate({ params }) {
    // Must be a number if present
    return !params.id || /^\d+$/.test(params.id)
  },

  data: function() {
    return {
      busy: false,
      startThread: null,
      scrollTo: null,
      infiniteId: +new Date(),
      uploading: false,
      imageid: null,
      imagethumb: null,
      distance: 1000,
      runChecks: true,
      showToolGive: false,
      shownToolGive: false,
      showToolFind: false,
      shownToolFind: false
    }
  },

  computed: {
    me() {
      const user = this.$store.getters['auth/user']
      return user
    },
    selectedArea: {
      get: function() {
        const remembered = this.$store.getters['newsfeed/area']

        return remembered || 0
      },
      set: function(newval) {
        this.$store.commit('newsfeed/area', {
          area: newval
        })
      }
    },
    users() {
      const users = this.$store.getters['newsfeed/users']
      return users
    },
    newsfeed() {
      console.log('Compute news', this.$store.getters['newsfeed/newsfeed'])
      return this.$store.getters['newsfeed/newsfeed']
    }
  },

  beforeCreate() {
    this.id = this.$route.params.id
  },

  beforeDestroy() {
    // Stop timers which would otherwise kill garbage collection.
    this.runChecks = false
  },

  mounted() {
    // We want this to be our next home page.
    try {
      localStorage.setItem('Iznik>lasthomepage', 'news')
    } catch (e) {
      console.error('Save last route failed', e)
    }

    // Clear the store otherwise existing info may prevent us triggering a fetch via loadMore.
    this.$store.dispatch('newsfeed/clearFeed')

    setTimeout(this.runCheck, 3000)
  },

  methods: {
    runCheck() {
      // People sometimes try to use chitchat to offer/request items, despite what are technically known as
      // Fuck Off Obvious Big Buttons.  Catch the most obvious attempts and redirect them.
      if (this.runChecks) {
        let msg = this.startThread

        if (msg) {
          msg = msg.toLowerCase()

          if (!this.shownToolGive) {
            for (const word of [
              'offer',
              'giving away',
              'does anyone want',
              'collection from',
              'collection only'
            ]) {
              if (msg.length && msg.indexOf(word) !== -1) {
                this.showToolGive = true
                this.shownToolGive = true
                this.$refs.givebutton.$el.scrollIntoView()
                window.scrollBy(0, -100)

                setTimeout(() => {
                  this.showToolGive = false
                }, 5000)
              }
            }
          }

          if (!this.shownToolFind) {
            for (const word of [
              'wanted',
              'wanting',
              'requesting',
              'looking for',
              'has anybody got',
              'has anyone got',
              'does anyone have',
              'i really need',
              'if anyone has'
            ]) {
              if (msg.length && msg.indexOf(word) !== -1) {
                this.showToolFind = true
                this.shownToolFind = true
                this.$refs.findbutton.$el.scrollIntoView()
                window.scrollBy(0, -100)

                setTimeout(() => {
                  this.showToolFind = false
                }, 5000)
              }
            }
          }
        }

        setTimeout(this.runCheck, 1000)
      }
    },

    async loadMore($state) {
      this.busy = true
      const user = this.$store.getters['auth/user']

      if (!user) {
        if ($state.complete) {
          $state.complete()
        }
      } else {
        try {
          const context = this.$store.getters['newsfeed/getContext']

          if (this.id) {
            await this.$store.dispatch('newsfeed/clearFeed')

            // Just one - fetch it by id.
            await this.$store.dispatch('newsfeed/fetch', {
              id: this.id
            })

            // But maybe this isn't the thread head.
            const fetched = this.$store.getters['newsfeed/get'](this.id)

            if (fetched.threadhead && this.id !== fetched.threadhead) {
              await this.$store.dispatch('newsfeed/clearFeed')
              await this.$store.dispatch('newsfeed/fetch', {
                id: fetched.threadhead
              })

              const threadhead = this.$store.getters['newsfeed/get'](this.id)

              if (threadhead.threadhead !== threadhead.id) {
                // Nope, still wasn't the head.
                await this.$store.dispatch('newsfeed/clearFeed')
                await this.$store.dispatch('newsfeed/fetch', {
                  id: threadhead.threadhead
                })
              }
            } else if (fetched.replyto && this.id !== fetched.replyto) {
              await this.$store.dispatch('newsfeed/clearFeed')
              await this.$store.dispatch('newsfeed/fetch', {
                id: fetched.replyto
              })
            }

            this.scrollTo = this.id

            $state.complete()
          } else {
            // Fetch for the area we are interested in.
            await this.$store.dispatch('newsfeed/fetchFeed', {
              context: context,
              distance: this.selectedArea
            })

            if ($state.loaded) {
              $state.loaded()
            }
          }
        } catch (e) {
          console.error('Load failed', e)

          if ($state.complete) {
            $state.complete()
          }
        }

        this.busy = false
      }
    },
    areaChange: function() {
      this.infiniteId++
      this.$store.commit('newsfeed/clearFeed')
    },
    async postIt() {
      let msg = this.startThread

      if (msg && msg.trim().length) {
        // Encode up any emojis.
        msg = twem.untwem(msg)

        await this.$store.dispatch('newsfeed/send', {
          message: msg,
          imageid: this.imageid
        })

        // Clear the textarea now it's sent.
        this.startThread = null

        // And any image id
        this.imageid = null
      }
    },
    photoAdd() {
      // Flag that we're uploading.  This will trigger the render of the filepond instance and subsequently the
      // init callback below.
      this.uploading = true
    },
    photoProcessed(imageid, imagethumb) {
      // We have uploaded a photo.  Remove the filepond instance.
      this.uploading = false

      // Show the chat busy indicator.
      this.chatBusy = true

      // The imageid is in this.imageid
      this.imageid = imageid
      this.imagethumb = imagethumb
    }
  },
  head() {
    return this.buildHead(
      'ChitChat',
      'Chat to nearby freeglers...ask for advice, recommendations or just have a good old blether.'
    )
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.post__button {
  width: 40%;
}

.newsfeedHolder {
  height: calc(100vh - 74px);
}

.tab-content,
.tab-pane {
  background-color: $color-white;
}

.image__uploaded {
  width: 100px;
}
</style>
