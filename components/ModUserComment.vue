<template>
  <NoticeMessage variant="warning">
    <span v-if="comment.user1">{{ comment.user1 }}<br></span>
    <span v-if="comment.user2">{{ comment.user2 }}<br></span>
    <span v-if="comment.user3">{{ comment.user3 }}<br></span>
    <span v-if="comment.user4">{{ comment.user4 }}<br></span>
    <span v-if="comment.user5">{{ comment.user5 }}<br></span>
    <span v-if="comment.user6">{{ comment.user6 }}<br></span>
    <span v-if="comment.user7">{{ comment.user7 }}<br></span>
    <span v-if="comment.user8">{{ comment.user8 }}<br></span>
    <span v-if="comment.user9">{{ comment.user9 }}<br></span>
    <span v-if="comment.user10">{{ comment.user10 }}<br></span>
    <span v-if="comment.user11">{{ comment.user11 }}<br></span>
    <span v-if="comment.byuser" class="small">
      <v-icon name="tag" /> by {{ comment.byuser.displayname }}
      <span class="small">
        #{{ comment.byuser.id }}
      </span>
    </span>
  </NoticeMessage>
</template>
<script>
import NoticeMessage from './NoticeMessage'
export default {
  components: { NoticeMessage },
  props: {
    comment: {
      type: Object,
      required: true
    }
  }
}
</script>
