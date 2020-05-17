<template>
  <a :href="href" target="_blank" rel="noopener noreferrer" @click="openInBrowser">
    <slot />
  </a>
</template>
<script>
export default {
  methods: {
    openInBrowser() {
      if (process.env.IS_APP) {
        cordova.InAppBrowser.open(this.href,'_system')
        return false;
      }
      return true;
    }
  },
  props: {
    href: {
      type: String,
      required: true
    }
  },
  methods: {
    openInBrowser() {
      if (process.env.IS_APP) {
        // eslint-disable-next-line no-undef
        cordova.InAppBrowser.open(this.href, '_system')
        return false
      }
      return true
    }
  }
}
</script>
