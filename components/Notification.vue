<template>
  <div>
    {{ type }}
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    id: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: null
    },
    type: {
      type: String,
      required: true
    }
  }
}
</script>
