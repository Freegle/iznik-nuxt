<template>
  <l-geojson
    :geojson="location.json"
    :options="locationOptions"
    :contenteditable="editable"
    @click="select"
  />
</template>
<script>
const AREA_FILL_COLOUR = 'darkgreen'
const FILL_OPACITY = 0.6
const AREA_BOUNDARY_COLOUR = 'darkblue'
const SELECTED = '#990000'

export default {
  props: {
    location: {
      type: Object,
      required: true
    },
    shade: {
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
