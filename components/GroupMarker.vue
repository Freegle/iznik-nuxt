<template>
  <div>
    <RichMarker ref="rich" :key="size" :position="{ lat: group.lat, lng: group.lng }">
      <b-img v-if="size ==='poor'" src="/mapmarker.gif" />
      <b-card v-if="size === 'rich'" variant="white" class="p-0" style="width:140px">
        <b-card-body class="text-center p-0">
          <b-img
            thumbnail
            :alt="'Profile picture for ' + group.namedisplay"
            :src="group.profile ? group.profile : '/icon.png'"
            class="groupprofile"
            @error.native="brokenImage"
          />
          <br>
          <h5 class="text-break mt-1">
            {{ group.namedisplay }}
          </h5>
        </b-card-body>
      </b-card>
    </RichMarker>
  </div>
</template>
<style scoped>
.groupprofile {
  object-fit: cover;
  width: 100px;
  height: 100px;
}
</style>
<script>
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
    }
  }
}
</script>
