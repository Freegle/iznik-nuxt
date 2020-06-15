<template>
  <div>
    <client-only>
      <ScrollToTop />
      <ModHelpFeedback />
      <div class="d-flex justify-content-between">
        <GroupSelect v-model="groupid" modonly all />
        <b-select v-model="filter">
          <option :value="null">
            All
          </option>
          <option value="Happy">
            Happy
          </option>
          <option value="Unhappy">
            Unhappy
          </option>
          <option value="Fine">
            Fine
          </option>
        </b-select>
      </div>
      <div v-for="member in visibleMembers" :key="'memberlist-' + member.id" class="p-0 mt-2">
        <ModMemberHappiness v-if="filterMatch(member.happiness)" :id="member.id" />
      </div>

      <NoticeMessage v-if="!members.length && !busy" class="mt-2">
        There are no items to show at the moment.
      </NoticeMessage>

      <infinite-loading :key="'infinite-' + groupid + '-' + filter" force-use-infinite-wrapper="body" :distance="distance" @infinite="loadMore">
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
import ModHelpFeedback from '../../../../components/ModHelpFeedback'
import ScrollToTop from '../../../../components/ScrollToTop'
import NoticeMessage from '@/components/NoticeMessage'
import loginRequired from '@/mixins/loginRequired'
import modMembersPage from '@/mixins/modMembersPage'
import createGroupRoute from '@/mixins/createGroupRoute'
import ModMemberHappiness from '@/components/ModMemberHappiness'

export default {
  components: {
    ScrollToTop,
    ModHelpFeedback,
    ModMemberHappiness,
    NoticeMessage
  },
  layout: 'modtools',
  mixins: [
    loginRequired,
    createGroupRoute('modtools/members/feedback'),
    modMembersPage
  ],
  data: function() {
    return {
      collection: 'Happiness',
      filter: 'Unhappy'
    }
  },
  watch: {
    filter() {
      console.log('Filter change')
      this.context = null
      this.show = 0
      this.$store.dispatch('members/clear')
    }
  },
  methods: {
    filterMatch(val) {
      if (!this.filter) {
        return true
      }

      if (this.filter === val) {
        return true
      }

      if (this.filter === 'Fine' && !val) {
        return true
      }

      return false
    }
  }
}
</script>
<style scoped>
select {
  max-width: 300px;
}
</style>
