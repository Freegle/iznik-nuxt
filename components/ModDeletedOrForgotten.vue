<template>
  <div v-if="user && user.deleted">
    <NoticeMessage v-if="!user.forgotten" variant="danger">
      <p>
        This user deleted their account on <strong>{{ dateonly(user.deleted) }}</strong>
        , but their data has not yet been removed.  This happens about two weeks later, to allow them to
        change their minds.
      </p>
      <p>
        Meanwhile other freeglers won't see their personal data, posts or chat messages.  Posts and chat messages
        they've sent won't be emailed out either.
      </p>
      <p>
        They can recover their account by logging in again - they'll see a warning and a button to recover the account.
      </p>
    </NoticeMessage>
    <NoticeMessage v-else variant="danger" class="mt-2">
      <p>
        This account was deleted on {{ dateonly(user.forgotten) }} and the data was removed on {{ dateonly(user.forgotten) }}.
      </p>
    </NoticeMessage>
  </div>
</template>
<script>
import NoticeMessage from '~/components/NoticeMessage'

export default {
  components: {
    NoticeMessage
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>
