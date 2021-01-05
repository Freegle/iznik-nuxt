<template>
  <div>
    <b-btn :variant="variant" :size="size" @click="download" v-if="false">
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
      if (process.env.IS_APP) {
        console.log(this.ics)
        if (window.plugins.calendar) {
          console.log("GOT CAL")
          const matchArr = this.ics.match(/^SUMMARY:.*$/)
          console.log("matchArr", matchArr)
          /*const lines = this.ics.split('\n')
          for (let j = 0; j < lines.length; j++) {
            console.log('Line ' + j + ' is ' + lines[j])
          }*/
          /*const startDate = new Date(event.startutcms);
          const endDate = new Date(event.endutcms);
          const title = event.title;
          const success = function (message) { console.log("Add calendar success", JSON.stringify(message)); };
          const error = function (message) { alert("Error: " + message); }; // TODO
          window.plugins.calendar.createEventInteractively(title, eventLocation, notes, startDate, endDate, success, error);*/
        }
        return
      }
      const blob = new Blob([this.ics], { type: 'text/calendar;charset=utf-8' })
      await saveAs(blob, 'freegle-handover.ics')
    }
  }
}
</script>
