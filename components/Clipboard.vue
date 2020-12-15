<template>
  <b-btn variant="secondary" size="sm" @click="copy">
    <v-icon name="copy" />
  </b-btn>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },
  methods: {
    async copy() {
      if (process.browser) {
        await navigator.clipboard.writeText(this.value)
      }
    }
  }
}
</script>
