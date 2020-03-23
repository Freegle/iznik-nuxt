<template>
  <span v-if="log.stdmsg">
    using <em>{{ log.stdmsg.title }} </em>
  </span>
</template>
<script>
export default {
  props: {
    log: {
      type: Object,
      required: false,
      default: null
    }
  }
}
</script>
