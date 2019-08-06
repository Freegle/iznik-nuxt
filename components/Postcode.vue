<template>
  <b-input-group>
    <autocomplete
      ref="autocomplete"
      :url="source"
      param="typeahead"
      anchor="name"
      label=""
      placeholder="Enter postcode"
      :classes="{ input: 'form-control form-control-lg text-center pcinp' }"
      :min="3"
      :debounce="300"
      :process="process"
      :on-select="select"
      :on-focus="focus"
    />

    <b-input-group-append>
      <b-button variant="primary" size="lg">
        <fa icon="map-marker-alt" />&nbsp;Find location
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
import Autocomplete from 'vue2-autocomplete-js'
// TODO DESIGN Styling of dropdown is weak; improve.
// TODO Make find location button work

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

      // Unfortunately what we have in auth from the session call doesn't contain the groups near the location,
      // so we need to fetch that.
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
      const input = this.$refs.autocomplete.$refs.input

      if (e.which === 13 && this.results && this.results.length === 1) {
        // Enter when there are no results breaks things.  This is a bug in the plugin, but this works around it.
        e.preventDefault()
        return false
      } else if (input.value.length === 1) {
        // Parent might want to know if this input has been cleared out.
        this.$emit('cleared')
        this.results = null
      }
    },
    process(results) {
      const ret = results.locations.slice(0, 5)
      ret.unshift({
        id: 0,
        name: ''
      })

      this.results = ret
      return ret
    },
    select(pc) {
      if (pc.id > 0) {
        this.$emit('selected', pc)
      }
    },
    focus() {
      // Show list if we have switched away and come back.
      this.$refs.autocomplete.showList = true
    }
  }
}
</script>
