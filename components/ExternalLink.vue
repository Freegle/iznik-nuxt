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
        console.log(openInBrowser)
      }
    }
  },
  props: {
    href: {
      type: String,
      required: true
    }
  }
}
</script>
