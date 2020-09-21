<template>
  <div class="thick wide bg-white text-center rounded pt-1 speech-bubble">
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
  position: relative;
  width: 200px;
  left: -80px;
  top: -55px;
}

.speech-bubble:before {
  content: '';
  width: 0px;
  height: 0px;
  position: absolute;
  border-left: 10px solid $color-green--darker;
  border-right: 10px solid transparent;
  border-top: 10px solid $color-green--darker;
  border-bottom: 10px solid transparent;
  left: 130px;
  bottom: -20px;
}

.speech-bubble:after {
  content: '';
  width: 0px;
  height: 0px;
  position: absolute;
  border-left: 10px solid $color-white;
  border-right: 10px solid transparent;
  border-top: 10px solid $color-white;
  border-bottom: 10px solid transparent;
  left: 133px;
  bottom: -13px;
}
</style>
