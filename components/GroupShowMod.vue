gr<template>
  <div :title="modtoshow.displayname">
    <ProfileImage
      :image="modtoshow.profile.url"
      is-thumbnail
      size="md"
      :alt-text="modtoshow.displayname"
      large
      border
    />
  </div>
</template>
<script>
import ProfileImage from './ProfileImage'

export default {
  components: { ProfileImage },
  props: {
    modtoshow: {
      type: Object,
      required: true
    }
  }
}
</script>
