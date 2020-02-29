<template>
  <span class="ProfileImage__container">
    <b-img-lazy
      rounded="circle"
      :thumbnail="isThumbnail"
      class="p-0"
      :class="'profile--' + size"
      :alt="altText"
      :src="validImage"
      @error.native="brokenProfileImage"
    />
    <v-icon v-if="isModerator" name="leaf" class="ProfileImage__moderator mb-0" :class="'ProfileImage__moderator--' + size" />
  </span>
</template>

<script>
// This component should be imported, rather than using async require.  This is because async requires result in more
// Vue DOM patching overall, and this component is used in places like chat where it appears many times.  Testing shows
// this has a significant performance benefit.
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
    isModerator: {
      type: Boolean,
      required: false
    },
    size: {
      type: String,
      required: false,
      default: 'md'
    }
  },
  computed: {
    validImage() {
      return this.image || '/static/defaultprofile.png'
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
@import 'color-vars';
@import 'bootstrap/scss/_functions';
@import 'bootstrap/scss/_variables';
@import 'bootstrap/scss/mixins/_breakpoints';

.profile--sm {
  width: 20px;
  height: 20px;

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
  width: 75px;
  height: 75px;

  @include media-breakpoint-up(md) {
    width: 100px;
    height: 100px;
  }
}

.ProfileImage__container {
  position: relative;
  padding-right: 5px;
  padding-bottom: 3px;
}

.ProfileImage__moderator {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: $color-white;
  border-radius: 50%;
  color: $colour-success;
}

.ProfileImage__moderator--sm {
  padding: 2px;
  width: 12px;
  height: 12px;

  @include media-breakpoint-up(md) {
    padding: 3px;
    width: 16px;
    height: 16px;
  }
}

.ProfileImage__moderator--md {
  padding: 2px;
  width: 16px;
  height: 16px;

  @include media-breakpoint-up(md) {
    padding: 3px;
    width: 20px;
    height: 20px;
  }
}

.ProfileImage__moderator--lg {
  padding: 2px;
  width: 18px;
  height: 18px;

  @include media-breakpoint-up(md) {
    padding: 3px;
    width: 24px;
    height: 24px;
  }
}

.ProfileImage__moderator--xl {
  padding: 2px;
  width: 24px;
  height: 24px;

  @include media-breakpoint-up(md) {
    padding: 3px;
    width: 36px;
    height: 36px;
  }
}
</style>
