<template>
  <a :href="href" target="_blank" rel="noopener noreferrer">
    <slot />
  </a>
</template>
<script>
export default {
  props: {
    href: {
      type: String,
      required: true
    }
  }
}
</script>
