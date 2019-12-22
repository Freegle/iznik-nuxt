<template>
  <div>
    <ExploreGroup v-if="id" :id="id" />
    <ExploreMap v-else />
  </div>
</template>
<script>
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
const ExploreGroup = () => import('~/components/ExploreGroup.vue')
const ExploreMap = () => import('~/components/ExploreMap.vue')

export default {
  components: {
    ExploreGroup,
    ExploreMap
  },
  mixins: [loginOptional, buildHead],
  data: function() {
    return {
      id: null
    }
  },
  async asyncData({ app, params, store }) {
    if (params.id) {
      // We need to populate the store on the server so that SSR works.  We can only do this in asyncData - mounted()
      // in the ExploreGroup component is too late.
      //
      // Get the group and approved messages for this group.  We're only interested in showing OFFERs and WANTEDs, and
      // ask for summary info for speed.
      await store.dispatch('group/fetch', {
        id: params.id
      })

      const group = store.getters['group/get'](params.id)

      await store.dispatch('messages/fetchMessages', {
        groupid: group.id,
        collection: 'Approved',
        summary: true,
        types: ['Offer', 'Wanted'],
        limit: process.browser ? 5 : 100 // During SSR fetch more, for better SEO.
      })
    } else {
      await store.dispatch('group/list', {
        grouptype: 'Freegle'
      })
    }

    return {
      asyncGroupId: params.id
    }
  },
  created() {
    this.id = this.$route.params.id
  },
  head() {
    let group

    if (this.asyncGroupId) {
      group = this.$store.getters['group/get'](this.asyncGroupId)
    }

    if (this.id) {
      return this.buildHead(
        'Explore ' + group.namedisplay,
        group.tagline,
        group.profile
      )
    } else {
      return this.buildHead(
        'Explore Freegle Groups',
        "There are lots of lovely communities of freeglers across the UK. Shall we see what they're up to?",
        null
      )
    }
  }
}
</script>
