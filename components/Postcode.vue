<template>
  <div class="d-flex">
    <autocomplete
      id="postcodeautocomplete"
      ref="autocomplete"
      :url="source"
      param="typeahead"
      anchor="name"
      label=""
      placeholder="Type postcode"
      :classes="{ input: 'form-control form-control-' + size + ' text-center pcinp', list: 'postcodelist' }"
      class="mr-1"
      :min="3"
      :debounce="100"
      :process="process"
      :on-select="select"
    />

    <div v-if="showFind">
      <b-button variant="primary" :size="size" title="Find my location" @click="findLoc">
        <v-icon v-if="locating" name="sync" class="fa-spin" />
        <v-icon v-else-if="locationFailed" name="exclamation-triangle" />
        <v-icon v-else name="map-marker-alt" />
        <span class="d-none d-sm-inline">&nbsp;Find my location</span>
      </b-button>
    </div>

    <b-tooltip :show.sync="showToolTip" target="postcodeautocomplete" placement="top" variant="primary" triggers="">
      <b>Your device thinks you're here.<br><br>

        If it's wrong, please change it.</b>
    </b-tooltip>
  </div>
</template>
<script>
import { TooltipPlugin } from 'bootstrap-vue'
import Vue from 'vue'
import Autocomplete from '~/components/Autocomplete'

Vue.use(TooltipPlugin)

export default {
  components: {
    Autocomplete
  },
  props: {
    value: {
      type: String,
      required: false,
      default: null
    },
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
      mylocation: null,
      locating: false,
      locationFailed: false,
      showToolTip: false,
      showFind: this.find
    }
  },
  async mounted() {
    if (this.focus) {
      // Focus on postcode to grab their attention.
      this.$refs.autocomplete.$refs.input.focus()
    }

    // Components can't use asyncData, so we fetch here.  Can't do this for SSR, but that's fine as we don't
    // need to render this on the server.
    let value = this.value

    if (!this.value) {
      // If we are logged in then we may have a known location to use as the default.
      value =
        this.$store.getters['auth/user'] &&
        this.$store.getters['auth/user'].settings &&
        this.$store.getters['auth/user'].settings.mylocation
          ? this.$store.getters['auth/user'].settings.mylocation.name
          : null
    }

    if (value) {
      // Got one Set this as the default in the input.
      this.$refs.autocomplete.setValue(value)

      // We want to signal that we have a selected value.  Unfortunately what we have in auth from the session call
      // doesn't contain the groups near the location, so we need to fetch that.
      const loc = await this.$axios.get(process.env.API + '/locations', {
        params: {
          typeahead: value
        }
      })

      this.$emit('selected', loc.data.locations[0])
    }

    this.mylocation = value

    if (this.$refs.autocomplete) {
      // Might have gone from DOM by now due to navigation.
      this.$refs.autocomplete.setValue(value)

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

        // We want to show the button in case they decide to use that instead.
        this.showFind = true
      } else {
        // We're now typing a postcode.  Hide the button so they don't decide to click that next
        this.showFind = false

        // Hide the tooltip in case it's showing from a use of the find button.
        this.showToolTip = false
      }
    },
    process(results) {
      const ret = results.locations.slice(0, 5)
      this.results = ret
      return ret
    },
    select(pc) {
      this.$emit('selected', pc)
    },
    findLoc() {
      try {
        if (
          navigator &&
          navigator.geolocation &&
          navigator.geolocation.getCurrentPosition
        ) {
          this.locating = true
          navigator.geolocation.getCurrentPosition(async position => {
            const res = await this.$axios.get(process.env.API + '/locations', {
              params: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
            })

            if (
              res.data.ret === 0 &&
              res.data.location &&
              res.data.location.name &&
              this.$refs.autocomplete
            ) {
              // Got it - put it in the autocomplete input, and indicate that we've selected it.
              this.$refs.autocomplete.setValue(res.data.location.name)
              this.$emit('selected', res.data.location)

              // Show the user we've done this, and make them think.
              this.showToolTip = true
              setTimeout(() => (this.showToolTip = false), 10000)
            } else {
              this.locationFailed = true
            }
          })
        } else {
          console.log('Navigation not supported.  ')
          this.locationFailed = true
        }
      } catch (e) {
        console.error('Find location failed with', e)
        this.locationFailed = true
      }

      this.locating = false
    }
  }
}
</script>
<style scoped>
::v-deep .autocomplete ul {
  position: initial;
}
</style>
