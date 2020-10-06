<template>
  <div class="d-flex">
    <autocomplete
      id="placeautocomplete"
      ref="autocomplete"
      v-model="wip"
      restrict
      :url="source"
      param="q"
      :custom-params="{ bbox: '-7.57216793459,49.959999905,1.68153079591,58.6350001085' }"
      anchor="name"
      label=""
      placeholder="Type your location"
      :classes="{ input: 'form-control form-control-' + size + ' text-center', list: 'locationlist', listentry: 'w-100', listentrylist: 'listentry' }"
      :min="3"
      :debounce="200"
      :process="process"
      :size="30"
      variant="success"
    />
    <b-btn variant="white" size="lg" class="ml-2">
      Explore!
    </b-btn>
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
    size: {
      type: String,
      required: false,
      default: 'lg'
    }
  },
  data() {
    return {
      source: 'https://photon.komoot.de/api',
      results: [],
      wip: null
    }
  },
  methods: {
    process(results) {
      console.log('Got results', results)
      const ret = []

      if (results && results.features) {
        const feat = results.features.slice(0, 5)

        feat.forEach(f => {
          if (f.geometry && f.geometry.coordinates && f.properties) {
            let str = ''

            // Take the bits we want and make a string.
            ;[
              'name',
              'street',
              'suburb',
              'hamlet',
              'town',
              'city',
              'state'
            ].forEach(k => {
              if (k in f.properties) {
                if (str === '') {
                  str = f.properties[k]
                } else {
                  str += ', ' + f.properties[k]
                }
              }
            })

            ret.push({
              id: f.properties.osm_id,
              name: str
            })
          }
        })
      }

      return ret
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .listentry {
  width: 100%;
  right: 0 !important;
}
</style>
