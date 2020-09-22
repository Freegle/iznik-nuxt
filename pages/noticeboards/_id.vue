<template>
  <div>
    <b-row class="m-0">
      <b-col cols="0" md="3" class="d-none d-md-block" />
      <b-col cols="12" md="6" class="p-0">
        <div>
          <div v-if="id" class="bg-white">
            <div v-if="noticeboard">
              <h1 class="text-center">
                {{ noticeboard.name }}
              </h1>
              <NoticeboardDetails :noticeboard="noticeboard" />
            </div>
          </div>
          <div v-else>
            <h1>Noticeboards</h1>
            <p>
              Here's where people have put up posters.  <b>Knowing where these are really helps us</b>, because we can
              ask other freeglers to keep them up to date.
            </p>
            <p>
              So please put up posters - and let us know where you put them.
            </p>
            <div class="d-flex justify-content-between">
              <a href="https://freegle.in/A4Poster" target="_blank">
                <b-btn variant="primary" size="lg">
                  Download poster
                </b-btn>
              </a>
              <b-btn variant="secondary" size="lg" class="float-right" @click="added">
                I put up a poster!
              </b-btn>
            </div>
            <div ref="mapcont" class="mt-4">
              <client-only>
                <l-map
                  ref="map"
                  :zoom="5"
                  :center="center"
                  :style="'width: ' + mapWidth + '; height: ' + mapWidth + 'px'"
                  :min-zoom="5"
                  :max-zoom="17"
                >
                  <l-tile-layer :url="osmtile" :attribution="attribution" />
                  <NoticeboardMarker v-for="n in noticeboards" :key="'marker-' + n.id" :noticeboard="n" />
                </l-map>
              </client-only>
            </div>
          </div>
        </div>
      </b-col>
      <b-col cols="0" md="3" class="d-none d-md-block" />
    </b-row>
    <PosterModal ref="modal" />
  </div>
</template>
<style scoped>
</style>
<script>
import { gmapApi } from 'vue2-google-maps'
import NoticeboardDetails from '../../components/NoticeboardDetails'
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
import map from '@/mixins/map.js'

const NoticeboardMarker = () => import('~/components/NoticeboardMarker')
const PosterModal = () => import('~/components/PosterModal')

export default {
  components: {
    NoticeboardDetails,
    NoticeboardMarker,
    PosterModal
  },
  mixins: [loginOptional, buildHead, map],
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
    google: {
      get() {
        return process.browser ? gmapApi : []
      }
    },
    noticeboard() {
      return this.id ? this.$store.getters['noticeboards/get'](this.id) : null
    },
    noticeboards() {
      return this.$store.getters['noticeboards/list']
    },
    mapHeight() {
      const contWidth = this.$refs.mapcont ? this.$refs.mapcont.$el.width : 0

      return contWidth
    },
    mapWidth() {
      let height = 0

      if (process.browser) {
        height = Math.floor(window.innerHeight / 2)
        height = height < 200 ? 200 : height
      }

      return height
    }
  },
  created() {
    this.id = this.$route.params.id
  },
  async mounted() {
    await this.$store.dispatch('noticeboards/clear')
    await this.$store.dispatch('noticeboards/fetch', {
      id: this.id
    })
  },
  methods: {
    added() {
      this.$refs.modal.show()
    }
  },
  head() {
    if (!this.id || !this.noticeboards || !this.noticeboards.length) {
      return this.buildHead(
        'Noticeboards',
        "We're building a map of noticeboards across the UK and putting Freegle posters on them.  Help us!"
      )
    } else {
      return this.buildHead(
        'Noticeboard: ' + this.noticeboards[0].name,
        this.noticeboards[0].description
      )
    }
  }
}
</script>
