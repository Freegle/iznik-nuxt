<template>
  <div class="w-100 d-flex justify-content-center text-center">
    <b-img-lazy src="~/static/loader.gif" alt="Loading" />
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      engageid: null,
      action: null
    }
  },
  created() {
    this.engageid = this.$route.query.engageid
    this.action = this.$route.query.action
  },
  async mounted() {
    // Record the engagement.
    if (this.engageid) {
      await this.$axios.post(process.env.API + '/user', {
        engageid: this.engageid
      })
    }

    // Now route on to where we were supposed to go.
    this.$router.push('/' + (this.action ? this.action : ''))
  }
}
</script>
