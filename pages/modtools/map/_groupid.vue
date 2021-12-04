<template>
  <div class="bg-white">
    <ModHelpMap />
    <div v-if="loaded">
      <ModGroupMap v-if="groupid" :groupid="groupid" />
      <ModGroupMap v-else :groups="true" :caretaker="caretaker" />
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
    }

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
