<template>
  <div class="observer" />
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    observer: null
  }),
  mounted() {
    const options = this.options || {}
    // Use array destructing on the entry argument i.e. entries[0]
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting) {
        this.$emit('intersect')
      }
    }, options)

    // this.$el is the root element of the component
    this.observer.observe(this.$el)
  },
  destroyed() {
    this.observer.disconnect()
  }
}
</script>
