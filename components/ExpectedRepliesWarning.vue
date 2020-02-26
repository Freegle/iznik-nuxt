<template>
  <div>
    <NoticeMessage variant="warning" class="mb-1">
      <p>
        <b>{{ count | pluralize(['freegler is', 'freeglers are'], { includeNumber: true }) }} waiting for you to reply.</b>
      </p>
      <p>
        Please don't leave them hanging!  Other people will see that you haven't replied yet.
      </p>
      <div v-for="chat in chats" :key="'expectedreply-' + chat.id">
        <b-btn variant="success" size="lg" @click="go(chat.id)">
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
  mounted() {
    // Record the show
    this.$api.bandit.shown({
      uid: 'rsvp',
      variant: 'warning'
    })
  },
  methods: {
    go(id) {
      this.$api.bandit.chosen({
        uid: 'rsvp',
        variant: 'warning'
      })

      this.$router.push('/chats/' + id)
    }
  }
}
</script>
