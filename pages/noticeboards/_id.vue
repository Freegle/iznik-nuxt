<template>
  <div>
    <b-row class="m-0">
      <b-col cols="0" md="3" class="d-none d-md-block" />
      <b-col cols="12" md="6" class="p-0">
        <div>
          <h1>Noticeboards</h1>
          <p>
            Here's where people have put up posters.  <b>Knowing where these are really helps us</b>, because we can
            ask other freeglers to keep them up to date.
          </p>
          <p>
            So please put up posters - and let us know where you put them.
          </p>
          <b-row>
            <b-col>
              <a href="https://freegle.in/A4Poster" target="_blank" class="float-left">
                <b-btn variant="success" size="lg">
                  Download poster
                </b-btn>
              </a>
              <b-btn variant="info" size="lg" class="float-right" @click="added">
                I put up a poster!
              </b-btn>
            </b-col>
          </b-row>
          <b-row class="m-0">
            <b-col ref="mapcont" class="mt-4 p-0">
              <client-only>
                <GmapMap
                  ref="gmap"
                  :center="{lat:53.9450, lng:-2.5209}"
                  :zoom="5"
                  :style="'width: ' + mapWidth + '; height: ' + mapWidth + 'px'"
                  :options="{
                    zoomControl: true,
                    mapTypeControl: false,
                    scaleControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: true,
                    disableDefaultUi: false,
                    gestureHandling: 'greedy'
                  }"
                >
                  <div v-for="noticeboard in noticeboards" :key="'marker-' + noticeboard.id + '-' + noticeboards.length">
                    <GmapMarker
                      :position="google && new google.maps.LatLng(noticeboard.lat, noticeboard.lng)"
                      :clickable="false"
                      :draggable="false"
                      icon="/mapmarker.gif"
                    />
                  </div>
                </GmapMap>
              </client-only>
            </b-col>
          </b-row>
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
import loginOptional from '@/mixins/loginOptional.js'
const PosterModal = () => import('~/components/PosterModal')

export default {
  components: {
    PosterModal
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
    google: gmapApi,
    noticeboards() {
      return this.$store.getters['noticeboards/list']
    },
    mapHeight() {
      const contWidth = this.$refs.mapcont ? this.$refs.mapcont.$el.width : 0

      return contWidth
    },
    mapWidth() {
      let height = Math.floor(window.innerHeight / 2)
      height = height < 200 ? 200 : height
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
  }
}
</script>
