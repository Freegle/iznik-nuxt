<template>
  <div class="d-flex flex-column text-center border rounded width position-relative pt-2">
    <label id="incdec-label" class="text-muted">{{ label }}</label>
    <b-input-group class="p-1">
      <b-input-group-prepend class="d-flex flex-column justify-content-center">
        <b-btn variant="white" class="attendance-button d-grid align-content-center justify-content-center leftbutt" tabindex="-1" @click="dec">
          <v-icon name="minus" title="Increment" />
        </b-btn>
      </b-input-group-prepend>
      <b-input
        v-model="current"
        role="spinbutton"
        class="text-center count"
        type="number"
        :min="min"
        :aria-valuemin="min"
        :max="max"
        :aria-valuemax="max"
        :aria-valuenow="current"
        step="1"
        aria-labelledby="incdec-label"
      />
      <b-input-group-append class="d-flex flex-column justify-content-center">
        <b-btn variant="white" class="attendance-button d-grid align-content-center justify-content-center" tabindex="-1" @click="inc">
          <v-icon name="plus" title="Decrement" />
        </b-btn>
      </b-input-group-append>
    </b-input-group>
  </div>
</template>
<script>
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
    canedit: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      current: null
    }
  },
  watch: {
    current(newVal) {
      if (newVal > this.max) {
        this.current = this.max
      }

      this.$emit('update:count', newVal)
    }
  },
  mounted() {
    this.current = this.count
  },
  methods: {
    inc() {
      if (this.current < this.max) {
        this.current++
        this.$emit('update:count', this.current)
      }
    },
    dec() {
      if (this.current > this.min) {
        this.current--
        this.$emit('update:count', this.current)
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.count {
  font-weight: bold;
}

.count::-webkit-outer-spin-button,
.count::-webkit-inner-spin-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 0;
}

.leftbutt {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.width {
  width: 170px;
}

label {
  position: absolute;
  top: -18px;
  left: 40px;
  background-color: white;
  z-index: 1000;
  font-size: 125%;
}

.border {
  border: 1px solid black;
}
</style>
