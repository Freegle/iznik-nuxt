<template>
  <div>
    <RichMarker :position="marker.position">
      <fa
        icon="bed"
        class="text-info fa-2x"
        :title="'Overnight in ' + marker.name + ' on ' + marker.date"
      />
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
    }
  }
}
</script>
