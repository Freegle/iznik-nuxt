<template>
  <div style="white-space: normal" @click="click">
    <notification-loved-post v-if="notification.type === 'LovedPost'" :notification="notification" />
    <notification-loved-comment v-else-if="notification.type === 'LovedComment'" :notification="notification" />
    <notification-comment-on-post v-else-if="notification.type === 'CommentOnYourPost'" :notification="notification" />
    <notification-comment-on-comment v-else-if="notification.type === 'CommentOnCommented'" :notification="notification" />
    <notification-exhort v-else-if="notification.type === 'Exhort'" :notification="notification" />
    <notification-about-me v-else-if="notification.type === 'AboutMe'" :notification="notification" @showModal="showModal" />
    <span v-else>
      Unknown notification {{ notification.type }}
    </span>
  </div>
</template>
<script>
import NotificationLovedPost from '~/components/NotificationLovedPost'
import NotificationLovedComment from '~/components/NotificationLovedComment'
import NotificationCommentOnPost from '~/components/NotificationCommentOnPost'
import NotificationCommentOnComment from '~/components/NotificationCommentOnComment'
import NotificationExhort from '~/components/NotificationExhort'
import NotificationAboutMe from '~/components/NotificationAboutMe'

export default {
  components: {
    NotificationLovedPost,
    NotificationLovedComment,
    NotificationCommentOnPost,
    NotificationCommentOnComment,
    NotificationExhort,
    NotificationAboutMe
    // TODO Others
    // const TYPE_TRY_FEED = 'TryFeed';
    // const TYPE_MEMBERSHIP_PENDING = 'MembershipPending';
    // const TYPE_MEMBERSHIP_APPROVED = 'MembershipApproved';
    // const TYPE_MEMBERSHIP_REJECTED = 'MembershipRejected';
  },
  inheritAttrs: false,
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  methods: {
    click() {
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
