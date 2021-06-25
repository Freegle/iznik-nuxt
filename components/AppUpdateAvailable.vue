<template>
  <NoticeMessage v-if="show" variant="danger">
    Please update your app to version {{applatestversion}}.
  </NoticeMessage>
</template>
<script>
import NoticeMessage from './NoticeMessage'
import { pushstate, versionOutOfDate } from '../plugins/app-init-push'

export default {
  components: { NoticeMessage },
  computed: {
    applatestversion() {
      return pushstate.applatestversion
    },
    show() {
      const requiredVersion = pushstate.apprequiredversion
      console.log('AppUpdateAvailable requiredVersion', requiredVersion)
      if (versionOutOfDate(requiredVersion)) {
        console.log('appupdate required!')
        this.$router.push({ path: '/appupdate' })
      }
      console.log('AppUpdateAvailable applatestversion', pushstate.applatestversion)
      return versionOutOfDate(pushstate.applatestversion)
    }
  }
}
</script>
