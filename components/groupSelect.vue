<template>
  <no-ssr>
    <b-form-select v-model="selectedGroup" :options="groupOptions" />
  </no-ssr>
</template>
<style>
select {
  max-width: 250px !important;
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
      type: String,
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
          text: '-- All communities --',
          selected: this.selectedGroup === 0
        })
      } else {
        groups.push({
          value: 0,
          text: '-- Please choose --',
          selected: this.selectedGroup === -1
        })
      }

      Object.keys(this.$store.state.group.list).forEach(key => {
        const group = this.$store.state.group.list[key]

        groups.push({
          value: group.id,
          text: group.namedisplay,
          selected: this.selectedGroup === group.id
        })
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
