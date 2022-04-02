<template>
  <div>
    <b-carousel
      v-if="attachments.length > 1"
      :id="'message-carousel-' + messageId"
      controls
      indicators
      img-width="100%"
      :interval="0"
      no-touch
    >
      <b-carousel-slide v-for="(attachment,index) in attachments" :key="'mesagephohoto-' + attachment.id">
        <client-only>
          <image-zoom click-zoom :regular="attachment.path" :alt="'Message photo ' + index" img-class="img-fluid w-100 messagePhoto" close-pos="top-center" />
        </client-only>
      </b-carousel-slide>
    </b-carousel>
    <div v-else>
      <b-img
        slot="img"
        center
        class="d-block img-fluid w-100 messagePhoto"
        :src="attachments[0].path"
        :alt="'Message photo'"
      />
    </div>
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

/deep/ .carousel-control-prev-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2380808' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E") !important;
}

/deep/ .carousel-control-next-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2380808' viewBox='0 0 8 8'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E") !important;
}
</style>
