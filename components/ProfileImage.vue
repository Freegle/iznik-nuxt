<template>
  <span class="ProfileImage__container">
    <b-img-lazy
      v-if="lazy"
      rounded="circle"
      :thumbnail="isThumbnail"
      :class="className"
      :alt="altText"
      :src="validImage"
      @error.native="brokenProfileImage"
    />
    <b-img
      v-if="!lazy"
      rounded="circle"
      :thumbnail="isThumbnail"
      :class="className"
      :alt="altText"
      :src="validImage"
      @error="brokenProfileImage"
    />
    <v-icon v-if="isModerator" name="leaf" :class="'ProfileImage__moderator ProfileImage__moderator--' + size" />
    <b-badge v-if="badge !== null" variant="danger" :class="'ProfileImage__moderator ProfileImage__moderator--' + size">
      {{ badge }}
    </b-badge>
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
    },
    border: {
      type: Boolean,
      required: false
    },
    lazy: {
      type: Boolean,
      required: false,
      default: true
    },
    badge: {
      type: Number,
      required: false,
      default: null
    }
  },
  computed: {
    validImage() {
      return this.image || require('~/static/defaultprofile.png')
    },
    className() {
      let ret = 'p-0 profile profile--' + this.size

      if (this.border) {
        ret += ' ourBorder'
      }

      return ret
    }
  },
  methods: {
    brokenProfileImage(event) {
      event.target.src = require('~/static/defaultprofile.png')
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';
@import 'bootstrap/scss/_functions';
@import 'bootstrap/scss/_variables';
@import 'bootstrap/scss/mixins/_breakpoints';

.profile {
  object-fit: cover;
}

.profile--sm {
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;

  @include media-breakpoint-up(md) {
    width: 25px;
    height: 25px;
    min-width: 25px;
    min-height: 25px;
  }
}

.profile--md {
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;

  @include media-breakpoint-up(md) {
    width: 35px;
    height: 35px;
    min-width: 35px;
    min-height: 35px;
  }
}

.profile--lg {
  width: 30px;
  height: 30px;
  min-width: 30px;
  min-height: 30px;

  @include media-breakpoint-up(sm) {
    width: 50px;
    height: 50px;
    min-width: 50px;
    min-height: 50px;
  }
}

.profile--lg-always {
  width: 50px;
  height: 50px;
  min-width: 50px;
  min-height: 50px;
}

.profile--xl {
  width: 75px;
  height: 75px;
  min-width: 75px;
  min-height: 75px;

  @include media-breakpoint-up(md) {
    width: 100px;
    height: 100px;
    min-width: 100px;
    min-height: 100px;
  }
}

.ProfileImage__container {
  position: relative;
  padding-right: 5px;
}

.ProfileImage__moderator {
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 50%;

  :not(.badge) {
    background-color: $color-white;
    color: $colour-success;
  }
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

.ProfileImage__moderator--xxl {
  padding: 2px;
  width: 24px;
  height: 24px;

  @include media-breakpoint-up(md) {
    padding: 3px;
    width: 36px;
    height: 36px;
  }
}

.ourBorder {
  border: 2px solid $color-gray--dark;
  background-color: $color-gray--dark;
}
</style>
