<template>
  <div>
    <b-card no-body>
      <b-card-body>
        <l-map
          ref="map"
          :zoom="14"
          :center="[noticeboard.lat, noticeboard.lng]"
          :style="'width: 100%; height: 200px'"
        >
          <l-tile-layer :url="osmtile" :attribution="attribution" />
          <l-marker :lat-lng="[noticeboard.lat, noticeboard.lng]" :interactive="false" />
        </l-map>
        <div v-if="noticeboard.description">
          <NoticeMessage class="mb-2">
            {{ noticeboard.description }}
          </NoticeMessage>
        </div>
        <h2>Keep spreading the word!</h2>
        <p>
          Can you help us by printing out and putting up another poster if there isn't one already?  Please let us know.
        </p>
        <div class="d-flex flex-wrap justify-content-between">
          <SpinButton
            name="check"
            variant="success"
            size="lg"
            :handler="putup"
            label="I put up a poster!"
            class="mb-2"
          />
          <b-btn variant="white" size="lg" to="/posters/A4.jpg" class="mb-2">
            <v-icon name="download" /> Download the poster
          </b-btn>
          <SpinButton
            name="times"
            variant="secondary"
            size="lg"
            :handler="shutup"
            label="Please ask someone else"
            class="mb-2"
          />
        </div>
        <b-form>
          <label for="noticeboard-comments">Comments</label>
          <p>Got new information about how to access this or where it is?</p>
          <b-textarea id="noticeboard-comments" v-model="comments" class="mt-2" placeholder="Please enter any new information or comments about this noticeboard." />
          <SpinButton variant="white" name="save" :handler="saveComments" label="Save comments" class="mt-2" />
        </b-form>
        <p class="mt-3">
          If this noticeboard is no longer active, please let us know:
        </p>
        <SpinButton variant="white" name="trash-alt" :handler="dead" label="Noticeboard no longer active" />
        <hr>
        <h2 class="mt-2">
          History
        </h2>
        <NoticeboardCheck v-for="check in noticeboard.checks" :key="'check-' + check.id" :noticeboard="noticeboard" :check="check" />
        <div v-if="added" class="d-flex justify-content-between">
          <div>
            {{ added }}
          </div>
          <div>
            Added
            <span v-if="noticeboard.addedby">
              by {{ noticeboard.addedby.displayname }}
            </span>
          </div>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
import map from '@/mixins/map.js'
import NoticeMessage from './NoticeMessage'
import SpinButton from './SpinButton'
import NoticeboardCheck from './NoticeboardCheck'

let L = null

if (process.browser) {
  L = require('leaflet')
}

export default {
  components: { NoticeboardCheck, SpinButton, NoticeMessage },
  mixins: [map],
  props: {
    noticeboard: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      comments: null
    }
  },
  computed: {
    icon() {
      return new L.Icon({
        iconUrl: '/mapmarker.gif'
      })
    },
    added() {
      return this.noticeboard
        ? this.$dayjs(this.noticeboard.added).format('Do MMMM, YYYY')
        : null
    }
  },
  methods: {
    async putup() {
      await this.$store.dispatch('noticeboards/refresh', {
        id: this.noticeboard.id
      })
    },
    async shutup() {
      await this.$store.dispatch('noticeboards/decline', {
        id: this.noticeboard.id
      })
    },
    async dead() {
      await this.$store.dispatch('noticeboards/inactive', {
        id: this.noticeboard.id
      })
    },
    async saveComments() {
      await this.$store.dispatch('noticeboards/comments', {
        id: this.noticeboard.id,
        comments: this.comments
      })
    }
  }
}
</script>
