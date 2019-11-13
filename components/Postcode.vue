<template>
  <div class="d-flex justify-content-center">
    <autocomplete
      ref="autocomplete"
      :url="source"
      param="typeahead"
      anchor="name"
      label=""
      placeholder="Type postcode or..."
      :classes="{ input: 'form-control form-control-' + size + ' text-center pcinp', list: 'postcodelist' }"
      class="mr-1"
      :min="3"
      :debounce="100"
      :process="process"
      :on-select="select"
    />

    <div v-if="find">
      <b-button variant="primary" :size="size">
        <v-icon title="Find my location" name="map-marker-alt" />
        <span class="d-none d-sm-inline">&nbsp;Find my location</span>
      </b-button>
    </div>
  </div>
</template>

<script>
import Autocomplete from '~/components/Autocomplete'
// TODO Make find location button work - and in DraggableMap.vue.
// TODO It's quite easy to get the wrong postcode, or think it doesn't match, because of server lag.  Perhaps a busy
// indicator?
// TODO Using the debounce option means that if you type fast, you get an end postcode in the input box which isn't
// looked up.  Bug.
// TODO If you're on mobile, e.g. on Give page, and click into this, then the on screen keyboard can hide the
// autocomplete dropdown.  So we need either to drop up instead, or scroll somehow.

export default {
  components: {
    Autocomplete
  },
  props: {
    focus: {
      type: Boolean,
      required: false,
      default: true
    },
    find: {
      type: Boolean,
      required: false,
      default: true
    },
    size: {
      type: String,
      required: false,
      default: 'lg'
    }
  },
  data() {
    return {
      source: process.env.API + '/locations',
      results: [],
      mylocation: null
    }
  },
  async mounted() {
    if (this.focus) {
      // Focus on postcode to grab their attention.
      this.$refs.autocomplete.$refs.input.focus()
    }

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

    if (this.$refs.autocomplete) {
      // Might have gone from DOM by now due to navigation.
      this.$refs.autocomplete.setValue(ret)

      // We need some fettling of the input keystrokes.
      const input = this.$refs.autocomplete.$refs.input
      input.addEventListener('keydown', this.keydown, false)
    }
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
