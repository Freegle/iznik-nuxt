<template>
  <b-form-group :label="label">
    <b-form-text v-if="description" class="mb-2">
      {{ description }}
    </b-form-text>
    <b-input-group v-if="type === 'input'">
      <b-input v-model="value" :disabled="disabled" />
      <b-input-group-append v-if="!disabled">
        <SpinButton variant="white" name="save" label="Save" :handler="save" />
      </b-input-group-append>
    </b-input-group>
    <div v-else-if="type === 'textarea'">
      <b-row>
        <b-col>
          <b-textarea v-model="value" :rows="rows" :disabled="disabled" />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <SpinButton
            v-if="!disabled"
            variant="white"
            name="save"
            label="Save"
            :handler="save"
            class="mt-2"
          />
        </b-col>
      </b-row>
    </div>
    <div v-else-if="type === 'toggle'">
      <OurToggle
        v-model="toggleValue"
        class="mt-2"
        :height="30"
        :width="toggleWidth"
        :font-size="14"
        :sync="true"
        :labels="{checked: toggleChecked, unchecked: toggleUnchecked}"
        color="#61AE24"
        :disabled="disabled"
        @change="save"
      />
    </div>
    <div v-else-if="type === 'select'">
      <b-select v-model="value" :options="options" class="mt-2" :disabled="disabled" @change="save" />
    </div>
  </b-form-group>
</template>
<script>
import SpinButton from './SpinButton'
const OurToggle = () => import('@/components/OurToggle')

export default {
  components: { OurToggle, SpinButton },
  props: {
    name: {
      type: String,
      required: true
    },
    configid: {
      type: Number,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false,
      default: null
    },
    type: {
      type: String,
      required: false,
      default: 'input'
    },
    rows: {
      type: Number,
      required: false,
      default: 3
    },
    toggleWidth: {
      type: Number,
      required: false,
      default: 150
    },
    toggleChecked: {
      type: String,
      required: false,
      default: null
    },
    toggleUnchecked: {
      type: String,
      required: false,
      default: null
    },
    valueChecked: {
      type: String,
      required: false,
      default: null
    },
    valueUnchecked: {
      type: String,
      required: false,
      default: null
    },
    options: {
      type: Array,
      required: false,
      default: () => []
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      forSave: null
    }
  },
  computed: {
    config() {
      return this.$store.getters['modconfigs/current']
    },
    value: {
      get() {
        let ret = null

        if (this.config) {
          if (this.type === 'toggle') {
            ret = this.config[this.name]

            if (this.valueChecked) {
              ret = ret === this.valueChecked
            }
          } else {
            ret = this.config[this.name]
          }
        }
        return ret
      },
      set(newval) {
        this.forSave = newval
      }
    },
    toggleValue: {
      get() {
        return Boolean(this.value)
      },
      set(newval) {
        this.value = newval
      }
    }
  },
  methods: {
    async save() {
      const data = {
        id: this.configid
      }

      if (this.type === 'toggle') {
        // We can override the values sent.
        if (this.forSave) {
          data[this.name] = this.valueChecked ? this.valueChecked : this.forSave
        } else {
          data[this.name] = this.valueUnchecked
            ? this.valueUnchecked
            : this.forSave
        }
      } else {
        data[this.name] = this.forSave
      }

      await this.$store.dispatch('modconfigs/updateConfig', data)
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

input,
select {
  max-width: 300px;
}
</style>
