<template>
  <div style="white-space: normal" :class="notification.seen ? '' : 'bg-info'" @click="click" @mouseover="markSeen">
    <notification-loved-post v-if="notification.type === 'LovedPost'" :notification="notification" />
    <notification-loved-comment v-else-if="notification.type === 'LovedComment'" :notification="notification" />
    <notification-comment-on-post v-else-if="notification.type === 'CommentOnYourPost'" :notification="notification" />
    <notification-comment-on-comment v-else-if="notification.type === 'CommentOnCommented'" :notification="notification" />
    <notification-exhort v-else-if="notification.type === 'Exhort'" :notification="notification" />
    <notification-about-me v-else-if="notification.type === 'AboutMe'" :notification="notification" @showModal="showModal" />
    <notification-membership-pending v-else-if="notification.type === 'MembershipPending'" :notification="notification" />
    <notification-membership-approved v-else-if="notification.type === 'MembershipApproved'" :notification="notification" />
    <notification-membership-rejected v-else-if="notification.type === 'MembershipRejected'" :notification="notification" />
    <span v-else-if="notification.type === 'TryFeed'" />
    <span v-else>
      Unknown notification {{ notification.type }}
    </span>
  </div>
</template>
<script>
// TODO MINOR Some people haven't had Pavlovian training from Facebook to click on red notifications.  Consider a one-off
//   popup to alert people to go and look at notifications or chat replies the first time they get one.
const NotificationLovedPost = () => import('~/components/NotificationLovedPost')
const NotificationLovedComment = () =>
  import('~/components/NotificationLovedComment')
const NotificationCommentOnPost = () =>
  import('~/components/NotificationCommentOnPost')
const NotificationCommentOnComment = () =>
  import('~/components/NotificationCommentOnComment')
const NotificationExhort = () => import('~/components/NotificationExhort')
const NotificationAboutMe = () => import('~/components/NotificationAboutMe')
const NotificationMembershipPending = () =>
  import('~/components/NotificationMembershipPending')
const NotificationMembershipApproved = () =>
  import('~/components/NotificationMembershipApproved')
const NotificationMembershipRejected = () =>
  import('~/components/NotificationMembershipRejected')

export default {
  components: {
    NotificationLovedPost,
    NotificationLovedComment,
    NotificationCommentOnPost,
    NotificationCommentOnComment,
    NotificationExhort,
    NotificationAboutMe,
    NotificationMembershipPending,
    NotificationMembershipApproved,
    NotificationMembershipRejected
  },
  inheritAttrs: false,
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  methods: {
    markSeen() {
      if (!this.notification.seen) {
        this.$store.dispatch('notifications/seen', {
          id: this.notification.id
        })
      }
    },
    click() {
      this.markSeen()

      if (this.notification.url) {
        window.open(this.notification.url)
      } else if (this.notification.newsfeed) {
        this.$router.push('/chitchat/' + this.notification.newsfeed.id)
      }
    },
    showModal() {
      this.$emit('showModal')
    }
  }
}
</script>
