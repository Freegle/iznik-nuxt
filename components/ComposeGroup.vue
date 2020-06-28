<template>
  <b-form-select v-model="group" :style="(width ? ('width: ' + width + 'px') : '') + '; max-width: 300px;'" :options="groupOptions" @change="change" />
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
    group: {
      get() {
        return this.$store.getters['compose/getGroup']
      },
      set(value) {
        this.$store.dispatch('compose/setGroup', value)
      }
    },
    postcode() {
      const pc = this.$store.getters['compose/getPostcode']
      return pc
    },
    groupOptions() {
      const ret = []
      const ids = []

      if (this.postcode && this.postcode.groupsnear) {
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
  async mounted() {
    // The postcode we have contains a list of groups.  That list might contain groups which are no longer valid,
    // for example if they have been merged.  So we want to refetch the postcode so that our store gets updated.
    if (this.postcode) {
      await this.$store.dispatch('locations/fetch', {
        typeahead: this.postcode.name
      })

      const list = Object.values(this.$store.getters['locations/list'])
      list.forEach(l => {
        if (l.id === this.postcode.id) {
          this.$store.dispatch('compose/setPostcode', l)
        }
      })
    }
  },
  methods: {
    change(newValue) {
      this.$store.dispatch('compose/setGroup', newValue)
    }
  }
}
</script>
