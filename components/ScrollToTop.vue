<template>
  <div class="pos">
    <b-btn v-if="scrollY > 50" variant="secondary" @click="scrollToTop">
      <v-icon name="caret-up" />
      <span class="d-none d-md-inline">
        {{ prepend }}
        Top
      </span>
    </b-btn>
  </div>
</template>
<script>
export default {
  props: {
    prepend: {
      type: String,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      scrollY: 0
    }
  },
  mounted() {
    if (process.client) {
      window.addEventListener('scroll', this.handleScroll)
    }
  },
  beforeDestroy() {
    if (process.client) {
      window.removeEventListener('scroll', this.handleScroll)
      this.scrollY = 0
    }
  },
  methods: {
    handleScroll(e) {
      this.scrollY = window.scrollY
    },
    scrollToTop() {
      window.scrollTo(0, 0)
    }
  }
}
</script>
<style>
.pos {
  position: fixed;
  top: 90px;
  right: 25px;
  z-index: 1000;
}
</style>
