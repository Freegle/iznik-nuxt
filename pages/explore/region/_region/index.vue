<template>
  <b-row class="m-0">
    <b-col cols="12" lg="6" class="p-0" offset-lg="3">
      <AdaptiveMap v-if="initialBounds" :initial-bounds="initialBounds" start-on-groups :initial-group-ids="initialGroupIds" :region="region" />
      <b-alert v-else variant="danger" show>
        That region isn't valid.
      </b-alert>
    </b-col>
  </b-row>
</template>
<script>
import AdaptiveMap from '../../../../components/AdaptiveMap'
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'

export default {
  components: {
    AdaptiveMap
  },
  mixins: [loginOptional, buildHead],
  data: function() {
    return {
      region: null
    }
  },
  async asyncData({ app, params, store }) {
    // Get all the groups in store for the adaptive map.
    await store.dispatch('group/list', {
      grouptype: 'Freegle'
    })

    // Calculate the initial bounds for the region.
    let bounds = null
    const groupids = []
    const allGroups = store.getters['group/list']

    let swlat = null
    let swlng = null
    let nelat = null
    let nelng = null

    for (const ix in allGroups) {
      const group = allGroups[ix]
      // console.log('compare', group.region, params.region)

      if (
        group.onmap &&
        group.publish &&
        group.region &&
        group.region.trim().toLowerCase() === params.region.trim().toLowerCase()
      ) {
        swlat = swlat === null ? group.lat : Math.min(swlat, group.lat)
        swlng = swlng === null ? group.lng : Math.min(swlng, group.lng)
        nelat = nelat === null ? group.lat : Math.max(nelat, group.lat)
        nelng = nelng === null ? group.lng : Math.max(nelng, group.lng)
        groupids.push(group.id)
      }
    }

    if (swlat !== null && swlng !== null && nelat !== null && nelng !== null) {
      bounds = [[swlat, swlng], [nelat, nelng]]
    }

    return {
      region: params.region,
      initialBounds: bounds,
      initialGroupIds: groupids
    }
  },
  head() {
    return this.buildHead('Explore Freegle communities in ' + this.region)
  }
}
</script>
