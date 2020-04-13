<template>
  <div>
    <ModHelpPublicity />
    <ModMissingFacebook />
    <NoticeMessage v-if="!items || !items.length" variant="info" class="mt-2">
      There are no publicity items to review at the moment.
    </NoticeMessage>
    <div v-for="item in items" :key="'item-' + item.id" class="mt-2">
      <ModSocialAction :item="item" />
    </div>
  </div>
</template>
<script>
import ModSocialAction from '../../api/ModSocialAction'
import ModHelpPublicity from '../../components/ModHelpPublicity'
import ModMissingFacebook from '../../components/ModMissingFacebook'
import NoticeMessage from '@/components/NoticeMessage'
import loginRequired from '@/mixins/loginRequired.js'

export default {
  layout: 'modtools',
  components: {
    ModMissingFacebook,
    ModHelpPublicity,
    ModSocialAction,
    NoticeMessage
  },
  mixins: [loginRequired],
  computed: {
    items() {
      const items = this.$store.getters['publicity/list']

      if (items) {
        return Object.values(items).sort(function(a, b) {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
      }

      return []
    }
  },
  async asyncData({ app, params, store }) {
    await store.dispatch('publicity/clear')
    await store.dispatch('publicity/fetch', {
      reviewed: 0
    })
  }
}
</script>
