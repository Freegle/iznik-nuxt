<template>
  <div>
    <client-only>
      <ScrollToTop />
      <div class="d-flex justify-content-between flex-wrap">
        <GroupSelect v-model="groupid" modonly remember="membersapproved" />
        <div v-if="groupid" class="d-flex">
          <ModMemberTypeSelect v-model="filter" />
          <b-btn v-if="groupid" variant="white" class="ml-2" @click="addMember">
            <v-icon name="plus" /> Add
          </b-btn>
          <ModAddMemberModal v-if="groupid" ref="addmodal" :groupid="groupid" />
          <ModMergeButton class="ml-2" />
          <ModMemberExportButton v-if="groupid" class="ml-2" :groupid="groupid" />
        </div>
        <ModMemberSearchbox v-model="search" :groupid="groupid" />
      </div>
      <div v-if="groupid">
        <p v-if="group && group.membercount" class="mt-1">
          This group has {{ group.membercount | pluralize('member', { includeNumber: true }) }}.
        </p>
        <div v-for="member in visibleMembers" :key="'memberlist-' + member.id" class="p-0 mt-2">
          <ModMember :member="member" :actions="false" :expand-comments="parseInt(filter) === 1" />
        </div>

        <NoticeMessage v-if="!members.length && !busy" class="mt-2">
          There are no members to show at the moment.
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
import loginRequired from '@/mixins/loginRequired'
import modMembersPage from '@/mixins/modMembersPage'
import createGroupRoute from '@/mixins/createGroupRoute'
import waitForRef from '@/mixins/waitForRef'
import ModMember from '../../../../components/ModMember'
import NoticeMessage from '../../../../components/NoticeMessage'
import ModMemberSearchbox from '../../../../components/ModMemberSearchbox'
import ModMemberTypeSelect from '../../../../components/ModMemberTypeSelect'
import ModAddMemberModal from '../../../../components/ModAddMemberModal'
import ModMergeButton from '../../../../components/ModMergeButton'
import ModMemberExportButton from '../../../../components/ModMemberExportButton'
import ScrollToTop from '../../../../components/ScrollToTop'

export default {
  components: {
    ScrollToTop,
    ModMemberExportButton,
    ModMergeButton,
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
  mounted() {
    if (!this.groupid) {
      // If we have not selected a group, check if we are only a mod on one.  If so, then go to that group so that
      // we don't need to bother selecting it.  We do this here because the interaction with createGroupRoute would
      // be complex.
      const groups = this.$store.getters['auth/groups']
      let countmod = 0
      let lastmod = null
      groups.forEach(g => {
        if (g.role === 'Moderator' || g.role === 'Owner') {
          countmod++
          lastmod = g.id
        }
      })

      if (countmod === 1) {
        this.$router.push('/modtools/members/approved/' + lastmod)
      }
    }
  },
  methods: {
    addMember() {
      this.waitForRef('addmodal', () => {
        this.$refs.addmodal.show()
      })
    }
  }
}
</script>
