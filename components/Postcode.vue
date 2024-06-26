<template>
  <div class="d-flex">
    <div class="d-flex flex-column">
      <label v-if="label" :for="$id('postcodeautocomplete')">{{ label }}</label>
      <div class="d-flex">
        <autocomplete
          :id="$id('postcodeautocomplete')"
          ref="autocomplete"
          v-model="wip"
          restrict
          :url="source"
          param="typeahead"
          :custom-params="{ pconly: pconly }"
          anchor="name"
          label=""
          :placeholder="pconly ? 'Type postcode' : 'Type location'"
          :classes="{ input: 'form-control form-control-' + size + ' text-center pcinp', list: 'postcodelist', listentry: 'w-100', listentrylist: 'listentry' }"
          class="mr-1"
          :min="3"
          :debounce="200"
          :process="process"
          :on-select="select"
          :size="10"
          :variant="variant"
          @invalid="invalid"
        />

        <div v-if="find && !wip">
          <b-button variant="secondary" :size="size" title="Find my device's location instead of typing a postcode" @click="findLoc">
            <v-icon v-if="locating" name="sync" class="fa-spin" />
            <v-icon v-else-if="locationFailed" name="exclamation-triangle" />
            <v-icon v-else name="map-marker-alt" />
          </b-button>
        </div>

        <b-tooltip :show.sync="showToolTip" :target="$id('postcodeautocomplete')" placement="top" variant="primary" triggers="">
          <div class="font-weight-bold">
            Your device thinks you're here.<br><br>

            If it's wrong, please change it.
          </div>
        </b-tooltip>
        <b-tooltip
          :show="wip && (!results || !results.length)"
          :target="$id('postcodeautocomplete')"
          placement="top"
          variant="primary"
          triggers=""
          :delay="{ show: 1000 }"
        >
          Keep typing your full postcode...
        </b-tooltip>
      </div>
    </div>
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
    label: {
      type: String,
      required: false,
      default: null
    },
    focus: {
      type: Boolean,
      required: false,
      default: false
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
    },
    pconly: {
      type: Boolean,
      required: false,
      default: true
    },
    noStore: {
      type: Boolean,
      required: false,
      default: true
    },
    variant: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      source: process.env.API + '/locations',
      results: [],
      composeLocation: null,
      locating: false,
      locationFailed: false,
      showToolTip: false,
      wip: null
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

    if (this.pconly && value === null && this.myLocation) {
      // If we are logged in then we may have a known location to use as the default.
      value = this.myLocation.name
    }

    if (this.pconly && !value && !this.noStore) {
      // We might have one we are composing.
      const pc = this.$store.getters['compose/getPostcode']

      if (pc && pc.name) {
        value = pc.name
      }
    }

    if (value) {
      // Got one. Set this as the default in the input.
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

    this.composeLocation = value

    if (this.$refs.autocomplete) {
      // Might have gone from DOM by now due to navigation.
      this.$refs.autocomplete.setValue(value)

      // We need some fettling of the input keystrokes.
      const input = this.$refs.autocomplete.$refs.input
      input.addEventListener('keydown', this.keydown, false)
    }
  },
  methods: {
    invalid() {
      // Parent might want to know that we don't have a valid postcode any more.
      this.$emit('cleared')
      this.wip = null
      this.results = []
    },
    keydown(e) {
      if (e.which === 8) {
        // Backspace means we no longer have a full postcode.
        this.invalid()
      } else {
        // Hide the tooltip in case it's showing from a use of the find button.
        this.showToolTip = false
      }
    },
    process(results) {
      const names = []
      const ret = []

      if (results && results.locations) {
        for (let i = 0; i < results.locations.length && names.length < 5; i++) {
          const loc = results.locations[i]

          if (names.indexOf(loc.name) === -1) {
            names.push(loc.name)
            ret.push(loc)
          }
        }
      }

      this.results = ret
      return ret
    },
    select(pc) {
      if (pc) {
        this.$emit('selected', pc)
      } else {
        this.$emit('cleared')
      }
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

<style scoped lang="scss">
@import 'color-vars';

::v-deep .listentry {
  width: 100%;
  right: 0 !important;
  text-align: center;
  border-color: $color-blue--light;
  outline: 0;
  box-shadow: 0 1px 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>
