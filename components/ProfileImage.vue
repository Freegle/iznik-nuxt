<template>
  <b-img-lazy
    rounded="circle"
    :thumbnail="isThumbnail"
    class="p-0"
    :class="'profile--' + size"
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
    },
    size: {
      type: String,
      required: false,
      default: 'md'
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

.profile--sm {
  width: 15px;
  height: 15px;

  @include media-breakpoint-up(md) {
    width: 25px;
    height: 25px;
  }
}

.profile--md {
  width: 20px;
  height: 20px;

  @include media-breakpoint-up(md) {
    width: 35px;
    height: 35px;
  }
}

.profile--lg {
  width: 30px;
  height: 30px;

  @include media-breakpoint-up(sm) {
    width: 50px;
    height: 50px;
  }
}

.profile--xl {
  width: 50px;
  height: 50px;

  @include media-breakpoint-up(md) {
    width: 100px;
    height: 100px;
  }
}
</style>
