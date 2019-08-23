<template>
  <b-col>
    <b-row class="m-0">
      <b-col cols="0" md="3">
        Community Events go here
      </b-col>
      <b-col cols="12" md="6" class="newsfeedHolder p-0">
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
                    <v-icon name="gift" />&nbsp;Give stuff
                  </b-btn>
                </nuxt-link>
              </b-col>
              <b-col cols="2" />
              <b-col cols="5">
                <nuxt-link to="/find">
                  <b-btn block variant="primary" class="float-right">
                    <v-icon name="search" />&nbsp;Find stuff
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
                    <v-icon name="pen" />&nbsp;ChitChat
                  </template>
                  <b-card-text>
                    <b-row>
                      <b-col>
                        <b-textarea v-model="startThread" v-focus rows="2" max-rows="8" placeholder="Chat to nearby freeglers...ask for advice, recommendations, or just have a good old blether.  If you're looking to give or find stuff, please use the OFFER/WANTED tabs.  Everything on here is public." />
                      </b-col>
                      <b-col v-if="imageid" md="auto">
                        <b-img lazy thumbnail :src="imagethumb" />
                      </b-col>
                    </b-row>
                  </b-card-text>
                </b-tab>
                <b-tab>
                  <template slot="title">
                    <v-icon name="gift" />&nbsp;OFFER
                  </template>
                  <b-card-text>TODO</b-card-text>
                </b-tab>
                <b-tab>
                  <template slot="title">
                    <v-icon name="search" />&nbsp;WANTED
                  </template>
                  <b-card-text>TODO</b-card-text>
                </b-tab>
                <b-tab>
                  <template slot="title">
                    <v-icon name="calendar-alt" />&nbsp;Event
                  </template>
                  <b-card-text>TODO</b-card-text>
                </b-tab>
                <b-tab>
                  <template slot="title">
                    <v-icon name="star" />&nbsp;Volunteer
                  </template>
                  <b-card-text>TODO</b-card-text>
                </b-tab>
              </b-tabs>
              <hr class="mt-1 mb-1">
              <b-row v-if="uploading" class="bg-white">
                <b-col class="p-0">
                  <file-pond
                    ref="pond"
                    name="photo"
                    allow-multiple="false"
                    accepted-file-types="image/jpeg, image/png, image/gif, image/jpg"
                    :files="myFiles"
                    image-resize-target-width="800"
                    image-resize-target-height="800"
                    image-crop-aspect-ratio="1"
                    label-idle="Drag & Drop photos or <span class=&quot;btn btn-white ction&quot;> Browse </span>"
                    :server="{ process, revert, restore, load, fetch }"
                    @init="photoInit"
                    @processfile="photoProcessed"
                  />
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="3" class="pl-4 text-muted">
                  <div v-if="me.settings.mylocation && me.settings.mylocation.area.name">
                    <v-icon name="map-marker-alt" />&nbsp;{{ me.settings.mylocation.area.name }}
                  </div>
                </b-col>
                <b-col cols="6">
                  <b-form-select v-model="selectedArea" :options="areaOptions" @change="areaChange" />
                </b-col>
                <b-col cols="3">
                  <b-row>
                    <b-col>
                      <div class="float-right pb-1 pr-1">
                        <b-btn variant="primary" @click="photoAdd">
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
            <span slot="no-more" />
            <span slot="spinner">
              <b-img-lazy src="~/static/loader.gif" />
            </span>
          </infinite-loading>
        </div>
      </b-col>
      <b-col cols="0" md="3">
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
import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import NewsThread from '~/components/NewsThread.vue'
import twem from '~/assets/js/twem'

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginImageTransform
)

export default {
  middleware: 'auth',

  components: {
    NewsThread,
    FilePond
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
      infiniteId: +new Date(),
      uploading: false,
      myFiles: [],
      imageid: null,
      imagethumb: null
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
    this.id = this.$route.params.id
  },

  mounted() {
    // We want this to be our next home page.
    try {
      localStorage.setItem('Iznik>lasthomepage', 'news')
    } catch (e) {
      console.error('Save last route failed', e)
    }
  },

  methods: {
    async loadMore($state) {
      this.busy = true

      if (!this.$store.$auth.loggedIn) {
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
      this.newsfeed = null
    },
    async postIt() {
      let msg = this.startThread

      // Encode up any emojis.
      msg = twem.untwem(msg)

      await this.$store.dispatch('newsfeed/send', {
        message: msg,
        imageid: this.imageid
      })

      // Show the new message
      this.newsfeed = this.$store.getters['newsfeed/newsfeed']()

      // Clear the textarea now it's sent.
      this.startThread = null

      // And any image id
      this.imageid = null
    },
    photoAdd() {
      // Flag that we're uploading.  This will trigger the render of the filepond instance and subsequently the
      // init callback below.
      this.uploading = true
    },
    photoInit: function() {
      // We have rendered the filepond instance.  Trigger browse so that they can upload a photo without an
      // extra click.
      this.$refs.pond.browse()
    },
    photoProcessed(error, file) {
      // We have uploaded a photo.  Remove the filepond instance.
      this.uploading = false

      // Show the chat busy indicator.
      this.chatBusy = true

      // The imageid is in this.imageid
      if (error) {
        // TODO
      }
    },
    async process(fieldName, file, metadata, load, error, progress, abort) {
      const data = new FormData()
      data.append('photo', file, 'photo')
      data.append('newsfeed', true)
      data.append('imgtype', 'Newsfeed')

      const ret = await this.$axios.post(process.env.API + '/image', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUpLoadProgress: e => {
          progress(e.lengthComputable, e.loaded, e.total)
        }
      })

      if (ret.status === 200 && ret.data.ret === 0) {
        this.imageid = ret.data.id
        this.imagethumb = ret.data.paththumb
        load(ret.data.id)
      } else {
        error(
          ret.status === 200 ? ret.data.status : 'Network error ' + ret.status
        )
      }

      return {
        abort: () => {
          // We don't need to do anything - the server will tidy up hanging images.
          abort()
        }
      }
    },
    load(uniqueFileId, load, error) {},
    fetch(url, load, error, progress, abort, headers) {},
    restore(uniqueFileId, load, error, progress, abort, headers) {},
    revert(uniqueFileId, load, error) {}
  }
}
</script>
