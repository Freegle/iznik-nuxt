<template>
  <NoticeMessage v-if="show" variant="danger">
    Please update your app to version {{applatestversion}}.
    This usually happens automatically overnight.
    Manual instructions for
    <ExternalLink href="https://support.google.com/googleplay/answer/113412?hl=en">Android</ExternalLink> and
    <ExternalLink href="https://support.apple.com/en-gb/HT202180">Apple iOS</ExternalLink>.
  </NoticeMessage>
</template>
<script>
import NoticeMessage from './NoticeMessage'
import ExternalLink from './ExternalLink'
import { pushstate, versionOutOfDate } from '../plugins/app-init-push'

export default {
  components: { NoticeMessage, ExternalLink },
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
