<template>
  <div>
    <b-carousel
      v-if="attachments.length > 1"
      :id="'message-carousel-' + messageId"
      :interval="5000"
      controls
      indicators
      img-width="100%"
      no-animation
    >
      <b-carousel-slide v-for="(attachment,index) in attachments" :key="'mesagephohoto-' + attachment.id">
        <b-img
          slot="img"
          center
          class="d-block img-fluid w-100 messagePhoto"
          :src="attachment.path"
          :alt="'Message photo ' + index"
        />
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
Vue.use(CarouselPlugin)

export default {
  name: 'ImageCarousel',
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
