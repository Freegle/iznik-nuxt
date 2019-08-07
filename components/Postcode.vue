<template>
  <b-input-group>
    <autocomplete
      ref="autocomplete"
      :url="source"
      param="typeahead"
      anchor="name"
      label=""
      placeholder="Type postcode or..."
      :classes="{ input: 'form-control form-control-lg text-center pcinp', list: 'postcodelist' }"
      :min="3"
      :debounce="100"
      :process="process"
      :on-select="select"
    />

    <b-input-group-append>
      <b-button variant="primary" size="lg">
        <fa icon="map-marker-alt" />&nbsp;Find my location
      </b-button>
    </b-input-group-append>
  </b-input-group>
</template>
<style scoped>
.input-group,
.autocomplete-wrapper,
.input-group-append {
  display: inline-block;
}

.input-group-append {
  /*TODO DESIGN This is a hacky way of positioning this button.*/
  top: -5px;
  left: -5px;
  position: relative;
}
</style>
<script>
import Autocomplete from '~/components/Autocomplete'
// TODO Make find location button work
// TODO It's quite easy to get the wrong postcode, or think it doesn't match, because of server lag.  Perhaps a busy
// indicator?

export default {
  components: {
    Autocomplete
  },
  data() {
    return {
      source: process.env.API + '/locations',
      results: [],
      mylocation: null
    }
  },
  async mounted() {
    // Focus on postcode to grab their attention.
    this.$refs.autocomplete.$refs.input.focus()

    // Components can't use asyncData, so we fetch here.  Can't do this for SSR, but that's fine as we don't
    // need to render this on the server.
    //
    // If we are logged in then we may have a known location to use as the default.
    const ret =
      this.$store.state.auth.user &&
      this.$store.state.auth.user.settings &&
      this.$store.state.auth.user.settings.mylocation
        ? this.$store.state.auth.user.settings.mylocation.name
        : null

    if (ret) {
      // Got one Set this as the default in the input.
      this.$refs.autocomplete.setValue(
        this.$store.state.auth.user.settings.mylocation.name
      )

      // We want to signal that we have a selected value.  Unfortunately what we have in auth from the session call
      // doesn't contain the groups near the location, so we need to fetch that.
      const loc = await this.$axios.get(process.env.API + '/locations', {
        params: {
          typeahead: ret
        }
      })

      this.$emit('selected', loc.data.locations[0])
    }

    this.mylocation = ret
    this.$refs.autocomplete.setValue(ret)

    // We need some fettling of the input keystrokes.
    const input = this.$refs.autocomplete.$refs.input
    input.addEventListener('keydown', this.keydown, false)
  },
  methods: {
    keydown(e) {
      if (e.which === 8) {
        // Backspace means we no longer have a full postcode.  Parent might want to know that we don't have a valid
        // postcode any more.
        this.$emit('cleared')
        this.results = null
      }
    },
    process(results) {
      const ret = results.locations.slice(0, 5)
      this.results = ret
      return ret
    },
    select(pc) {
      console.log('Selected', pc)
      this.$emit('selected', pc)
    }
  }
}
</script>
