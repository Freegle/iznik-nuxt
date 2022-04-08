<template>
  <div>
    <ModHelpPublicity />
    <ModMissingFacebook />
    <NoticeMessage v-if="(!items || !items.length) && (!popularPosts || !popularPosts.length)" variant="info" class="mt-2">
      There are no publicity items to review at the moment.
    </NoticeMessage>
    <div v-for="item in items" :key="'item-' + item.id" class="mt-2">
      <ModSocialAction :item="item" />
    </div>
    <div v-for="item in popularPosts" :key="'item-' + item.id" class="mt-2">
      <ModPopularPost :item="item" />
    </div>
  </div>
</template>
<script>
import loginRequired from '@/mixins/loginRequired.js'
import ModSocialAction from '../../components/ModSocialAction'
import ModPopularPost from '../../components/ModPopularPost'
import ModHelpPublicity from '../../components/ModHelpPublicity'
import ModMissingFacebook from '../../components/ModMissingFacebook'
import NoticeMessage from '~/components/NoticeMessage'

export default {
  layout: 'modtools',
  components: {
    ModMissingFacebook,
    ModHelpPublicity,
    ModSocialAction,
    ModPopularPost,
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
    },
    popularPosts() {
      const items = this.$store.getters['publicity/popularposts']

      if (items) {
        return Object.values(items).sort(function(a, b) {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
      }

      return []
    }
  },
  async mounted() {
    await this.$store.dispatch('publicity/clear')
    await this.$store.dispatch('publicity/fetch', {
      reviewed: 0
    })
    console.log('Fetched publicity')
  }
}
</script>
