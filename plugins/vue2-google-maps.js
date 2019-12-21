import Vue from 'vue'
import * as VueGoogleMaps from '~/node_modules/vue2-google-maps'

const googleMapsKey = process.env.GOOGLE_MAPS_KEY

Vue.use(VueGoogleMaps, {
  load: {
    key: googleMapsKey,
    libraries: 'places,drawing,visualization'
  },

  autobindAllEvents: true
})
