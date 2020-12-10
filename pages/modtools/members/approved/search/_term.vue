<template>
  <div>
    <client-only>
      <div class="d-flex justify-content-between">
        <GroupSelect v-model="groupid" modonly />
        <ModMergeButton class="ml-2" />
        <ModMemberSearchbox v-model="search" />
      </div>
      <div>
        <div v-for="member in visibleMembers" :key="'memberlist-' + member.id" class="p-0 mt-2">
          <ModMember :member="member" />
        </div>

        <NoticeMessage v-if="!members.length && !busy" class="mt-2">
          There are no members at the moment.
        </NoticeMessage>

        <infinite-loading :key="'infinite-' + groupid" force-use-infinite-wrapper="body" :distance="distance" @infinite="loadMore">
          <span slot="no-results" />
          <span slot="no-more" />
          <span slot="spinner">
            <b-img-lazy src="~/static/loader.gif" alt="Loading" />
          </span>
        </infinite-loading>
      </div>
    </client-only>
  </div>
</template>
<script>
import ModMember from '@/components/ModMember'
import NoticeMessage from '@/components/NoticeMessage'
import loginRequired from '@/mixins/loginRequired'
import modMembersPage from '@/mixins/modMembersPage'
import ModMemberSearchbox from '@/components/ModMemberSearchbox'
import ModMergeButton from '../../../../../components/ModMergeButton'

export default {
  components: { ModMergeButton, ModMemberSearchbox, NoticeMessage, ModMember },
  layout: 'modtools',
  mixins: [loginRequired, modMembersPage],
  data: function() {
    return {
      collection: 'Approved',
      groupid: null,
      search: null
    }
  },
  watch: {
    groupid(newVal) {
      if (newVal) {
        this.$router.push(
          '/modtools/members/approved/search/' + newVal + '/' + this.search
        )
      }
    },
    search(newVal) {
      if (!newVal) {
        // Cleared box.
        this.$router.push('/modtools/members/approved/' + this.groupid)
      }
    }
  },
  created() {
    this.groupid = parseInt(this.$route.params.id)
    this.search = this.$route.params.term
  }
}
</script>
