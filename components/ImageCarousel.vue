<template>
  <div>
    <b-carousel
      v-if="attachments.length > 1"
      :id="'message-carousel-' + messageId"
      :interval="5000"
      controls
      indicators
      img-width="100%"
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
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

/* Override the internal classes in b-carousel */
::v-deep .carousel-control-prev-icon,
::v-deep .carousel-control-next-icon {
  height: 100px;
  width: 100px;
  outline: $color-black;
  background-size: 100%, 100%;
  border-radius: 50%;
  border: 1px solid $color-black;
  background-image: none;
  background-color: $color-white;
}

::v-deep .carousel-control-next-icon:after {
  content: '>';
  font-size: 55px;
  color: $color-red;
}

::v-deep .carousel-control-prev-icon:after {
  content: '<';
  font-size: 55px;
  color: $color-red;
}
</style>
