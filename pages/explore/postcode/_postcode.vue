<template>
  <b-container fluid>
    <b-row class="m-0">
      <b-col cols="0" lg="3" class="d-none d-lg-block p-0 pr-1" />
      <b-col cols="12" lg="6" class="p-0">
        <div>
          <h1 class="d-none d-sm-block heading">
            Freegling near {{ postcode }}
          </h1>
          <AdaptiveMap v-if="initialBounds" :initial-bounds="initialBounds" :groups="groups" />
        </div>
      </b-col>
      <b-col cols="0" lg="3" class="d-none d-lg-block p-0 pl-1" />
    </b-row>
  </b-container>
</template>
<script>
import AdaptiveMap from '../../../components/AdaptiveMap'
import buildHead from '@/mixins/buildHead.js'
import loginOptional from '@/mixins/loginOptional.js'

export default {
  components: { AdaptiveMap },
  mixins: [loginOptional, buildHead],
  data: function() {
    return {
      initialBounds: null,
      groups: []
    }
  },
  created() {
    this.postcode = this.$route.params.postcode
  },
  async mounted() {
    // Ensure we have no cached messages for other searches/groups
    this.$store.dispatch('messages/clear')
    this.context = null

    if (this.postcode) {
      // Get the postcode.
      await this.$store.dispatch('locations/fetch', {
        typeahead: this.postcode,
        postcount: true,
        groupareas: true
      })

      const list = Object.values(this.$store.getters['locations/list'])
      const l = list[0]

      // get the groups near this postcode.
      const groups = []
      l.groupsnear.forEach(g => {
        groups.push(g)
      })

      let swlat = null
      let swlng = null
      let nelat = null
      let nelng = null

      // We want to find enough groups to have at least some posts.  Sort them by closeness first.
      groups.sort((a, b) => {
        return a.polydist - b.polydist
      })

      let posttotal = 0
      let i = 0

      do {
        posttotal += groups[i].postcount
        swlat = swlat === null ? groups[i].lat : Math.min(swlat, groups[i].lat)
        swlng = swlng === null ? groups[i].lng : Math.min(swlng, groups[i].lng)
        nelat = nelat === null ? groups[i].lat : Math.max(nelat, groups[i].lat)
        nelng = nelng === null ? groups[i].lng : Math.max(nelng, groups[i].lng)
        i++
      } while (posttotal < this.postThreshold && i < groups.length)

      if (posttotal) {
        // We've found groups close to this postcode with an interesting number of posts.  So we have an initial
        // bound.
        this.initialBounds = [
          [
            this.swlat === null ? l.lat : Math.min(this.swlat, l.lat),
            this.swlng === null ? l.lng : Math.min(this.swlng, l.lng)
          ],
          [
            this.nelat === null ? l.lat : Math.max(this.nelat, l.lat),
            this.nelng === null ? l.lng : Math.max(this.nelng, l.lng)
          ]
        ]
      } else {
        // Didn't find any messages.  This is quite unlikely, but just set it near the postcode for lack of anything better.
        this.initialBounds = [
          [l.lat - 0.5, l.lng - 0.5],
          [l.lat + 0.5, l.lng + 0.5]
        ]
      }
    }
  },
  head() {
    return this.buildHead(
      'Explore Freegle',
      "There are lots of lovely communities of freeglers across the UK. Shall we see what they're up to?",
      null
    )
  }
}
</script>
