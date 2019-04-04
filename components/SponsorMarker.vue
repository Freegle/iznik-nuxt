<template>
  <RichMarker :position="marker.position">
    <div class="bg-light rounded">
      <h4>Sponsored by {{ marker.sponsor.name }}</h4>
    </div>
  </RichMarker>
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
