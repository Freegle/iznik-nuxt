<template>
  <b-button :variant="variant" :disabled="disabled" :size="size" @click="click">
    <v-icon v-if="done" name="check" :class="spinclass" />
    <v-icon v-else-if="doing" name="sync" :class="'fa-spin ' + spinclass" />
    <v-icon v-else :name="name" />&nbsp;{{ label }}
  </b-button>
</template>
<script>
export default {
  props: {
    variant: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    handler: {
      type: Function,
      required: false,
      default: null
    },
    timeout: {
      type: Number,
      required: false,
      default: 5000
    },
    spinclass: {
      type: String,
      required: false,
      default: 'text-success'
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    size: {
      type: Boolean,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      doing: false,
      done: false
    }
  },
  methods: {
    async click() {
      if (!this.doing) {
        this.done = false
        this.doing = true

        if (this.handler) {
          await this.handler()

          this.doing = false
          this.done = true
          setTimeout(() => {
            this.done = false
          }, this.timeout)
        } else {
          // Pretend it took a second.
          setTimeout(() => {
            this.doing = false
            this.done = true
            setTimeout(() => {
              this.done = false
            }, this.timeout)
          }, 1000)
        }
      }
    }
  }
}
</script>
