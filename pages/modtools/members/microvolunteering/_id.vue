<template>
  <div>
    <client-only>
      <ScrollToTop />
      <ModHelpMicrovolunteering />
      <GroupSelect v-model="groupid" modonly all remember="membersmicrovol" />

      <div v-for="item in items" :key="'item-' + item.id" class="p-0 mt-2">
        <ModMicrovolunteering :id="item.id" />
      </div>

      <NoticeMessage v-if="!items.length && !busy" class="mt-2">
        There are no items to show at the moment.
      </NoticeMessage>

      <infinite-loading :identifier="infiniteId" force-use-infinite-wrapper="body" :distance="distance" @infinite="loadMore">
        <span slot="no-results" />
        <span slot="no-more" />
        <span slot="spinner">
          <b-img-lazy src="~/static/loader.gif" alt="Loading" />
        </span>
      </infinite-loading>
    </client-only>
  </div>
</template>
<script>
import loginRequired from '@/mixins/loginRequired'
import createGroupRoute from '@/mixins/createGroupRoute'
import InfiniteLoading from 'vue-infinite-loading'
import ScrollToTop from '../../../../components/ScrollToTop'
import ModHelpMicrovolunteering from '../../../../components/ModHelpMicrovolunteering'
import GroupSelect from '~/components/GroupSelect'
import ModMicrovolunteering from '~/components/ModMicrovolunteering'
import NoticeMessage from '~/components/NoticeMessage'

export default {
  components: {
    GroupSelect,
    ModMicrovolunteering,
    ScrollToTop,
    ModHelpMicrovolunteering,
    NoticeMessage,
    InfiniteLoading
  },
  layout: 'modtools',
  mixins: [
    loginRequired,
    createGroupRoute('modtools/members/microvolunteering')
  ],
  data() {
    return {
      busy: false,
      context: null,
      distance: 1000,
      infiniteId: 0
    }
  },
  computed: {
    items() {
      const items = Object.values(this.$store.getters['microvolunteering/list'])
      items.sort(function(a, b) {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      })

      return items
    }
  },
  watch: {
    groupid(newVal) {
      this.context = null
      this.show = 0
      this.infiniteId++
      this.$store.dispatch('microvolunteering/clear')
    }
  },
  mounted() {
    this.$store.dispatch('microvolunteering/clear')
  },
  methods: {
    loadMore: function($state) {
      this.busy = true

      const before = Object.keys(this.$store.getters['microvolunteering/list'])
        .length

      this.$store
        .dispatch('microvolunteering/list', {
          context: this.context,
          groupid: this.groupid
        })
        .then(context => {
          this.context = context

          const after = Object.keys(
            this.$store.getters['microvolunteering/list']
          ).length

          this.busy = false

          if (before !== after) {
            $state.loaded()
          } else {
            $state.complete()
          }
        })
    }
  }
}
</script>
<style scoped>
select {
  max-width: 300px;
}
</style>
