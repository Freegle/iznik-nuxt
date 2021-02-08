<template>
  <div class="d-flex">
    <div v-for="image in randomImages" :key="'image-' + image">
      <b-img-lazy
        v-if="image"
        :src="image"
        thumbnail
        class="image fade-in"
        generator-unable-to-provide-required-alt=""
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

.fade-in {
  animation: fadeIn linear 1.5s;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
