<template>
  <b-row v-if="invalid" class="m-0">
    <b-col cols="12" lg="6" class="p-0" offset-lg="3">
      <NoticeMessage variant="danger" class="mt-2">
        Sorry, that volunteer opportunity isn't around any more.
      </NoticeMessage>
    </b-col>
  </b-row>
  <div v-else>
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
import NoticeMessage from '../../components/NoticeMessage'
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'

const VolunteerOpportunity = () =>
  import('~/components/VolunteerOpportunity.vue')

export default {
  components: {
    NoticeMessage,
    VolunteerOpportunity
  },
  mixins: [loginOptional, buildHead],
  computed: {
    volunteering() {
      return this.$store.getters['volunteerops/get'](this.$route.params.id)
    }
  },
  async asyncData({ app, params, store }) {
    let invalid = false

    try {
      await store.dispatch('volunteerops/fetch', {
        id: params.id
      })
    } catch (e) {
      invalid = true
    }

    return {
      invalid: invalid
    }
  },
  head() {
    if (this.invalid) {
      return this.buildHead('Volunteer Opportunity #' + this.id)
    } else {
      return this.buildHead(
        this.volunteering.title,
        this.volunteering.description,
        this.volunteering.photo ? this.volunteering.photo.path : null
      )
    }
  }
}
</script>
