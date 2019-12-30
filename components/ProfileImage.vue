<template>
  <b-img-lazy
    rounded="circle"
    :thumbnail="isThumbnail"
    class="p-0"
    :alt="altText"
    title="Profile"
    :src="image"
    @error.native="brokenProfileImage"
  />
</template>

<script>
export default {
  name: 'ProfileImage',
  props: {
    image: {
      type: String,
      required: false,
      default: ''
    },
    altText: {
      type: String,
      required: false,
      default: 'Profile picture'
    },
    isThumbnail: {
      type: Boolean,
      required: false
    }
  },
  methods: {
    brokenProfileImage(event) {
      event.target.src = '/static/defaultprofile.png'
    }
  }
}
</script>

<style scoped lang="scss">
@import 'bootstrap/scss/_functions';
@import 'bootstrap/scss/_variables';
@import 'bootstrap/scss/mixins/_breakpoints';

.profile {
  width: 30px !important;
  height: 30px !important;
}

@include media-breakpoint-up(sm) {
  .profile {
    width: 50px !important;
    height: 50px !important;
  }
}

.profilemd {
  width: 20px !important;
  height: 20px !important;
}

@include media-breakpoint-up(md) {
  .profilemd {
    width: 35px !important;
    height: 35px !important;
  }
}

.profilesm {
  width: 15px !important;
  height: 15px !important;
}

@include media-breakpoint-up(md) {
  .profilesm {
    width: 25px !important;
    height: 25px !important;
  }
}
</style>
