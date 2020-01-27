<template>
  <div>
    <RichMarker ref="rich" :key="size" :position="{ lat: group.lat, lng: group.lng }">
      <div @click="goto">
        <b-img v-if="size ==='poor'" src="/mapmarker.gif" />
        <div v-if="size === 'rich'" class="text-center">
          <group-profile-image :image="group.profile ? group.profile : '/icon.png'" />
          <br>
          <h5 class="text-break mt-1 p-2 bg-white text-success border border-success rounded thick">
            {{ group.namedisplay }}
          </h5>
        </div>
      </div>
    </RichMarker>
  </div>
</template>

<script>
import RichMarker from './RichMarker.vue'
import GroupProfileImage from '~/components/GroupProfileImage'

export default {
  components: {
    RichMarker,
    GroupProfileImage
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
  beforeDestroy() {
    // We have to remove the marker from the map otherwise we get screen trozzle.
    this.$refs.rich.getMarker().setMap(null)
  },
  methods: {
    goto() {
      this.$router.push('/explore/' + this.group.nameshort)
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.thick {
  border: 2px solid $color-green--darker !important;
}
</style>
