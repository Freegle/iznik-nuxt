<template>
  <div class="bg-white">
    <ModHelpMap />
    <div v-if="loaded">
      <ModGroupMap v-if="groupid" :groupid="groupid" />
      <ModGroupMap v-else :groups="true" />
    </div>
    <div v-else class="d-flex justify-content-around">
      <b-img-lazy src="~/static/loader.gif" alt="Loading" />
    </div>
  </div>
</template>
<script>
import loginRequired from '@/mixins/loginRequired.js'
import ModHelpMap from '../../../components/ModHelpMap'
import ModGroupMap from '~/components/ModGroupMap'

export default {
  layout: 'modtools',
  components: {
    ModHelpMap,
    ModGroupMap
  },
  mixins: [loginRequired],
  data: function() {
    return {
      groupid: null,
      loaded: false
    }
  },
  async mounted() {
    // Get the data before we load the map to avoid timing windows.
    if (!this.groupid) {
      // We want to show all groups
      console.log('List all groups')
      await this.$store.dispatch('group/list', {
        grouptype: 'Freegle'
      })
    } else {
      // Areas for a specific group.
      await this.$store.dispatch('group/fetch', {
        id: this.groupid,
        polygon: true
      })
      console.log('Fetched', this.groupid)
    }

    this.loaded = true
  },
  created() {
    this.groupid = parseInt(this.$route.params.groupid)
  }
}
</script>
