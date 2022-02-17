<template>
  <div>
    <b-carousel
      v-if="attachments.length > 1"
      :id="'message-carousel-' + messageId"
      :interval="interval"
      controls
      indicators
      img-width="100%"
    >
      <div class="pause clickme" @click="pause">
        <div v-if="interval">
          <v-icon name="pause" title="Pause on this photo" scale="2.5" />
        </div>
        <div v-else>
          <v-icon name="play" title="Resume auto-scrolling" scale="2.5" />
        </div>
      </div>
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
  },
  data: function() {
    return {
      interval: 5000
    }
  },
  methods: {
    pause() {
      this.interval = this.interval ? 0 : 5000
    }
  }
}
</script>
<style scoped lang="scss">
.pause {
  position: absolute;
  left: 50%;
  margin-top: 10px;
  color: white;
  z-index: 10000;
  opacity: 0.5;
}
</style>
