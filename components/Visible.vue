<template>
  <div v-if="show">
    <slot />
  </div>
</template>
<script>
export default {
  props: {
    at: {
      type: Array,
      required: true
    }
  },
  computed: {
    show() {
      return this.at.indexOf(this.breakpoint) !== -1
    }
  }
}
</script>
