<template>
  <OurToggle
    :value="summary"
    class="mt-2"
    :height="30"
    :width="150"
    :font-size="14"
    :sync="true"
    :labels="{checked: 'Summary View', unchecked: 'Detailed View'}"
    color="#61AE24"
    @change="toggleView"
  />
</template>
<script>
const OurToggle = () => import('~/components/OurToggle')

export default {
  components: { OurToggle },
  computed: {
    summary() {
      const ret = this.$store.getters['misc/get'](
        'modtoolsMessagesApprovedSummary'
      )
      return typeof ret === 'undefined' ? false : ret
    }
  },
  methods: {
    toggleView(c, e) {
      this.$store.dispatch('misc/set', {
        key: 'modtoolsMessagesApprovedSummary',
        value: c.value
      })
    }
  }
}
</script>
