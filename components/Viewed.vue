<template>
  <b-card v-if="messages && messages.length" bg-light class="recentviews">
    <b-card-title title-tag="h2" class="header--size4">
      Recently Viewed
    </b-card-title>
    <div v-for="(message, index) in messages" :key="'message-' + message.id">
      <div :class="index > 1 ? 'd-none d-md-block' : ''">
        <nuxt-link :to="'/message/' + message.id">
          {{ message.subject }}
        </nuxt-link>
        <span class="small text-muted">
          {{ message.viewedat | timeago }}
        </span>
      </div>
    </div>
  </b-card>
</template>
<script>
export default {
  name: 'Viewed',
  computed: {
    messages() {
      return this.$store.getters['messages/getViewed']
    }
  },
  async mounted() {
    await this.$store.dispatch('messages/fetchViewed')
  }
}
</script>
