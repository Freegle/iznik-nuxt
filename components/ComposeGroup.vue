<template>
  <b-form-select v-model="group" :style="width ? ('width: ' + width + 'px') : ''" :options="groupOptions" @change="change" />
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
  data: function() {
    return {
      group: null
    }
  },
  computed: {
    postcode() {
      const pc = this.$store.getters['compose/getPostcode']()
      return pc
    },
    groupOptions() {
      const ret = []
      const ids = []

      if (this.postcode) {
        for (const group of this.postcode.groupsnear) {
          if (group.type === 'Freegle') {
            ret.push({
              value: group.id,
              text: group.namedisplay ? group.namedisplay : group.nameshort
            })

            ids[group.id] = true
          }
        }
      }

      // Add any other groups we are a member of and might want to select.
      const groups = this.$store.getters['auth/groups']()

      for (const group of groups) {
        if (group.type === 'Freegle') {
          if (!ids[group.id]) {
            ret.push({
              value: group.id,
              text: group.namedisplay ? group.namedisplay : group.nameshort
            })

            ids[group.id] = true
          }
        }
      }

      return ret
    }
  },
  mounted() {
    const stored = this.$store.getters['compose/getGroup']()
    this.group = stored
  },
  methods: {
    change(newValue) {
      this.$store.dispatch('compose/setGroup', newValue)
      this.group = newValue
    }
  }
}
</script>
