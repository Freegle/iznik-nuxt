<template>
  <div class="notice__wrapper p-2 rounded-sm">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'NoticeMessage'
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.notice__wrapper {
  /* These defaults can be overrriden on the main component */
  background-color: $color-blue--x-light;
  border: 1px solid $color-blue-x-light2;
}
</style>
