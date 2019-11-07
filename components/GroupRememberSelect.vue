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
      return this.$store.getters['group/remembered'](this.remember) || 0
    },
    selectValue: {
      get() {
        return this.value
      },
      set(val) {
        val = parseInt(val)
        // value changed from the select
        if (this.rememberedValue !== val) {
          this.updateMemory(val)
        }
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
        // value changed from the memory!
        if (this.value !== val) {
          this.$emit('input', val)
        }
      }
    },
    value(val) {
      // value changed from outside
      if (this.rememberedValue !== val) {
        this.updateMemory(val)
      }
    }
  },
  methods: {
    updateMemory(val) {
      if (val === 0) {
        this.$store.commit('group/forget', {
          id: this.remember
        })
      } else {
        this.$store.commit('group/remember', {
          id: this.remember,
          val
        })
      }
    }
  }
}
</script>
