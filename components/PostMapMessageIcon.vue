<template>
  <div class="zztop">
    <b-img
      v-if="size === 'sm'"
      :src="pin"
      :title="message.subject"
    />
    <b-img
      v-else-if="size === 'md'"
      :src="postImage"
      :title="message.subject"
      lazy
      rounded
      thumbnail
      :class="{
        square: true,
        shadow: true,
        faded: !attachment
      }"
    />
    <b-card
      v-else-if="size === 'lg'"
      variant="white"
      class="text-enter cardsize"
      :img-src="attachment"
      img-alt="Post image"
      img-bottom
      body-class="p-2 shadow-lg"
    >
      <b-card-title>
        <span class="small">{{ message.subject }}</span>
      </b-card-title>
      <b-card-sub-title v-if="group">
        {{ group.namedisplay }}
      </b-card-sub-title>
      <b-card-body class="text-center pb-1 pt-2">
        <b-button variant="white" class="mt-1">
          See details and reply <v-icon name="angle-double-right" />
        </b-button>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
import pin from '~/static/mapmarker.gif'

export default {
  props: {
    message: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      required: true
    }
  },
  computed: {
    pin() {
      // By inlining the image, we avoid fetching it over and over, which seems to happen otherwise.
      return pin
    },
    attachment() {
      if (
        this.message &&
        this.message.attachments &&
        this.message.attachments.length
      ) {
        return this.message.attachments[0].paththumb
      } else {
        return null
      }
    },
    postImage() {
      return this.attachment ? this.attachment : '/user_logo_vector.svg'
    },
    group() {
      return this.message && this.message.groups && this.message.groups.length
        ? this.message.groups[0]
        : null
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.cardsize {
  max-width: 300px;
  max-height: 300px;
}

.square {
  object-fit: cover;
  width: 100px;
  height: 100px;
}

.faded {
  opacity: 0.5;
}

.shadow {
  box-shadow: 0 0rem 2rem $color-blue--2 !important;
}

.zztop {
  z-index: 10000;
}

::v-deep .card-img-bottom {
  object-fit: cover;
  width: 300px;
  min-height: 300px;
  max-height: 300px;
}
</style>
