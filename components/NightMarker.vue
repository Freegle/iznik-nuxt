<template>
  <div>
    <RichMarker :position="marker.position">
      <fa
        icon="bed"
        class="text-info fa-2x"
        :title="'Overnight in ' + marker.name + ' on ' + marker.date"
      />
      <b-card v-if="currentZoom > 10">
        <b-card-body class="p-0 m-0">
          <p>
            Overnight in {{ marker.name }} on {{ marker.date }}
          </p>
        </b-card-body>
      </b-card>
    </RichMarker>
  </div>
</template>

<script>
import RichMarker from './RichMarker'

export default {
  components: { RichMarker },
  props: {
    marker: {
      type: Object,
      required: true
    },
    currentZoom: {
      type: Number,
      required: true
    }
  }
}
</script>
