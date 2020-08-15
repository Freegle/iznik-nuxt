<template>
  <div>
    <l-geojson
      :geojson="location.json"
      :options="locationOptions"
      :contenteditable="editable"
      @click="select"
    />
    <l-circle-marker v-if="labels && centre" :lat-lng="[ centre.lat, centre.lng ]" :radius="1">
      <l-tooltip ref="tooltip" :content="location.name" :options="{ permanent: true, direction: 'center' }" />
    </l-circle-marker>
  </div>
</template>
<script>
import waitForRef from '@/mixins/waitForRef'

const AREA_FILL_COLOUR = 'lightgreen'
const FILL_OPACITY = 0.5
const AREA_BOUNDARY_COLOUR = 'darkblue'
const SELECTED = '#990000'

export default {
  mixins: [waitForRef],
  props: {
    location: {
      type: Object,
      required: true
    },
    shade: {
      type: Boolean,
      required: false
    },
    labels: {
      type: Boolean,
      required: false
    },
    selected: {
      type: Boolean,
      required: false
    }
  },
  data: function() {
    return {
      editable: false,
      obj: null
    }
  },
  computed: {
    locationOptions() {
      return {
        fillColor: AREA_FILL_COLOUR,
        fillOpacity: this.shade ? FILL_OPACITY : 0,
        color: this.selected ? SELECTED : AREA_BOUNDARY_COLOUR
      }
    },
    centre() {
      // The centre returned by the server is the MySQL centroid.  This is calculated using the bounding box and might
      // lie outside the actual polygon.  Calculate a better centre using the mean of the vertices.
      let lat = 0
      let lng = 0
      let ret = null

      if (this.location.json && this.location.json.coordinates.length === 1) {
        this.location.json.coordinates[0].forEach(c => {
          lat += parseFloat(c[1])
          lng += parseFloat(c[0])
        })

        lat /= this.location.json.coordinates[0].length
        lng /= this.location.json.coordinates[0].length
        ret = {
          lat,
          lng
        }
      }

      return ret
    }
  },
  methods: {
    select(e) {
      this.obj = e.sourceTarget
      this.obj.editing.enable()
      this.$emit('click')
    }
  }
}
</script>
