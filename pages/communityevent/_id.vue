<template>
  <b-row v-if="invalid" class="m-0">
    <b-col cols="12" lg="6" class="p-0" offset-lg="3">
      <NoticeMessage variant="danger" class="mt-2">
        Sorry, that community event isn't around any more.
      </NoticeMessage>
    </b-col>
  </b-row>
  <div v-else>
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
import NoticeMessage from '../../components/NoticeMessage'
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'

const CommunityEvent = () => import('~/components/CommunityEvent.vue')

export default {
  components: {
    NoticeMessage,
    CommunityEvent
  },
  mixins: [loginOptional, buildHead],
  computed: {
    event() {
      return this.$store.getters['communityevents/get'](this.$route.params.id)
    }
  },
  async asyncData({ app, params, store }) {
    let invalid = false

    if (params.id) {
      try {
        await store.dispatch('communityevents/fetch', {
          id: params.id
        })
      } catch (e) {
        invalid = true
      }
    } else {
      invalid = true
    }

    return {
      invalid: invalid
    }
  },
  mounted() {
    if (!this.$route.params.id) {
      // Probably here by mistake - send to the list of all of them.
      this.$router.push('/communityevents')
    }
  },
  head() {
    if (this.invalid) {
      return this.buildHead('Community Event #' + this.id)
    } else {
      return this.buildHead(
        this.event.title,
        this.event.description,
        this.event.photo ? this.event.photo.path : null
      )
    }
  }
}
</script>
