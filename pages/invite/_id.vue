<template>
  <b-row class="m-0">
    <b-col cols="0" md="3" />
    <b-col cols="12" md="6" class="mt-2 text-center">
      <b-img-lazy src="~/static/loader.gif" />
    </b-col>
  </b-row>
</template>
<script>
export default {
  created() {
    this.id = this.$route.params.id
  },
  async mounted() {
    // Record the acceptance
    await this.$store.dispatch('invitations/edit', {
      id: this.id,
      outcome: 'Accepted'
    })

    this.$router.push('/')
  }
}
</script>
