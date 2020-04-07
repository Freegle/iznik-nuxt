<template>
  <div>
    <client-only>
      <ModHelpRelated />
      <GroupSelect v-model="groupid" all modonly systemwide :work="['relatedmembers']" />
      <div v-for="member in visibleMembers" :key="'memberlist-' + member.id" class="p-0 mt-2">
        <ModRelatedMember :member="member" />
      </div>

      <NoticeMessage v-if="!members.length && !busy" class="mt-2">
        There are no related members at the moment.
      </NoticeMessage>

      <infinite-loading :key="'infinite-' + groupid + '-' + members.length" force-use-infinite-wrapper="body" :distance="distance" @infinite="loadMore">
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
import NoticeMessage from '@/components/NoticeMessage'
import ModHelpRelated from '@/components/ModHelpRelated'
import loginRequired from '@/mixins/loginRequired'
import modMembersPage from '@/mixins/modMembersPage'
import ModRelatedMember from '@/components/ModRelatedMember'

export default {
  components: { ModHelpRelated, ModRelatedMember, NoticeMessage },
  layout: 'modtools',
  mixins: [loginRequired, modMembersPage],
  data: function() {
    return {
      collection: 'Related',
      groupid: null
    }
  },
  computed: {
    members() {
      return this.$store.getters['members/getAll']
    },
    visibleMembers() {
      const ret = this.members.filter(member => {
        if (this.groupid <= 0) {
          // No group filter
          return true
        }

        let found = false
        member.memberof.forEach(group => {
          if (parseInt(group.id) === this.groupid) {
            found = true
          }
        })

        member.relatedto.memberof.forEach(group => {
          if (parseInt(group.id) === this.groupid) {
            found = true
          }
        })

        return found
      })

      return ret
    }
  },
  methods: {
    active(member) {
      return member.messagehistory
    }
  }
}
</script>
