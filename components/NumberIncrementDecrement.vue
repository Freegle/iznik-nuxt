<template>
  <div class="d-flex flex-column text-center width position-relative">
    <label :for="'spinbutton-' + id" class="sr-only">{{ label }}</label>
    <b-form-spinbutton
      :id="'spinbutton-' + id"
      v-model="current"
      type="number"
      :min="min"
      :max="max"
      step="1"
      size="lg"
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
    appendText: {
      type: String,
      required: false,
      default: ''
    },
    canedit: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      current: null,
      id: Date.now()
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
