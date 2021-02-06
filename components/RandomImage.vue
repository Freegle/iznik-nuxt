<template>
  <div class="d-flex">
    <div v-for="image in randomImages" :key="'image-' + image" alt="Random image">
      <b-img-lazy
        :src="image"
        thumbnail
        class="image"
        @error.native="brokenImage"
      />
    </div>
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  props: {
    images: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      timer: null,
      randomImages: []
    }
  },
  mounted() {
    this.timer = setTimeout(this.bumpIt, 5000)
    this.randomImages = this.images.slice(0, 10)
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  },
  methods: {
    bumpIt() {
      // Replace a random image with one of the unused ones.
      const unused = this.images.filter(
        i => this.randomImages.indexOf(i) === -1
      )
      const use = unused[Math.floor(Math.random() * unused.length)]
      Vue.set(this.randomImages, Math.floor(Math.random() * 10), use)

      setTimeout(this.bumpIt, 5000)
    },
    brokenImage(event) {
      event.target.src = require('~/static/placeholder.jpg')
    }
  }
}
</script>
<style scoped lang="scss">
.image {
  width: 10vw;
  height: 10vw;
  object-fit: cover;
}
</style>
