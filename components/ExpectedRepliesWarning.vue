<template>
  <div>
    <NoticeMessage variant="warning" class="mb-1">
      <p>
        <strong>{{ count | pluralize(['freegler is', 'freeglers are'], { includeNumber: true }) }} waiting for you to reply.</strong>
      </p>
      <p>
        Please don't leave them hanging!  Let them know if you're no longer interested, or other people will see that you haven't replied yet.
      </p>
      <div v-for="chat in chats" :key="'expectedreply-' + chat.id">
        <b-btn variant="primary" size="lg" @click="go(chat.id)">
          Reply to {{ chat.name }} now
        </b-btn>
      </div>
    </NoticeMessage>
  </div>
</template>
<script>
import NoticeMessage from './NoticeMessage'
export default {
  components: { NoticeMessage },
  props: {
    count: {
      type: Number,
      required: true
    },
    chats: {
      type: Array,
      required: true
    }
  },
  methods: {
    go(id) {
      this.$router.push('/chats/' + id)
    }
  }
}
</script>
