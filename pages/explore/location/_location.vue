<template>
  <b-row class="m-0">
    <b-col cols="12" lg="6" class="p-0" offset-lg="3">
      <h1 class="sr-only">
        Freegling map near {{ location }}
      </h1>
      <AdaptiveMap
        v-if="initialBounds"
        :initial-bounds="initialBounds"
        start-on-groups
        :initial-group-ids="initialGroupIds"
        :region="region"
        class="mt-2"
        show-start-message
      />
    </b-col>
  </b-row>
</template>
<script>
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
import AdaptiveMap from '@/components/AdaptiveMap'

export default {
  components: {
    AdaptiveMap
  },
  mixins: [loginOptional, buildHead],
  data: function() {
    return {
      location: null
    }
  },
  async asyncData({ app, params, store }) {
    let bounds = [
      [49.959999905, -7.57216793459],
      [58.6350001085, 1.68153079591]
    ]
    let location = null

    // Get all the groups in store for the adaptive map.
    await store.dispatch('group/list', {
      grouptype: 'Freegle'
    })

    // Find the passed location
    location = params.location

    await store.dispatch('locations/fetch', {
      typeahead: encodeURIComponent(location)
    })

    const list = Object.values(store.getters['locations/list'])
    list.forEach(l => {
      bounds = [[l.lat - 0.001, l.lng - 0.001], [l.lat + 0.001, l.lng + 0.001]]
    })

    return {
      region: params.region,
      initialBounds: bounds,
      location
    }
  },
  head() {
    return this.buildHead('Explore Freegle communities in ' + this.region)
  }
}
</script>
