<template>
  <div class="icon d-flex flex-column justify-content-center" @click="$emit('click')">
    <span :class="{ small: count > 1000 }">
      {{ count }}
    </span>
  </div>
</template>
<script>
export default {
  props: {
    count: {
      type: Number,
      required: true
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.icon {
  width: 46px;
  height: 46px;
  margin-left: -23px;
  margin-top: -23px;
  border-radius: 50%;
  border: 5px solid $color-green--darker;
  text-align: center;
  font-weight: bold;
  color: black;
  background-color: white;
  font-size: 16px;
}

.small {
  font-size: 14px;
  font-weight: bold;
}
</style>
