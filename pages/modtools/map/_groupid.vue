<template>
  <div class="bg-white">
    <ModGroupMap :groups="true" />
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
  mixins: [loginRequired]
}
</script>
