<template>
  <div class="icon d-flex flex-column justify-content-center" @click="$emit('click')">
    <span :class="{ small: count >= 1000, normal: count < 1000 }">
      {{ count }}
    </span>
    <span v-if="tag" class="text-muted tag">
      {{ count | pluralize(tag, { includeNumber: false }) }}
    </span>
  </div>
</template>
<script>
export default {
  props: {
    count: {
      type: Number,
      required: true
    },
    tag: {
      type: Array,
      required: false,
      default: null
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
  line-height: 14px;
  font-weight: bold;
}

.normal {
  line-height: 16px;
  font-size: 16px;
  font-weight: bold;
}

.tag {
  line-height: 10px;
  font-size: 10px;
}
</style>
