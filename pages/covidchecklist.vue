<template>
  <div>
    <b-row class="m-0">
      <b-col cols="12" md="6" offset-md="3" class="bg-white">
        <h1>COVID Checklist</h1>
        <CovidCheckList v-if="!confirmed" force @confirmed="confirmed = true" />
        <p v-else>
          Thanks - you can close this page now.
        </p>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import loginRequired from '@/mixins/loginRequired.js'
import CovidCheckList from '@/components/CovidCheckList'

export default {
  components: {
    CovidCheckList
  },
  mixins: [loginRequired],
  data: function() {
    return {
      confirmed: false
    }
  }
}
</script>
