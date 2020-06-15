<template>
  <!-- eslint-disable-next-line -->
  <span :class="getClass" :title="getTitle">{{ part.value }}</span>
</template>
<script>
export default {
  props: {
    part: {
      type: Object,
      required: true
    }
  },
  computed: {
    getClass() {
      if (this.part.added) {
        return 'text-warning'
      } else if (this.part.removed) {
        return 'strike text-danger text-muted'
      } else {
        return 'text-black'
      }
    },
    getTitle() {
      if (this.part.added) {
        return 'Added'
      } else if (this.part.removed) {
        return 'Removed'
      } else {
        return 'Unchanged'
      }
    }
  }
}
</script>
