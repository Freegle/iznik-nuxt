<template>
  <div>
    <p>This should redirect you back to Discourse.  If it doesn't, mail geeks@ilovefreegle.org.</p>
    <b-img src="~/static/loader.gif" alt="Loading" />
  </div>
</template>
<script>
import loginRequired from '@/mixins/loginRequired.js'

export default {
  mixins: [loginRequired],
  watch: {
    myid(newVal, oldVal) {
      if (!oldVal && newVal) {
        this.redirect()
      }
    }
  },
  mounted() {
    if (this.myid) {
      this.redirect()
    }
  },
  layout: 'modtools',
  methods: {
    redirect() {
      window.location = 'https://discourse.ilovefreegle.org'
    }
  }
}
</script>
