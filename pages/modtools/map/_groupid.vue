<template>
  <div class="bg-white">
    Sorry, we've had to disable the map temporarily for cost reasons.
    <div v-if="false">
      <!--      TODO MAP-->
      <ModGroupMap v-if="groupid" :groupid="groupid" />
      <ModGroupMap v-else :groups="true" />
    </div>
  </div>
</template>
<script>
import ModGroupMap from '~/components/ModGroupMap'
import loginRequired from '@/mixins/loginRequired.js'

export default {
  layout: 'modtools',
  components: {
    ModGroupMap
  },
  mixins: [loginRequired],
  data: function() {
    return {
      groupid: null
    }
  },
  created() {
    this.groupid = parseInt(this.$route.params.groupid)
  }
}
</script>
