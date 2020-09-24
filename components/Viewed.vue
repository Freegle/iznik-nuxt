<template>
  <div v-if="messages && messages.length">
    <b-card v-if="show" bg-light class="recentviews">
      <b-btn variant="link" class="float-right" @click="hideit">
        Hide this
      </b-btn>
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
    <div v-else class="text-info text-right clickme" @click="showit">
      Show recently viewed posts.
    </div>
  </div>
</template>
<script>
export default {
  name: 'Viewed',
  computed: {
    messages() {
      return this.$store.getters['messages/getViewed']
    },
    show() {
      return !this.$store.getters['misc/get']('hideviewed')
    }
  },
  async mounted() {
    await this.$store.dispatch('messages/fetchViewed')
  },
  methods: {
    hideit() {
      this.$store.dispatch('misc/set', {
        key: 'hideviewed',
        value: true
      })
    },
    showit() {
      this.$store.dispatch('misc/set', {
        key: 'hideviewed',
        value: false
      })
    }
  }
}
</script>
