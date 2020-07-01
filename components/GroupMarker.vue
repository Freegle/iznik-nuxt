<template>
  <l-marker :key="'groupmarker-' + group.id + '-' + size" :lat-lng="[group.lat, group.lng]" :icon="icon" @click="goto">
    <l-tooltip v-if="size === 'poor'">
      {{ group.namedisplay }}
    </l-tooltip>
  </l-marker>
</template>

<script>
import L from 'leaflet'
import Vue from 'vue'
import GroupMarkerRich from './GroupMarkerRich'

export default {
  props: {
    group: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      required: true
    }
  },
  computed: {
    icon() {
      if (this.size === 'rich') {
        // Render the component off document.
        const Mine = Vue.extend(GroupMarkerRich)
        let re = new Mine({
          propsData: {
            group: this.group
          }
        })
        re = re.$mount().$el

        return new L.DivIcon({
          html: re.outerHTML,
          iconAnchor: [100, 100],
          className: 'clear'
        })
      } else {
        // Poor - just use marker
        return new L.Icon({
          iconUrl: require('static/mapmarker.gif')
        })
      }
    }
  },
  methods: {
    goto() {
      console.log('Goto group')
      if (this.group.external) {
        window.open(this.group.external)
      } else {
        this.$router.push('/explore/' + this.group.nameshort)
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.thick {
  border: 2px solid $color-green--darker !important;
}

clear {
  background: transparent;
  border: none;
}
</style>
