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
    /**
     * Selected value
     *
     *   if null
     *     if   all=true       --> "all groups"
     *     else all=false      --> "you must select a group"
     *   else if it's a number --> use that group id
     *
     * (0 is not a valid group number)
     */
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
          value: null,
          text: '-- All my communities --',
          selected: this.selectedGroup === null
        })
      } else {
        groups.push({
          value: null,
          text: '-- Please choose --',
          selected: this.selectedGroup === null
        })
      }

      const myGroups = this.$store.getters['auth/groups']

      for (const group of myGroups) {
        if (group.type === 'Freegle') {
          groups.push({
            value: group.id,
            text: group.namedisplay,
            selected: this.selectedGroup === group.id
          })
        }
      }

      groups.sort((a, b) => a.text.localeCompare(b.text))

      return groups
    },

    invalidSelection() {
      return (
        this.groupOptions.length > 0 &&
        !this.groupOptions.some(option => option.selected)
      )
    }
  },
  watch: {
    invalidSelection: {
      immediate: true,
      handler(val) {
        if (val) this.selectedGroup = null
      }
    }
  }
}
</script>
