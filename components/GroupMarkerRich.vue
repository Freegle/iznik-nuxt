<template>
  <div>
    <group-profile-image :image="group.profile ? group.profile : '/icon.png'" :alt-text="'Profile picture for ' + group.namedisplay" size="sm" class="left" />
    <br>
    <h6 class="text-break text-center mt-1 p-2 bg-white text-success border border-success rounded thick">
      {{ group.namedisplay }}
    </h6>
  </div>
</template>

<script>
import GroupProfileImage from '~/components/GroupProfileImage'

export default {
  components: {
    GroupProfileImage
  },
  props: {
    group: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.thick {
  border: 2px solid $color-green--darker !important;
}

.left {
  margin-left: 70px;
}

h6 {
  width: 200px;
}
</style>
