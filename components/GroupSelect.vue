<template>
  <client-only>
    <div>
      <b-form-select v-model="selectedGroup" size=":size" :options="groupOptions" />
    </div>
  </client-only>
</template>
<style scoped>
select {
  max-width: 400px !important;
}
</style>
<script>
import cloneDeep from 'lodash.clonedeep'

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
    allMy: {
      type: Boolean,
      required: false,
      default: true
    },
    // Whether to list all Freegle groups.
    listall: {
      type: Boolean,
      required: false,
      default: false
    },
    // Whether to show the systemwide option.  This will only show if we're an system admin.
    systemwide: {
      type: Boolean,
      required: false,
      default: false
    },
    // Whether to only show groups on which we are a mod.
    modonly: {
      type: Boolean,
      required: false,
      default: false
    },
    // Whether "All my communities" should be "My active communities"
    active: {
      type: Boolean,
      required: false,
      default: false
    },
    size: {
      type: String,
      required: false,
      default: 'md'
    },
    // Whether to show work counts in the group names.
    work: {
      type: Array,
      required: false,
      default: function() {
        return []
      }
    },
    // Whether to restrict to our own groups
    restrict: {
      type: Boolean,
      required: false,
      default: true
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

    groups() {
      let ret = []
      if (this.listall) {
        ret = Object.values(this.$store.getters['group/list']).filter(g => {
          return g.id
        })
      } else {
        ret = this.$store.getters['auth/groups']
      }

      ret = ret || []
      return ret
    },

    sortedGroups() {
      // We need to clone the groups, because we're about to sort.  Sort is in-place, which means we trigger
      // reactivity changes and end up with a render loop.
      let groups = cloneDeep(this.groups)
      groups = groups.sort((a, b) => {
        if (!a.namedisplay) {
          console.error('Bad group in GroupSelect', a, b, this.groups)
        }
        return a.namedisplay
          .toLowerCase()
          .localeCompare(b.namedisplay.toLowerCase())
      })

      return groups
    },

    groupOptions() {
      const groups = []

      if (this.all) {
        groups.push({
          value: null,
          text: this.active
            ? '-- My active communities --'
            : this.allMy
              ? '-- All my communities --'
              : '-- All communities --',
          selected: this.selectedGroup === null
        })
      } else {
        groups.push({
          value: null,
          text: '-- Please choose --',
          selected: this.selectedGroup === null
        })
      }

      if (this.systemwide) {
        // Check we're allowed.
        if (
          this.me &&
          (this.me.systemrole === 'Admin' || this.me.systemrole === 'Support')
        ) {
          groups.push({
            value: -2,
            text: '-- Systemwide --',
            selected: this.selectedGroup === -2
          })
        }
      }

      for (const group of this.sortedGroups) {
        if (
          this.listall ||
          (group.type === 'Freegle' &&
            (!this.modonly ||
              group.role === 'Owner' ||
              group.role === 'Moderator'))
        ) {
          let text = group.namedisplay

          if (this.work) {
            this.work.forEach(type => {
              if (group.work && group.work[type]) {
                text +=
                  ' (' +
                  group.work[type] +
                  ')' +
                  (group.mysettings && group.mysettings.active === 0
                    ? ' - backup'
                    : '')
              }
            })
          }
          groups.push({
            value: group.id,
            text: text,
            selected: this.selectedGroup === group.id
          })
        }
      }

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
        if (val && this.restrict) this.selectedGroup = null
      }
    }
  },
  async mounted() {
    if (this.listall) {
      await this.$store.dispatch('group/list', {
        grouptype: 'Freegle'
      })
    }
  }
}
</script>
