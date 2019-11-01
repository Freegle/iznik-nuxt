<template>
  <div>
    <b-row class="m-0">
      <b-col cols="0" md="3" />
      <b-col cols="12" md="6">
        <WizardWhoAreYou />        
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
// TODO Add speech recognition
import loginOptional from '@/mixins/loginOptional.js'
const WizardWhoAreYou = () => import('~/components/wizard-whoareyou')

export default {
  components: {
    WizardWhoAreYou
  },
  mixins: [loginOptional],
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
        const user = this.$store.state.auth.user

        if (user && user.email) {
          // If we're logged in, then we have an email from that which takes precedence.
          email = user.email

          // Save it in case we're logged out next time.
          this.$store.dispatch('compose/setEmail', email)
        } else {
          // See if we have a local email stored from last time we were logged in.
          email = this.$store.getters['compose/getEmail']()
        }

        return email
      },
      set(newValue) {
        this.$store.dispatch('compose/setEmail', newValue)
      }
    },
    progressValue() {
      const progress = this.$store.getters['compose/getProgress']()
      return progress
    }
  },
  methods: {
    next() {
      this.submitting = true

      this.$store.dispatch('compose/setEmail', this.$refs.email.value)

      this.$store
        .dispatch('compose/submit')
        .then(results => {
          // Fetch the group we posted on so that it's in the store for the whatsnext page - it might not be if
          // we weren't a member or logged in.
          if (results.length > 0 && results[0].groupid) {
            this.$store
              .dispatch('group/fetch', {
                id: results[0].groupid
              })
              .then(() => {
                this.$router.push('/find/whatnext')
              })
          } else {
            // TODO
          }
        })
        .catch(e => {
          // TODO  More generally, need to check all axios requests, and have something consistent in place about
          // where those errors are caught - in the store or in the calling code - and how the errors are
          // displayed.
          console.log('Submit failed', e)
        })
    }
  }
}
</script>
