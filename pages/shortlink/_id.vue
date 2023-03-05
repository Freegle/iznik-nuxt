<template>
  <div />
</template>
<script>
export default {
  created() {
    this.id = this.$route.params.id
  },
  mounted() {
    window.location = 'https://freegle.in/' + this.id
  }
}
</script>
