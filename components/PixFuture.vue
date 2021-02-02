<template>
  <div id="pixfuture131" />
</template>
<script>
export default {
  mounted() {
    if (process.client) {
      console.log('Add PixFuture')
      window.corner_video = 'left'
      window.zone_id = 131
      window.mobile_allowed = true
      window.site_id = 4362

      const s = document.createElement('script')
      s.setAttribute('src', 'https://serv-vdo.pixfuture.com/vpaid/ads.js')
      document.head.appendChild(s)
      console.log('Added PixFuture')
    }
  }
}
</script>
