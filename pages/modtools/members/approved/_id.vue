<template>
  <div>
    <client-only>
      <div class="d-flex justify-content-between">
        <GroupSelect v-model="groupid" modonly />
        <div class="d-flex">
          <ModMemberTypeSelect v-model="filter" />
          <b-btn variant="white" class="ml-2" @click="addMember">
            <v-icon name="plus" /> Add
          </b-btn>
          <ModAddMemberModal ref="addmodal" />
        </div>
        <ModMemberSearchbox v-model="search" :groupid="groupid" />
      </div>
      <div v-if="groupid">
        <p v-if="group" class="mt-1">
          This group has {{ group.membercount | pluralize('member', { includeNumber: true }) }}.
        </p>
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
      <NoticeMessage v-else variant="info" class="mt-2">
        Please select a community or search for someone across all your communities.
      </NoticeMessage>
    </client-only>
  </div>
</template>
<script>
import ModMember from '../../../../components/ModMember'
import NoticeMessage from '../../../../components/NoticeMessage'
import ModMemberSearchbox from '../../../../components/ModMemberSearchbox'
import ModMemberTypeSelect from '../../../../components/ModMemberTypeSelect'
import ModAddMemberModal from '../../../../components/ModAddMemberModal'
import loginRequired from '@/mixins/loginRequired'
import modMembersPage from '@/mixins/modMembersPage'
import createGroupRoute from '@/mixins/createGroupRoute'
import waitForRef from '@/mixins/waitForRef'

export default {
  components: {
    ModAddMemberModal,
    ModMemberTypeSelect,
    ModMemberSearchbox,
    NoticeMessage,
    ModMember
  },
  layout: 'modtools',
  mixins: [
    loginRequired,
    createGroupRoute('modtools/members/approved'),
    modMembersPage,
    waitForRef
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
  },
  methods: {
    addMember() {
      console.log('Wait for ref')
      this.waitForRef('addmodal', () => {
        console.log('Got')
        this.$refs.addmodal.show()
      })
    }
  }
}
</script>
