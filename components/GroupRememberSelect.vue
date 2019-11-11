<template>
  <div>
    <groupSelect v-model="selectValue" :all="all" :size="size" />
  </div>
</template>
<script>
import groupSelect from './GroupSelect'
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
        val = parseInt(val)
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
        // value received from memory (might be nothing)
        // we only take it if there is not already a value
        // this ensures we don't override explicitly set values from outside
        if (!this.value) {
          this.$emit('input', val || 0)
        }
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
      if (val) {
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
