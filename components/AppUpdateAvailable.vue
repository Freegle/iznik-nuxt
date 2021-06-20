<template>
  <NoticeMessage v-if="show" variant="danger">
    Please update your app to version {{appupdateversion}}.
  </NoticeMessage>
</template>
<script>
import NoticeMessage from './NoticeMessage'

export default {
  components: { NoticeMessage },
  computed: {
    appupdateversion() {
      return this.$store.getters['misc/get']('appupdateversion')
    },
    show() {
      const newver = this.$store.getters['misc/get']('appupdateversion')
      if( !newver) return false
      const anewver = newver.split('.')
      const currentver = process.env.IS_APP ? process.env.MOBILE_VERSION : process.env.MODTOOLS_VERSION
      const acurrentver = currentver.split('.')
      for (let vno = 0; vno < 3; vno++) {
        const cv = parseInt(acurrentver[vno])
        const nv = parseInt(anewver[vno])
        if( nv>cv) return true
      }
      return false
    }
  }
}
</script>
