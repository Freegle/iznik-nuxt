<template>
  <div>
    <ExploreGroup v-if="id" :id="id" />
    <ExploreMap v-else />
  </div>
</template>
<script>
import loginOptional from '@/mixins/loginOptional.js'
const ExploreGroup = () => import('~/components/ExploreGroup.vue')
const ExploreMap = () => import('~/components/ExploreMap.vue')

export default {
  components: {
    ExploreGroup,
    ExploreMap
  },
  mixins: [loginOptional],
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
        types: ['Offer', 'Wanted']
      })
    }
  },
  created() {
    this.id = this.$route.params.id
  }
}
</script>
