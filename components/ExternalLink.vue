<template>
  <!-- eslint-disable-next-line -->
  <span>
    <a :href="href" target="_blank" rel="noopener noreferrer" @click="openInBrowser"><slot /></a>
    <v-icon v-if="enableCopy()" name="copy" scale="0.75" title="Copy email" @click="copyEmail" />
    <span v-if="copied">Copied</span>
  </span>
</template>
<script>
export default {
  data: function () {
    return {
      copied: false
    }
  },
  props: {
    href: {
      type: String,
      required: true
    }
  },
  methods: {
    enableCopy() {
      return process.env.IS_MTAPP && (this.href.substr(0,7)==='mailto:')
    },
    copyEmail() {
      cordova.plugins.clipboard.copy(this.href.substr(7))
      this.copied = true
      setTimeout(() => { this.copied = false }, 2000)
    },
    openInBrowser(event) {
      console.log('openInBrowser')
      if (process.env.IS_APP) {
        // eslint-disable-next-line no-undef
        cordova.InAppBrowser.open(this.href, '_system')
        event.preventDefault()
        return false
      }
      return true
    }
  }
}
</script>
