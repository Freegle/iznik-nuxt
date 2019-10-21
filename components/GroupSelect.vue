<template>
  <client-only>
    <b-form-select v-model="selectedGroup" :options="groupOptions" />
  </client-only>
</template>
<style scoped>
select {
  max-width: 400px !important;
}
</style>
<script>
export default {
  props: {
    // Whether we show "All my groups" or "Please choose a group"
    all: {
      type: Boolean,
      required: false,
      default: false
    },
    id: {
      validator: prop => typeof prop === 'number' || typeof prop === 'string',
      required: true
    }
  },
  data: function() {
    return {}
  },
  computed: {
    selectedGroup: {
      get: function() {
        const remembered = this.$store.getters['group/remembered'](this.id)

        return remembered || 0
      },
      set: function(newval) {
        this.$store.commit('group/remember', {
          id: this.id,
          val: newval
        })
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
  },
  mounted() {
    // Set up a watch on the store.  We do this because initially the store may not have been reloaded from local
    // storage. When it does get initially loaded, or when we change the value above, this watch will fire.
    const current = this.$store.getters['group/remembered'](this.id)

    if (current !== undefined) {
      // It has been loaded.
      this.$emit('change', current)
    }

    this.$store.watch(
      (state, getters) => {
        return this.$store.getters['group/remembered'](this.id)
      },
      (newValue, oldValue) => {
        this.$emit('change', newValue)
      }
    )
  }
}
</script>
