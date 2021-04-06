<template>
  <client-only>
    <div class="d-flex justify-content-around">
      <b-img-lazy  src="~/static/loader.gif" alt="Loading..." />
    </div>
  </client-only>
</template>
<script>
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'

export default {
  mixins: [loginOptional, buildHead],
  data: function() {
    return {
      id: null
    }
  },
  created() {
    this.id = parseInt(this.$route.params.id) || null
  },
  mounted() {
    await this.$store.dispatch('jobs/clear')

    if (this.id) {
      await this.$store.dispatch('jobs/fetch', {
        id: this.id,
        force: true
      })

      let jobs = this.$store.getters['jobs/list']

      jobs.forEach(j => {
        if (parseInt(j.id) === parseInt(this.id)) {
          window.location = j.url
        }
      })
    }
  },
  head() {
    return this.buildHead(
      'Job'
    )
  }
}
</script>
