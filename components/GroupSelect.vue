<template>
  <client-only>
    <div>
      <b-form-select v-model="selectedGroup" size=":size" :options="groupOptions" />
      <NoticeMessage v-if="selectedGroup === -2" variant="danger" class="mt-1">
        This is a national volunteer opportunity which will go out to all communities. Please review carefully.
      </NoticeMessage>
    </div>
  </client-only>
</template>
<style scoped>
select {
  /* TODO DESIGN make this configurable? */
  max-width: 400px !important;
}
</style>
<script>
import NoticeMessage from './NoticeMessage'
export default {
  components: { NoticeMessage },
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
    systemwide: {
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

    me() {
      return this.$store.getters['auth/user']
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

      if (this.systemwide) {
        // Check we're allowed.
        if (this.me && this.me.systemrole === 'Admin') {
          groups.push({
            value: -2,
            text: '-- Systemwide --',
            selected: false
          })
        }
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
        console.log('Invalid', val)
        // TODO NS This makes it impossible to select systemwide.
        if (val) this.selectedGroup = null
      }
    }
  }
}
</script>
