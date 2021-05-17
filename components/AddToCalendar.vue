<template>
  <div>
    <b-btn :variant="variant" :size="size" @click="download">
      <v-icon name="calendar-alt" />
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
        if (window.plugins.calendar) {
          // https://github.com/EddyVerbruggen/Calendar-PhoneGap-Plugin
          function getCalProp(lines,name){
            name += ':'
            const namelen = name.length
            for(let i=0;i<lines.length;i++){
              const line = lines[i]
              if( line.length>=namelen){
                if( line.substring(0,namelen)===name){
                  let rv = line.substring(namelen)
                  while (++i < lines.length) {
                    const nextline = lines[i]
                    if (nextline.substring(0,1)!==' ') break
                    rv += nextline.substring(1)
                  }
                  return rv
                }
              }
            }
            return ''
          }
          const lines = this.ics.split('\r\n')
          const dtstart = getCalProp(lines, 'DTSTART;TZID=Europe/London') // 20210109T110000
          const year = parseInt(dtstart.substring(0,4))
          const month = parseInt(dtstart.substring(4,6))-1
          const dom = parseInt(dtstart.substring(6,8))
          const hour = parseInt(dtstart.substring(9,11))
          const mins = parseInt(dtstart.substring(11,13))
          const secs = parseInt(dtstart.substring(13,15))
          const startDate = new Date(year, month, dom, hour, mins, secs)
          const endDate = new Date(startDate.getTime()+5*60*1000)
          const title = getCalProp(lines, 'SUMMARY')
          const eventLocation = ''
          const notes = getCalProp(lines, 'DESCRIPTION')
          const success = function (message) { console.log("Add calendar success", JSON.stringify(message)) }
          const error = function (message) { alert("Error: " + message) } // TODO
          window.plugins.calendar.createEventInteractively(title, eventLocation, notes, startDate, endDate, success, error)
        }
        return
      }
      const blob = new Blob([this.ics], { type: 'text/calendar;charset=utf-8' })
      await saveAs(blob, 'freegle-handover.ics')
    }
  }
}
</script>
