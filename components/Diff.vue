<template>
  <div>
    <DiffPart v-for="part in diff" :key="'diff-' + JSON.stringify(part)" :part="part" />
  </div>
</template>
<script>
import DiffPart from './DiffPart'
const Diff = require('diff')

export default {
  components: { DiffPart },
  props: {
    old: {
      type: String,
      required: false,
      default: ''
    },
    new: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
    diff() {
      if (!this.old || !this.new) {
        return null
      }

      const ret = Diff.diffChars(this.old, this.new)
      return ret
    }
  }
}
</script>
