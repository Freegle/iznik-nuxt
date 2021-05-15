<template>
  <b-alert show variant="info" class="d-block d-sm-none mb-1">
    <p class="font-weight-bold">
      We've sent your message.
    </p>
    <p>
      When they reply, it'll be in the
      <nuxt-link to="/chats">
        <v-icon name="comments" />&nbsp;Chats
      </nuxt-link> section, and by email.  Check your spam folder!
    </p>
  </b-alert>
</template>
<script>
export default {}
</script>
