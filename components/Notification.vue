<template>
  <div style="white-space: normal" @click="click">
    <notification-loved-post v-if="notification.type === 'LovedPost'" :notification="notification" />
    <notification-loved-comment v-else-if="notification.type === 'LovedComment'" :notification="notification" />
    <notification-comment-on-post v-else-if="notification.type === 'CommentOnYourPost'" :notification="notification" />
    <notification-comment-on-comment v-else-if="notification.type === 'CommentOnCommented'" :notification="notification" />
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

export default {
  components: {
    NotificationLovedPost,
    NotificationLovedComment,
    NotificationCommentOnPost,
    NotificationCommentOnComment
    // TODO Others
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
      this.$router.push('/chitchat/' + this.notification.newsfeed.id)
    }
  }
}
</script>
