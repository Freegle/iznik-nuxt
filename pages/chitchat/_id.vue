<template>
  <b-container v-if="me" fluid>
    <b-row class="m-0">
      <b-col cols="0" lg="3" class="p-0 pr-1">
        <Visible :at="['lg', 'xl']">
          <SidebarLeft :show-community-events="true" :show-bot-left="true" />
        </Visible>
      </b-col>
      <b-col cols="12" lg="6" class="newsfeedHolder p-0">
        <AppUpdateAvailable />
        <GlobalWarning />
        <ExpectedRepliesWarning v-if="me && me.expectedreplies" :count="me.expectedreplies" :chats="me.expectedchats" />
        <b-card v-if="!id" body-class="p-2 p-md-4">
          <b-card-text>
            <h5 class="text-center mb-3 d-block d-md-none">
              <span class="d-none d-sm-inline">Looking for your posts?  Click</span>
              <span class="d-inline d-sm-none">Your posts are</span>
              <!-- eslint-disable-next-line -->
              <nuxt-link to="/myposts">here</nuxt-link>.
            </h5>
            <h5 class="text-center mb-3 d-block d-md-none">
              Browse OFFERs/WANTEDs
              <!-- eslint-disable-next-line -->
              <nuxt-link to="/browse">here</nuxt-link>.
            </h5>
            <div class="d-flex justify-content-between">
              <b-btn id="givebutton" ref="givebutton" to="/give" variant="primary" class="post__button">
                Give stuff
              </b-btn>
              <b-btn id="findbutton" ref="findbutton" to="/find" variant="secondary" class="post__button">
                Ask for stuff
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
            <b-card-text class="p-2 pb-0 mb-0">
              <label class="font-weight-bold" for="startThread">Chat to nearby freeglers! <span class="d-none d-sm-inline">Ask for advice, recommendations, or just have a natter:</span></label>
              <b-textarea id="startThread"
                          v-model="startThread"
                          rows="2"
                          max-rows="8"
                          placeholder="What's going on in your world?"
                          class="border border-primary" />
              <div class="small text-muted">
                Everything here is public.  Be kind <span class="d-none d-sm-inline">to each other</span>; occasionally we may moderate to ensure things stay friendly.
              </div>
              <b-img v-if="imageid" lazy thumbnail :src="imagethumb" class="image__uploaded" />
            </b-card-text>
            <hr class="mt-1 mb-1">
            <OurFilePond v-if="uploading"
                         class="bg-white m-0 pondrow"
                         imgtype="Newsfeed"
                         imgflag="newsfeed"
                         @photoProcessed="photoProcessed" />
            <div class="pb-1 d-flex justify-content-end">
              <b-btn variant="secondary" class="mr-2" @click="photoAdd">
                Add photo
              </b-btn>
              <b-btn variant="primary" class="mr-2" @click="postIt">
                Post it!
              </b-btn>
            </div>
          </b-card>
        </div>
        <NewsLocation v-if="!id" class="p-2" @changed="areaChange" />
        <NoticeMessage v-if="id && newsfeed && newsfeed.length && !newsfeed[0].visible" class="mt-2">
          Sorry, this thread isn't around any more.
        </NoticeMessage>
        <div class=" p-0 pt-1 mb-1">
          <ul v-for="entry in newsfeed" :key="'newsfeed-' + entry.id + '-area-' + selectedArea" class="list-unstyled">
            <li v-if="entry && entry.visible && !entry.unfollowed && entry.threadhead === entry.id">
              <NewsThread :id="entry.id" :key="'newsthread-' + entry.id" :users="users" :scroll-to="scrollTo" />
            </li>
          </ul>
          <client-only>
            <infinite-loading :identifier="infiniteId" force-use-infinite-wrapper="body" :distance="distance" @infinite="loadMore">
              <span slot="no-results" />
              <span slot="no-more" />
              <span slot="spinner">
                <b-img-lazy src="~/static/loader.gif" alt="Loading" />
              </span>
            </infinite-loading>
          </client-only>
        </div>
      </b-col>
      <b-col cols="0" lg="3" class="p-0 pl-1">
        <Visible :at="['lg', 'xl']">
          <sidebar-right show-volunteer-opportunities show-job-opportunities />
        </Visible>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import { TooltipPlugin } from 'bootstrap-vue'
import Vue from 'vue'
import loginRequired from '@/mixins/loginRequired.js'
import buildHead from '@/mixins/buildHead'
import NoticeMessage from '../../components/NoticeMessage'
import AppUpdateAvailable from '~/components/AppUpdateAvailable.vue'
import GlobalWarning from '../../components/GlobalWarning'
import Visible from '../../components/Visible'
import twem from '~/assets/js/twem'
import NewsThread from '~/components/NewsThread.vue'

Vue.use(TooltipPlugin)

const OurFilePond = () => import('~/components/OurFilePond')
const SidebarLeft = () => import('~/components/SidebarLeft')
const SidebarRight = () => import('~/components/SidebarRight')
const NewsLocation = () => import('~/components/NewsLocation')
const ExpectedRepliesWarning = () =>
  import('~/components/ExpectedRepliesWarning')

export default {
  components: {
    Visible,
    AppUpdateAvailable,
    GlobalWarning,
    ExpectedRepliesWarning,
    NoticeMessage,
    InfiniteLoading,
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
    const existingHomepage = this.$store.getters['misc/get']('lasthomepage')

    if (existingHomepage !== 'news') {
      this.$store.dispatch('misc/set', {
        key: 'lasthomepage',
        value: 'news'
      })
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
      this.scrollTo = this.id

      if (!this.me) {
        if ($state.complete) {
          $state.complete()
        }
      } else {
        try {
          const context = this.$store.getters['newsfeed/getContext']
          const visited = []

          if (this.id) {
            // Just one - fetch it by id.
            let id = this.id
            let item
            let maxdepth = 100

            do {
              maxdepth--

              if (maxdepth <= 0) {
                // Fallback to ensure no infinite loop in case of weird thread structure.  We're only supposed to allow
                // replies and replies to replies, but we've had at least one but resulting in deeper nesting than that.
                // Better to display any such threads as well as fix any bugs that create them.
                break
              }

              // await this.$store.dispatch('newsfeed/clearFeed')
              await this.$store.dispatch('newsfeed/fetch', {
                id: id
              })

              item = this.$store.getters['newsfeed/get'](id)

              if (!item) {
                console.error('Failed to get newsfeed', id)
                break
              } else {
                const headid = parseInt(item.threadhead)

                if (id === headid || visited.indexOf(headid) !== -1) {
                  break
                } else {
                  visited.push(headid)
                  id = headid
                }
              }
            } while (true)

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
        msg = twem.untwem(this.$twemoji, msg)

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

      // The imageid is in this.imageid
      this.imageid = imageid
      this.imagethumb = imagethumb
    }
  },
  head() {
    return this.buildHead(
      'ChitChat',
      'Chat to nearby freeglers...ask for advice, recommendations or just have a good old natter.'
    )
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.post__button {
  @include media-breakpoint-up(sm) {
    width: 40%;
  }
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
