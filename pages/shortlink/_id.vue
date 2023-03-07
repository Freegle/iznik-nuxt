<template>
  <div />
</template>
<script>
export default {
  created() {
    this.id = this.$route.params.id
  },
  mounted() {
    const url = 'https://freegle.in/' + this.id
    if (process.env.IS_APP) {
      // eslint-disable-next-line no-undef
      cordova.InAppBrowser.open(url, '_system')
      return
    }
    window.location = url
  }
}
</script>
