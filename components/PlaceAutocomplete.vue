<template>
  <div>
    <label for="placeautocomplete" class="smaller font-weight-bold">
      <span v-if="labeltextSr" class="sr-only">
        {{ labeltextSr }}
      </span>
      {{ labeltext }}
    </label>
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
      :classes="{ input: 'form-control form-control-' + size + ' text-center', list: 'locationlist', listentry: 'w-100 listentry', listentrylist: 'listentrylist' }"
      :min="3"
      :debounce="200"
      :process="process"
      :on-select="select"
      :size="30"
      variant="success"
    />
    <div />
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
    labeltext: {
      type: String,
      required: false,
      default: null
    },
    labeltextSr: {
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
      source: process.env.GEOCODE || 'https://geocode.ilovefreegle.org/api',
      results: [],
      wip: null
    }
  },
  methods: {
    process(results) {
      const ret = []

      if (results && results.features) {
        const feat = results.features.slice(0, 5)

        feat.forEach(f => {
          if (f.geometry && f.geometry.coordinates && f.properties) {
            // We want a bounding box.  There may be one in properties.extent.
            let bbox = null

            if (f.properties.extent) {
              // There is.  That's what we need.
              bbox = [
                [f.properties.extent[1], f.properties.extent[0]],
                [f.properties.extent[3], f.properties.extent[2]]
              ]
            } else if (f.geometry.type === 'Point') {
              // No extent, so make up a bounding box very close to this point.  PostMap will zoom out.
              bbox = [
                [
                  f.geometry.coordinates[1] - 0.01,
                  f.geometry.coordinates[0] - 0.01
                ],
                [
                  f.geometry.coordinates[1] + 0.01,
                  f.geometry.coordinates[0] + 0.01
                ]
              ]
            }

            if (bbox) {
              let str = ''

              // Take the bits we want and make a string.
              ;['name', 'street', 'suburb', 'hamlet', 'town', 'city'].forEach(
                k => {
                  if (k in f.properties) {
                    if (str === '') {
                      str = f.properties[k]
                    } else {
                      str += ', ' + f.properties[k]
                    }
                  }
                }
              )

              ret.push({
                id: f.properties.osm_id,
                name: str,
                bbox: bbox,
                lat: f.geometry.coordinates[1],
                lng: f.geometry.coordinates[0]
              })
            }
          }
        })
      }

      return ret
    },
    select(place) {
      if (place) {
        this.$emit('selected', place)
      } else {
        this.$emit('cleared')
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

::v-deep .listentrylist {
  width: 100%;
  right: 0 !important;
  border-color: $color-blue--light;
  outline: 0;
  box-shadow: 0 1px 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>
