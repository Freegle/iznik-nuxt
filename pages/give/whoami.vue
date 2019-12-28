<template>
  <div>
    <b-row class="m-0">
      <b-col cols="0" md="3" />
      <b-col cols="12" lg="6">
        <WizardProgress :active-stage="3" />
        <h1 class="text-center">
          Finally, your email address
        </h1>
        <b-row>
          <b-col class="text-muted text-center">
            <p>We need your email address to let you know when you have replies.  We won't give your email to anyone else.</p>
            <p>You will get emails from us, which you can control or turn off from Settings.</p>
            <b-form-input
              ref="email"
              v-model="email"
              type="email"
              size="lg"
              class="d-inline-block form-control email"
              placeholder="What's your email address?"
            />
          </b-col>
        </b-row>
        <transition name="fadein">
          <b-row v-if="email && !submitting">
            <b-col cols="12" md="6" offset-md="3" class="text-center pt-2 mt-2">
              <b-btn variant="success" size="lg" block @click="next">
                Freegle it!
              </b-btn>
            </b-col>
          </b-row>
        </transition>
        <b-row v-if="submitting">
          <b-col cols="12" md="6" offset-md="3" class="text-center pt-2 mt-2">
            <b-progress
              height="48px"
              class="mt-2"
              animate
              variant="success"
            >
              <b-progress-bar :value="progressValue" />
            </b-progress>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="0" md="3" />
    </b-row>
  </div>
</template>
<style scoped>
.email {
  max-width: 300px;
}
</style>
<script>
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'

const WizardProgress = () => import('~/components/WizardProgress')

export default {
  components: {
    WizardProgress
  },
  mixins: [loginOptional, buildHead],
  data() {
    return {
      id: null,
      submitting: false
    }
  },
  computed: {
    email: {
      get() {
        let email = null
        const user = this.$store.getters['auth/user']

        if (user && user.email) {
          // If we're logged in, then we have an email from that which takes precedence.
          email = user.email

          // Save it in case we're logged out next time.
          this.$store.dispatch('compose/setEmail', email)
        } else {
          // See if we have a local email stored from last time we were logged in.
          email = this.$store.getters['compose/getEmail']
        }

        return email
      },
      set(newValue) {
        this.$store.dispatch('compose/setEmail', newValue)
      }
    },
    progressValue() {
      const progress = this.$store.getters['compose/getProgress']
      console.log('Progress', progress)
      return progress
    }
  },
  methods: {
    async next() {
      this.submitting = true

      const email = this.$refs.email.value
      console.log('Submitted with', email)
      await this.$store.dispatch('compose/setEmail', email)

      this.$store.dispatch('compose/submit').then(results => {
        // Fetch the group we posted on so that it's in the store for the whatsnext page - it might not be if
        // we weren't a member or logged in.
        if (results.length > 0 && results[0].groupid) {
          this.$store
            .dispatch('group/fetch', {
              id: results[0].groupid
            })
            .then(() => {
              this.$router.push({
                name: 'give-whatnext',
                params: results[0]
              })
            })
        } else {
          // TODO MINOR Error handling
        }
      })
    }
  },

  head() {
    return this.buildHead(
      'OFFER',
      'OFFER something to people nearby and see who wants it'
    )
  }
}
</script>
