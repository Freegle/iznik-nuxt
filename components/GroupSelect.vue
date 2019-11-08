<template>
  <client-only>
    <b-form-select v-model="selectedGroup" size=":size" :options="groupOptions" />
  </client-only>
</template>
<style scoped>
select {
  /* TODO DESIGN make this configurable? */
  max-width: 400px !important;
}
</style>
<script>
export default {
  props: {
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
    selectedGroup: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },

    groupOptions() {
      const groups = []

      if (this.all) {
        groups.push({
          value: 0,
          text: '-- All my groups --',
          selected: this.selectedGroup === 0
        })
      } else {
        groups.push({
          value: 0,
          text: '-- Please choose --',
          selected: this.selectedGroup === -1
        })
      }

      const myGroups = this.$store.getters['auth/groups']()
      Object.keys(myGroups).forEach(key => {
        const group = myGroups[key]

        if (group.type === 'Freegle') {
          groups.push({
            value: group.id,
            text: group.namedisplay,
            selected: this.selectedGroup === group.id
          })
        }
      })

      groups.sort(function(a, b) {
        const str1 = a.text
        const str2 = b.text
        return str1 < str2 ? -1 : str1 > str2 ? 1 : 0
      })

      return groups
    }
  }
}
</script>
