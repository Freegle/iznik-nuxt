<template>
  <div @click="rotateIt">
    <b-img-lazy :src="photo.path" fluid :class="rotatingClass" />
  </div>
</template>
<script>
export default {
  props: {
    photo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      rotate: 0
    }
  },
  computed: {
    rotatingClass() {
      return 'square clickme rotate' + this.rotate
    }
  },
  created() {
    this.rotate = this.photo.rotate
  },
  methods: {
    rotateIt() {
      this.rotate += 90

      if (this.rotate > 270) {
        this.rotate = 0
      }

      this.$emit('rotate', this.rotate)
    }
  }
}
</script>
<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.square {
  object-fit: cover;
  margin: auto;
  width: 80px;
  height: 80px;

  @include media-breakpoint-up(md) {
    width: 120px;
    height: 120px;
  }
  @include media-breakpoint-up(lg) {
    width: 150px;
    height: 150px;
  }
}

.rotate90 {
  transform: rotate(90deg);
  -ms-transform: rotate(90deg); /* IE 9 */
  -moz-transform: rotate(90deg); /* Firefox */
  -webkit-transform: rotate(90deg); /* Safari and Chrome */
  -o-transform: rotate(90deg); /* Opera */
}

.rotate180 {
  transform: rotate(180deg);
  -ms-transform: rotate(180deg); /* IE 9 */
  -moz-transform: rotate(180deg); /* Firefox */
  -webkit-transform: rotate(180deg); /* Safari and Chrome */
  -o-transform: rotate(180deg); /* Opera */
}

.rotate270 {
  transform: rotate(270deg);
  -ms-transform: rotate(270deg); /* IE 9 */
  -moz-transform: rotate(270deg); /* Firefox */
  -webkit-transform: rotate(270deg); /* Safari and Chrome */
  -o-transform: rotate(270deg); /* Opera */
}
</style>
