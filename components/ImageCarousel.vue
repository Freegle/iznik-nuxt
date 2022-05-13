<template>
  <div>
    <b-carousel
      :id="'message-carousel-' + messageId"
      indicators
      img-width="100%"
      :interval="0"
      no-touch
      :controls="attachments.length > 1"
    >
      <b-carousel-slide
        v-for="(attachment,index) in attachments"
        :key="'mesagephohoto-' + attachment.id"
      >
        <client-only>
          <image-zoom click-zoom :regular="attachment.path" :alt="'Message photo ' + index" img-class="img-fluid w-100 messagePhoto" close-pos="top-center" />
        </client-only>
      </b-carousel-slide>
    </b-carousel>
  </div>
</template>
<script>
import { CarouselPlugin } from 'bootstrap-vue'
import Vue from 'vue'
const imageZoom = () => import('vue-image-zoomer')

Vue.use(CarouselPlugin)

export default {
  name: 'ImageCarousel',
  components: { imageZoom },
  props: {
    messageId: {
      type: String,
      required: true
    },
    attachments: {
      type: Array,
      required: true
    }
  }
}
</script>
<style scoped lang="scss">
/deep/ .carousel-caption {
  position: unset !important;
}

/deep/ :not(.vh--none) .messagePhoto {
  max-height: calc(100vh - 150px) !important;
  object-fit: cover;
}

/deep/ .width {
  width: 100% !important;

  div:not(.vh--message-bottom) {
    width: 100% !important;
  }
}
</style>
