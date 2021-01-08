<template>
  <div>
    <b-row class="m-0">
      <b-col cols="12" md="6" offset-md="3" class="bg-white">
        <h1>COVID Checklist</h1>
        <CovidCheckList v-if="!confirmed" force :msgid="msgid" @confirmed="doneConfirm" />
        <div v-else>
          <p v-if="tn">
            Thanks - you will be sent back to TrashNothing shortly.
          </p>
          <p v-else>
            Thanks - you can close this page now.
          </p>
        </div>
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
  },
  computed: {
    msgid() {
      return this.$route.query.msgid
    },
    tn() {
      return this.$route.query.tn
    }
  },
  methods: {
    doneConfirm() {
      if (this.tn) {
        setTimeout(() => {
          window.location = 'https://trashnothing.com'
        }, 5000)
      }

      this.confirmed = true
    }
  }
}
</script>
