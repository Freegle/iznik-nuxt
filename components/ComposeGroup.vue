<template>
  <b-form-select v-model="group" :style="width ? ('width: ' + width + 'px') : ''" :options="groupOptions" />
</template>
<script>
export default {
  props: {
    width: {
      type: Number,
      required: false,
      default: null
    }
  },
  computed: {
    postcode() {
      const pc = this.$store.getters['compose/getPostcode']()
      return pc
    },
    group: {
      get() {
        const stored = this.$store.getters['compose/getGroup']()
        return stored
      },
      set(newValue) {
        this.$store.dispatch('compose/setGroup', newValue)
      }
    },
    groupOptions() {
      const ret = []

      if (this.postcode) {
        console.log('Got postcode', this.postcode)
        for (const group of this.postcode.groupsnear) {
          if (group.type === 'Freegle') {
            ret.push({
              value: group.id,
              text: group.namedisplay ? group.namedisplay : group.nameshort
            })
          }
        }
      }

      return ret
    }
  }
}
</script>
