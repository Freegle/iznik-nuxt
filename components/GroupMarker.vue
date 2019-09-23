<template>
  <div>
    <RichMarker ref="rich" :key="size" :position="{ lat: group.lat, lng: group.lng }">
      <div @click="goto">
        <b-img v-if="size ==='poor'" src="/mapmarker.gif" />
        <div v-if="size === 'rich'" class="text-center">
          <b-img
            thumbnail
            :alt="'Profile picture for ' + group.namedisplay"
            :src="group.profile ? group.profile : '/icon.png'"
            class="groupprofile"
            @error.native="brokenImage"
          />
          <br>
          <h5 class="text-break mt-1 p-2 bg-white text-success border border-success rounded thick">
            {{ group.namedisplay }}
          </h5>
        </div>
      </div>
    </RichMarker>
  </div>
</template>
<style scoped>
.groupprofile {
  object-fit: cover;
  width: 100px;
  height: 100px;
}

.thick {
  border: 2px solid darkgreen !important;
}
</style>
<script>
// TODO DESIGN This page is a clutter and needs love.
import { gmapApi } from 'vue2-google-maps'
import RichMarker from './RichMarker.vue'

export default {
  components: {
    RichMarker
  },
  props: {
    group: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      required: true
    }
  },
  computed: {
    google: gmapApi
  },
  beforeDestroy() {
    // We have to remove the marker from the map otherwise we get screen trozzle.
    this.$refs.rich.getMarker().setMap(null)
  },
  methods: {
    brokenImage(event) {
      console.error('Broken profile image', event.target.src)
      event.target.src = '/static/defaultprofile.png'
    },
    goto() {
      console.log('Goto', this.group)
      this.$router.push('/explore/' + this.group.nameshort)
    }
  }
}
</script>
