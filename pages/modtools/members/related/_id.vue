<template>
  <div>
    <client-only>
      <NoticeMessage variant="info" class="mt-2 mb-2">
        <p>
          These are members who have used the same device for different users.  By merging members who are
          really the same person, we can help them avoid confusion and missing messages.
        </p>
        <p>We think they're probably the same person if:</p>
        <ul>
          <li>
            They have a similar name or email, and
          </li>
          <ul>
            <li>they have groups in common, or</li>
            <li>one of them has joined a group and one hasn't, or</li>
            <li>they are both active on the same device on the same day</li>
          </ul>
        </ul>
        <p>
          If we don't think they're the same person, then sleuthing is required using Support Tools.  If they are
          genuinely different users then we should ignore this report.
        </p>
        <p>If we think they are the same person, then we consider a merge:</p>
        <ul>
          <li>If they have joined groups from both users, we suggest you ask them which they prefer.  We can't really decide.</li>
          <li>If they've joined groups from only one of them, we suggest merging into that one.  The other was probably logging in accidentally a different way.</li>
          <li>If they've not joined groups from either user:</li>
          <ul>
            <li>If they're both active on the same day, we suggest you ask them which they prefer.  We can't really decide.</li>
            <li>Otherwise we suggest merging into the most recently active.  The other is probably an old login or one they've forgotten about (but might remember later and get confused).</li>
          </ul>
        </ul>
      </NoticeMessage>
      <GroupSelect v-model="groupid" all modonly />
      <div v-for="member in visibleMembers" :key="'memberlist-' + member.id" class="p-0 mt-2">
        <ModRelatedMember :member="member" />
      </div>

      <NoticeMessage v-if="!members.length && !busy" class="mt-2">
        There are no related members at the moment.
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
import NoticeMessage from '../../../../components/NoticeMessage'
import loginRequired from '@/mixins/loginRequired'
import modMembersPage from '@/mixins/modMembersPage'
import createGroupRoute from '@/mixins/createGroupRoute'
import ModRelatedMember from '@/components/ModRelatedMember'

export default {
  components: { ModRelatedMember, NoticeMessage },
  layout: 'modtools',
  mixins: [
    loginRequired,
    createGroupRoute('modtools/members/related'),
    modMembersPage
  ],
  data: function() {
    return {
      collection: 'Related'
    }
  },
  methods: {
    active(member) {
      return member.messagehistory
    }
  }
}
</script>
