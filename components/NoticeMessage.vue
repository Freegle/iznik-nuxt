<template>
  <div class="notice p-2 rounded-sm" :class="'notice--' + variant">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'NoticeMessage',
  props: {
    variant: {
      type: String,
      required: false,
      default: 'info'
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.notice {
  border-width: 1px;
  border-style: solid;
}

.notice--success {
  background-color: $colour-success-bg;
  border-color: $colour-success-border;
  color: $colour-success-fg;
}

.notice--info {
  background-color: $color-blue--x-light;
  border-color: $color-blue-x-light2;
  color: $color-blue--1;
}

.notice--warning {
  background-color: $color-yellow-1;
  border-color: $color-yellow-2;
  color: $color-yellow-3;
}

.notice--danger {
  background-color: $color-red--lighter;
  border-color: $color-red--light;
  color: $color-red--dark;
}
</style>
