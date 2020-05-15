<template>
  <div :title="modtoshow.displayname" @click="showInfo">
    <ProfileImage
      :image="modtoshow.profile.url"
      is-thumbnail
      size="md"
      :alt-text="modtoshow.displayname"
      large
      border
      class="clickme"
    />
    <ProfileModal v-if="showModal" :id="modtoshow.id" ref="profilemodal" />
  </div>
</template>
<script>
import ProfileImage from './ProfileImage'
import ProfileModal from './ProfileModal'
export default {
  components: { ProfileModal, ProfileImage },
  props: {
    modtoshow: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      showModal: false
    }
  },
  methods: {
    showInfo() {
      // We use v-if so that the profile modal is not inserted into the DOM until we have clicked, which saves the
      // fetch of the user info.
      this.showModal = true
      this.$nextTick(() => {
        this.$refs.profilemodal.show()
      })
    }
  }
}
</script>
