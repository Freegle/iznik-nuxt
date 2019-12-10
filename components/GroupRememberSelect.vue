<template>
  <groupSelect v-model="selectValue" :all="all" :systemwide="systemwide" :size="size" />
</template>
<script>
import groupSelect from './GroupSelect'

function intOrNull(val) {
  return typeof val === 'number' ? parseInt(val) : null
}

export default {
  components: {
    groupSelect
  },
  props: {
    remember: {
      validator: prop => typeof prop === 'number' || typeof prop === 'string',
      required: true
    },
    value: {
      type: Number,
      default: null
    },
    // Whether we show "All my groups" or "Please choose a group"
    all: {
      type: Boolean,
      required: false,
      default: false
    },
    systemwide: {
      type: Boolean,
      required: false,
      default: false
    },
    size: {
      type: String,
      required: false,
      default: 'md'
    }
  },
  computed: {
    rememberedValue() {
      return this.$store.getters['group/remembered'](this.remember)
    },
    selectValue: {
      get() {
        return this.value
      },
      set(val) {
        val = intOrNull(val)
        if (this.value !== val) {
          this.$emit('input', val)
        }
      }
    }
  },
  watch: {
    rememberedValue: {
      immediate: true,
      handler(val) {
        if (val === undefined) return // no remembered value
        // we only take it if there is not already a value
        // this ensures we don't override explicitly set values from outside
        if (this.value === null) this.$emit('input', val)
      }
    },
    value(val) {
      // value changed
      if (this.rememberedValue !== val) {
        this.updateMemory(val)
      }
    }
  },
  methods: {
    updateMemory(val) {
      if (typeof val === 'number') {
        this.$store.commit('group/remember', {
          id: this.remember,
          val
        })
      } else {
        this.$store.commit('group/forget', {
          id: this.remember
        })
      }
    }
  }
}
</script>
