<template>
  <div class="d-flex flex-column text-center width position-relative">
    <label
      :for="$id('spinbutton')"
      :class="{
        'sr-only': labelSROnly
      }"
    >{{ label }}</label>
    <b-form-spinbutton
      :id="$id('spinbutton')"
      v-model="current"
      type="number"
      :min="min"
      :max="max"
      step="1"
      :size="size"
      :formatter-fn="formatter"
    />
  </div>
</template>
<script>
import Vue from 'vue'

import { FormSpinbuttonPlugin } from 'bootstrap-vue'
Vue.use(FormSpinbuttonPlugin)

export default {
  props: {
    count: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      required: false,
      default: 1
    },
    max: {
      type: Number,
      required: false,
      default: 999
    },
    label: {
      type: String,
      required: false,
      default: ''
    },
    labelSROnly: {
      type: Boolean,
      required: false,
      default: false
    },
    appendText: {
      type: String,
      required: false,
      default: ''
    },
    canedit: {
      type: Boolean,
      required: false,
      default: false
    },
    size: {
      type: String,
      required: false,
      default: 'lg'
    }
  },
  data() {
    return {
      current: null
    }
  },
  watch: {
    current(newVal) {
      this.$emit('update:count', newVal)
    },
    count(newVal) {
      this.current = newVal
    }
  },
  created() {
    this.current = this.count
  },
  methods: {
    formatter(val) {
      return val + this.appendText
    }
  }
}
</script>
<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.border {
  border: 1px solid black;
}
</style>
