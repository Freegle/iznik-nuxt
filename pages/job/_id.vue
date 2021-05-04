<template>
  <div>
    <client-only>
      <b-row class="m-0">
        <b-col cols="12" lg="6" class="p-0" offset-lg="3">
          <NoticeMessage v-if="invalid">
            <p>
              Sorry, that job is no longer available.
            </p>
            <b-btn to="/jobs" variant="primary" size="lg">
              View more jobs
            </b-btn>
          </NoticeMessage>
          <div v-else class="d-flex justify-content-around">
            <b-img-lazy src="~/static/loader.gif" alt="Loading..." />
          </div>
        </b-col>
      </b-row>
    </client-only>
  </div>
</template>
<script>
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
import NoticeMessage from '@/components/NoticeMessage'

export default {
  components: { NoticeMessage },
  mixins: [loginOptional, buildHead],
  data: function() {
    return {
      id: null,
      invalid: false
    }
  },
  created() {
    this.id = parseInt(this.$route.params.id) || null
  },
  async mounted() {
    await this.$store.dispatch('jobs/clear')

    if (this.id) {
      await this.$store.dispatch('jobs/fetch', {
        id: this.id,
        force: true
      })

      const jobs = this.$store.getters['jobs/list']

      let found = false

      jobs.forEach(async j => {
        if (parseInt(j.id) === parseInt(this.id)) {
          found = true
          await this.$store.dispatch('jobs/log', {
            link: j.url
          })

          window.location = j.url
        }
      })

      if (!found) {
        this.invalid = true
      }
    }
  },
  head() {
    return this.buildHead('Job')
  }
}
</script>
