<template>
  <div class="thick wide bg-white text-center rounded pt-1">
    <h3>
      {{ text }}
    </h3>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.thick {
  border: 2px solid $color-green--darker !important;
}

.wide {
  width: 200px;
  left: -80px;
  top: -130px;
}
</style>
