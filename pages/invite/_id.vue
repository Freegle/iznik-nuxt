<template>
  <b-row class="m-0">
    <b-col cols="0" md="3" />
    <b-col cols="12" md="6" class="mt-2 text-center">
      <b-img-lazy src="~/static/loader.gif" alt="Loading" />
    </b-col>
  </b-row>
</template>
<script>
import buildHead from '@/mixins/buildHead.js'

export default {
  mixins: [buildHead],
  created() {
    this.id = this.$route.params.id
  },
  async mounted() {
    if (this.id) {
      // Record the acceptance
      await this.$store.dispatch('invitations/edit', {
        id: this.id,
        outcome: 'Accepted'
      })

      this.$router.push('/')
    } else {
      // Probably they're looking for the Spread page.
      this.$router.push('/spread')
    }
  },
  head() {
    return this.buildHead('Invitation', "You've been invited to Freegle")
  }
}
</script>
