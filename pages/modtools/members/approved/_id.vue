<template>
  <div>
    <client-only>
      <div class="d-flex justify-content-between">
        <GroupSelect v-model="groupid" modonly />
        <ModMemberTypeSelect v-model="filter" />
        <ModMemberSearchbox v-model="search" :groupid="parseInt(groupid)" :disabled="!parseInt(groupid)" />
      </div>
      <div v-if="groupid">
        <div v-for="member in visibleMembers" :key="'memberlist-' + member.id" class="p-0 mt-2">
          <ModMember :member="member" />
        </div>

        <NoticeMessage v-if="!members.length && !busy" class="mt-2">
          There are no members at the moment.
        </NoticeMessage>

        <infinite-loading :key="'infinite-' + groupid + '-' + filter" force-use-infinite-wrapper="body" :distance="distance" @infinite="loadMore">
          <span slot="no-results" />
          <span slot="no-more" />
          <span slot="spinner">
            <b-img-lazy src="~/static/loader.gif" alt="Loading" />
          </span>
        </infinite-loading>
      </div>
      <NoticeMessage v-else variant="info">
        Please select a group.
      </NoticeMessage>
    </client-only>
  </div>
</template>
<script>
import ModMember from '../../../../components/ModMember'
import NoticeMessage from '../../../../components/NoticeMessage'
import ModMemberSearchbox from '../../../../components/ModMemberSearchbox'
import ModMemberTypeSelect from '../../../../components/ModMemberTypeSelect'
import loginRequired from '@/mixins/loginRequired'
import modMembersPage from '@/mixins/modMembersPage'
import createGroupRoute from '@/mixins/createGroupRoute'

export default {
  components: {
    ModMemberTypeSelect,
    ModMemberSearchbox,
    NoticeMessage,
    ModMember
  },
  layout: 'modtools',
  mixins: [
    loginRequired,
    createGroupRoute('modtools/members/approved'),
    modMembersPage
  ],
  data: function() {
    return {
      collection: 'Approved',
      search: null,
      filter: '0'
    }
  },
  watch: {
    search(newVal) {
      if (!newVal) {
        // Cleared box.
        this.$router.push('/modtools/members/approved/' + this.groupid)
      }
    }
  }
}
</script>
