<template>
  <b-col>
    <b-row class="m-0">
      <b-col cols="0" md="3">
        Community Events go here
      </b-col>
      <b-col cols="12" md="6" class="p-0">
        <b-card
          class="mt-2"
          border-variant="info"
          header="info"
          header-bg-variant="info"
          header-text-variant="white"
        >
          <template slot="header">
            <span>
              <v-icon name="gift" /> Your OFFERs
            </span>
          </template>
          <b-card-text class="text-center">
            <span class="text-muted">
              Stuff you're giving away.
            </span>
            <div v-for="(message, $index) in messages" :key="$index" class="p-0 text-left mt-1">
              <MyMessage v-if="message.type === 'Offer'" :message="message" :messages="messages" />
            </div>
          </b-card-text>
        </b-card>
      </b-col>
      <b-col cols="0" md="3">
        Volunteer ops and ads go here
      </b-col>
    </b-row>
  </b-col>
</template>
<style scoped>
</style>
<script>
import MyMessage from '~/components/MyMessage.vue'
import loginRequired from '@/mixins/loginRequired.js'
// TODO Availability

export default {
  components: {
    MyMessage
  },
  mixins: [loginRequired],
  data() {
    return {
      id: null,
      messages: [],
      busy: false,
      context: null
    }
  },
  computed: {},
  mounted() {
    // Ensure we have no cached messages for other searches/groups
    this.$store.dispatch('messages/clear')
    this.loadMore()
  },
  methods: {
    async loadMore() {
      await this.$store.dispatch('auth/fetchUser', {
        components: ['me', 'groups']
      })

      const me = this.$store.state.auth.user
      const currentCount = this.messages.length

      this.$store
        .dispatch('messages/fetchMessages', {
          collection: 'AllUser',
          summary: true,
          types: ['Offer', 'Wanted'],
          fromuser: me.id,
          context: this.context
        })
        .then(() => {
          this.busy = false

          this.messages = this.$store.getters['messages/getAll']()
          this.context = this.$store.getters['messages/getContext']()

          if (currentCount !== this.messages.length) {
            this.loadMore()
          }
        })
        .catch(() => {
          this.busy = false
          console.log('Complete')
        })
    }
  }
}
</script>
