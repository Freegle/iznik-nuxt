<template>
  <div class="w-100 bg-white text-center">
    <h2>Please upgrade</h2>
    <p class="p-3">
      To continue to use {{appname}}, you need to update this app in the app store. The latest available version is {{applatestversion}}.
    </p>
  </div>
</template>
<script>

import { pushstate} from '../plugins/app-init-push'

export default {
  mounted() {
  },
  computed: {
    applatestversion() {
      return pushstate.applatestversion
    },
    appname() {
      return process.env.IS_MTAPP ? 'ModTools' : 'Freegle'
    }
  }
}
</script>
