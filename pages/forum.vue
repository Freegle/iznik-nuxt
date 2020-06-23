<template>
  <div class="w-100 bg-white text-center">
    <p class="pt-4">
      This should redirect you back to our discussion forum..  If it doesn't, mail geeks@ilovefreegle.org.
    </p>
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
  methods: {
    redirect() {
      window.location = 'https://forum.ilovefreegle.org'
    }
  }
}
</script>
