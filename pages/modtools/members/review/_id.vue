<template>
  <div>
    <client-only>
      <div class="d-flex justify-content-between">
        <GroupSelect v-model="groupid" modonly :work="['spammembers', 'spammembersother']" />
      </div>
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
    </client-only>
  </div>
</template>
<script>
import ModMember from '@/components/ModMember'
import NoticeMessage from '@/components/NoticeMessage'
import loginRequired from '@/mixins/loginRequired'
import modMembersPage from '@/mixins/modMembersPage'
import createGroupRoute from '@/mixins/createGroupRoute'

export default {
  components: { NoticeMessage, ModMember },
  layout: 'modtools',
  mixins: [
    loginRequired,
    createGroupRoute('modtools/members/review'),
    modMembersPage
  ],
  data: function() {
    return {
      collection: 'Spam'
    }
  }
}
</script>
