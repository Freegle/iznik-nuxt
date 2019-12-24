<template>
  <div v-if="volunteering">
    <b-row class="m-0">
      <b-col cols="0" md="3" class="d-none d-md-block" />
      <b-col cols="12" md="6" class="p-0">
        <VolunteerOpportunity v-if="!volunteering.pending" :summary="false" :volunteering="volunteering" class="mt-1" />
      </b-col>
      <b-col cols="0" md="3" class="d-none d-md-block" />
    </b-row>
  </div>
</template>
<script>
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'

const VolunteerOpportunity = () =>
  import('~/components/VolunteerOpportunity.vue')

export default {
  components: {
    VolunteerOpportunity
  },
  mixins: [loginOptional, buildHead],
  computed: {
    volunteering() {
      return this.$store.getters['volunteerops/get'](this.$route.params.id)
    }
  },
  async asyncData({ app, params, store }) {
    await store.dispatch('volunteerops/fetch', {
      id: params.id
    })
  },
  head() {
    return this.buildHead(
      this.volunteering.title,
      this.volunteering.description,
      this.volunteering.photo ? this.volunteering.photo.path : null
    )
  }
}
</script>
