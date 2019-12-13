<template>
  <div v-if="event">
    <b-row class="m-0">
      <b-col cols="0" md="3" class="d-none d-md-block" />
      <b-col cols="12" md="6" class="p-0">
        <CommunityEvent v-if="!event.pending" :summary="false" :event="event" class="mt-1" />
      </b-col>
      <b-col cols="0" md="3" class="d-none d-md-block" />
    </b-row>
  </div>
</template>
<script>
// TODO Handle invalid id.  Ditto in Volunteer Ops.
import loginOptional from '@/mixins/loginOptional.js'

const CommunityEvent = () => import('~/components/CommunityEvent.vue')

export default {
  components: {
    CommunityEvent
  },
  mixins: [loginOptional],
  computed: {
    event() {
      return this.$store.getters['communityevents/get'](this.$route.params.id)
    }
  },
  async asyncData({ app, params, store }) {
    await store.dispatch('communityevents/fetch', {
      id: params.id
    })
  }
}
</script>
