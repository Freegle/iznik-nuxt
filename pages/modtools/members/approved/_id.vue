<template>
  <div>
    <client-only>
      <ScrollToTop :prepend="groupName" />
      <div class="d-flex justify-content-between flex-wrap">
        <GroupSelect v-model="groupid" modonly remember="membersapproved" />
        <div v-if="groupid" class="d-flex">
          <ModMemberTypeSelect v-model="filter" />
          <b-btn v-if="groupid" variant="white" class="ml-2" @click="addMember">
            <v-icon name="plus" /> Add
          </b-btn>
          <b-btn v-if="groupid" variant="white" class="ml-2" @click="banMember">
            <v-icon name="trash-alt" /> Ban
          </b-btn>
          <ModAddMemberModal v-if="groupid" ref="addmodal" :groupid="groupid" />
          <ModBanMemberModal v-if="groupid" ref="banmodal" :groupid="groupid" />
          <ModMergeButton class="ml-2" />
          <ModMemberExportButton v-if="groupid" class="ml-2" :groupid="groupid" />
        </div>
        <ModMemberSearchbox v-model="search" :groupid="groupid" />
      </div>
      <div v-if="groupid">
        <p v-if="memberCount" class="mt-1">
          This group has {{ memberCount | pluralize('member', { includeNumber: true }) }}.
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
import ModMember from '../../../../components/ModMember'
import NoticeMessage from '../../../../components/NoticeMessage'
import ModMemberSearchbox from '../../../../components/ModMemberSearchbox'
import ModMemberTypeSelect from '../../../../components/ModMemberTypeSelect'
import ModAddMemberModal from '../../../../components/ModAddMemberModal'
import ModBanMemberModal from '../../../../components/ModBanMemberModal'
import ModMergeButton from '../../../../components/ModMergeButton'
import ModMemberExportButton from '../../../../components/ModMemberExportButton'
import ScrollToTop from '../../../../components/ScrollToTop'

export default {
  components: {
    ScrollToTop,
    ModMemberExportButton,
    ModMergeButton,
    ModAddMemberModal,
    ModBanMemberModal,
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
      filter: '0',
      memberCount: 0
    }
  },
  computed: {
    groupName() {
      if (this.groupid) {
        return this.$store.getters['group/get'](this.groupid)?.namedisplay
      }

      return null
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
  async mounted() {
    if (!this.groupid) {
      // If we have not selected a group, check if we are only a mod on one.  If so, then go to that group so that
      // we don't need to bother selecting it.  We do this here because the interaction with createGroupRoute would
      // be complex.
      let countmod = 0
      let lastmod = null
      this.myGroups.forEach(g => {
        if (g.role === 'Moderator' || g.role === 'Owner') {
          countmod++
          lastmod = g.id
        }
      })

      if (countmod === 1) {
        this.$router.push('/modtools/members/approved/' + lastmod)
      }
    } else {
      // Make sure we have the member count.
      await this.$store.dispatch('group/fetch', {
        id: this.groupid
      })
      const group = this.$store.getters['group/get'](this.groupid)
      this.memberCount = group.membercount
    }
  },
  methods: {
    addMember() {
      this.waitForRef('addmodal', () => {
        this.$refs.addmodal.show()
      })
    },
    banMember() {
      this.waitForRef('banmodal', () => {
        this.$refs.banmodal.show()
      })
    }
  }
}
</script>
