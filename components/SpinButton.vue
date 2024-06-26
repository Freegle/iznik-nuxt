<template>
  <div class="d-inline-block">
    <b-button :variant="variant" :disabled="disabled" :size="size" :class="buttonClass" @click="click">
      <span v-if="iconlast">
        {{ label }}
      </span>
      <span>
        <span v-if="name">
          <v-icon v-if="done" name="check" :class="spinclass" />
          <v-icon v-else-if="doing" name="sync" :class="'fa-spin ' + spinclass" />
          <v-icon v-else :name="name" />&nbsp;
        </span>
        <span v-if="!iconlast">
          {{ label }}
        </span>
      </span>
    </b-button>
    <ConfirmModal v-if="confirm && showConfirm" ref="modal" @confirm="doIt" />
  </div>
</template>
<script>
import ConfirmModal from './ConfirmModal'

export default {
  components: { ConfirmModal },

  props: {
    variant: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: false,
      default: null
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
      type: String,
      required: false,
      default: null
    },
    iconlast: {
      type: Boolean,
      required: false,
      default: false
    },
    confirm: {
      type: Boolean,
      required: false,
      default: false
    },
    handlerData: {
      type: Object,
      required: false,
      default: null
    },
    buttonClass: {
      type: String,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      doing: false,
      done: false,
      showConfirm: false
    }
  },
  methods: {
    click() {
      if (this.confirm) {
        this.showConfirm = true
        this.waitForRef('modal', () => {
          this.$refs.modal.show()
        })
      } else {
        this.doIt()
      }
    },
    async doIt() {
      if (!this.doing) {
        this.done = false
        this.doing = true

        if (this.handler) {
          await this.handler(this.handlerData)

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
