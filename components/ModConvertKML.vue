<template>
  <b-card no-body>
    <b-card-header class="bg-info">
      KML Converter
    </b-card-header>
    <b-card-body>
      <p>
        This converts KML to WKT.  It is mostly useful for NGT when changing group areas.
      </p>
      <b-form-textarea v-model="kml" rows="2" placeholder="Enter KML here" />
      <b-btn variant="white" class="mt-2" @click="convert">
        Convert
      </b-btn>
      <div v-if="wkt">
        <b-form-textarea v-model="wkt" rows="2" />
      </div>
    </b-card-body>
  </b-card>
</template>
<script>
export default {
  components: {},
  data: function() {
    return {
      kml: null,
      wkt: null
    }
  },
  methods: {
    async convert() {
      this.wkt = await this.$store.dispatch('locations/convertKML', this.kml)
    }
  }
}
</script>
