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
  computed: {
    group() {
      return this.$store.getters['compose/getGroup']
    },
    postcode() {
      const pc = this.$store.getters['compose/getPostcode']
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
      const groups = this.$store.getters['auth/groups']

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
  methods: {
    change(newValue) {
      // TODO MINOR In the old version we had some explicit code to spot when a group we find near to a postcode
      // has been founded more recently than we saved our preferred group.  This is so that when a new group has
      // started, we will direct existing active members over to it rather than remember their last group and
      // keep posting to it.  We should do something similar.
      this.$store.dispatch('compose/setGroup', newValue)
    }
  }
}
</script>
