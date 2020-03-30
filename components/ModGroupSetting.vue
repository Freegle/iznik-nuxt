<template>
  <b-form-group :label="label">
    <b-form-text v-if="description" class="mb-2">
      {{ description }}
    </b-form-text>
    <b-input-group v-if="type === 'input'">
      <b-input v-model="value" />
      <b-input-group-append>
        <SpinButton variant="white" name="save" label="Save" :handler="save" />
      </b-input-group-append>
    </b-input-group>
    <div v-else-if="type === 'textarea'">
      <b-row>
        <b-col>
          <b-textarea v-model="value" :rows="rows" />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <SpinButton variant="white" name="save" label="Save" :handler="save" class="mt-2" />
        </b-col>
      </b-row>
    </div>
    <div v-else-if="type === 'toggle'">
      <OurToggle
        v-model="value"
        class="mt-2"
        :height="30"
        :width="toggleWidth"
        :font-size="14"
        :sync="true"
        :labels="{checked: toggleChecked, unchecked: toggleUnchecked}"
        color="#61AE24"
        @change="save"
      />
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
    groupid: {
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
    }
  },
  data: function() {
    return {
      value: null
    }
  },
  computed: {
    group() {
      return this.$store.getters['group/get'](this.groupid)
    }
  },
  watch: {
    groupid(newval) {
      this.getValueFromGroup()
    }
  },
  mounted() {
    this.getValueFromGroup()
  },
  methods: {
    /**
     * From https://stackoverflow.com/questions/18936915/dynamically-set-property-of-nested-object
     *
     * Dynamically sets a deeply nested value in an object.
     * Optionally "bores" a path to it if its undefined.
     * @function
     * @param {!object} obj  - The object which contains the value you want to change/set.
     * @param {!array} path  - The array representation of path to the value you want to change/set.
     * @param {!mixed} value - The value you want to set it to.
     * @param {boolean} setrecursively - If true, will set value of non-existing path as well.
     */
    setDeep(obj, path, value, setrecursively = false) {
      let level = 0

      path.reduce((a, b) => {
        level++

        if (
          setrecursively &&
          typeof a[b] === 'undefined' &&
          level !== path.length
        ) {
          a[b] = {}
          return a[b]
        }

        if (level === path.length) {
          a[b] = value
          return value
        } else {
          return a[b]
        }
      }, obj)
    },

    async save() {
      const data = {
        id: this.groupid
      }

      const p = this.name.indexOf('.')

      if (p === -1) {
        // Top level property
        data[this.name] = this.value
      } else {
        // Lower down - we send the top one but we need to modify it wherever it is.
        const top = this.name.substring(0, p)
        const topobj = this.$store.getters['group/get'](this.groupid)
        this.setDeep(topobj, this.name.split('.'), this.value)
        data[top] = topobj[top]
      }

      await this.$store.dispatch('group/update', data)
    },
    getValueFromGroup() {
      let obj = this.$store.getters['group/get'](this.groupid)
      let name = this.name
      let p

      do {
        p = name.indexOf('.')

        if (p === -1) {
          // Got there.
          if (this.type === 'toggle') {
            this.value = Boolean(parseInt(obj[name]))
          } else {
            this.value = obj[name]
          }
        } else {
          const l1 = name.substring(0, p)
          const l2 = name.substring(p + 1)
          obj = obj[l1]
          name = l2
        }
      } while (p !== -1)
    }
  }
}
</script>
