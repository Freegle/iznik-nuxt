<template>
  <div>
    <b-btn :variant="variant" :size="size" @click="download">
      Add to Calendar
    </b-btn>
  </div>
</template>
<script>
import saveAs from 'save-file'

export default {
  props: {
    variant: {
      type: String,
      required: false,
      default: 'secondary'
    },
    ics: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: false,
      default: 'md'
    }
  },
  methods: {
    async download() {
      const blob = new Blob([this.ics], { type: 'text/calendar;charset=utf-8' })
      await saveAs(blob, 'freegle-handover.ics')
    }
  }
}
</script>
