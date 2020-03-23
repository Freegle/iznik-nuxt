<template>
  <b-col>
    <b-row class="m-0">
      <b-col cols="0" md="3" />
      <b-col cols="12" lg="6">
        <CovidWarning class="mt-2" />
      </b-col>
      <b-col cols="0" md="3" />
    </b-row>
  </b-col>
</template>
<style scoped>
select {
  max-width: 400px !important;
}
</style>
<script>
import CovidWarning from '../../components/CovidWarning'
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'

export default {
  components: {
    CovidWarning
  },
  mixins: [loginOptional, buildHead],
  data() {
    return {
      id: null,
      postcode: null,
      source: process.env.API + '/locations?typeahead=',
      group: null
    }
  },
  computed: {
    extgroup() {
      const groupid = this.$store.getters['compose/getGroup']

      if (this.postcode && this.postcode.groupsnear) {
        for (const group of this.postcode.groupsnear) {
          if (group.id === groupid) {
            return group.external
          }
        }
      }

      return null
    }
  },
  async asyncData({ app, params, store }) {},
  methods: {
    getLocation() {},
    postcodeSelect(pc) {
      this.postcode = pc
      const currentpc = this.$store.getters['compose/getPostcode']

      if (!currentpc || currentpc.id !== pc.id) {
        // The postcode has genuinely changed or been set for the first time.  We don't want to go through this code
        // if the postcode is the same, otherwise we'll reset the group (which might have been changed from the first,
        // for example in the give flow if you choose a different group.
        this.$store.dispatch('compose/setPostcode', this.postcode)

        // If we don't have a group currently which is in the list near this postcode, choose the closest.  That
        // allows people to select further away groups if they wish.
        const groupid = this.$store.getters['compose/getGroup']

        if (pc && pc.groupsnear) {
          let found = false
          for (const group of pc.groupsnear) {
            if (parseInt(group.id) === parseInt(groupid)) {
              found = true
            }
          }

          let group

          if (!found) {
            group = pc.groupsnear[0].id
          } else {
            group = groupid
          }

          this.$store.dispatch('compose/setGroup', group)
        }
      }
    },
    postcodeClear() {
      this.postcode = null
      this.group = null
      this.$store.dispatch('compose/setPostcode', null)
      this.$store.dispatch('compose/setGroup', null)
    }
  },

  head() {
    return this.buildHead(
      'Find something',
      'See what people nearby are giving away for free'
    )
  }
}
</script>
