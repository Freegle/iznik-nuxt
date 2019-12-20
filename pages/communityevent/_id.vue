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
// TODO Handle deleted events, which return an error of 3 on the fetch.  Ditto volunteer ops.
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
  },
  head() {
    const meta = [
      {
        hid: 'description',
        name: 'description',
        content: this.event.description
      },
      { hid: 'og:title', property: 'og:title', content: this.event.title },
      {
        hid: 'og:description',
        property: 'og:description',
        content: this.event.description
      },

      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: this.event.title
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: this.event.description
      }
    ]

    const image = this.event.photo
      ? this.event.photo.path
      : process.env.USER_SITE + '/icon.png'

    meta.push({
      hid: 'og:image',
      property: 'og:image',
      content: image
    })

    meta.push({
      hid: 'twitter:image',
      property: 'twitter:image',
      content: image
    })

    return {
      title: this.event.title,
      meta: meta
    }
  }
}
</script>
