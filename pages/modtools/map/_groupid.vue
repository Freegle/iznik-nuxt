<template>
  <div class="bg-white">
    <ModHelpMap />
    <div v-if="loaded">
      <ModGroupMap v-if="groupid" :groupid="groupid" />
      <ModGroupMap v-else groups :caretaker="caretaker" overlaps />
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
      loaded: false,
      all: false,
      caretaker: false
    }
  },
  async mounted() {
    // Get the data before we load the map to avoid timing windows.
    await this.$store.dispatch('group/list', {
      grouptype: 'Freegle'
    })

    this.loaded = true
  },
  created() {
    if (this.$route.params.groupid === 'all') {
      this.all = true
    } else if (this.$route.params.groupid === 'caretaker') {
      this.caretaker = true
    } else {
      this.groupid = parseInt(this.$route.params.groupid)
    }
  }
}
</script>
