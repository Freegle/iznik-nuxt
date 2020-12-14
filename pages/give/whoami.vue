\<template>
  <div>
    <client-only>
      <b-row class="m-0">
        <b-col cols="12" lg="6" offset-lg="3">
          <WizardProgress :active-stage="3" />
          <h1 class="text-center">
            Finally, your email address
          </h1>
          <b-row>
            <b-col class="text-center">
              <p class="text-muted">
                We need your email address to let you know when you have replies.  We won't give your email to anyone else.
              </p>
              <p class="text-muted">
                You will get emails from us, which you can control or turn off from Settings. Read
                <nuxt-link target="_blank" to="/terms">
                  Terms of Use
                </nuxt-link> and
                <nuxt-link target="_blank" to="/privacy">
                  Privacy
                </nuxt-link> for details.
              </p>
              <EmailValidator :email.sync="email" :valid.sync="emailValid" center class="align-items-center font-weight-bold" />
              <EmailBelongsToSomeoneElse v-if="emailValid && emailBelongsToSomeoneElse" class="mb-2" :ours="me.email" :theirs="email" />
            </b-col>
          </b-row>
          <div class="d-block d-md-none">
            <b-btn v-if="emailValid && !submitting" variant="primary" size="lg" block @click="next">
              Freegle it! <v-icon name="angle-double-right" />
            </b-btn>
          </div>
          <div class="d-none d-md-block">
            <div class="d-flex justify-content-between">
              <b-btn variant="secondary" size="lg" to="/give/whatisit" class="d-none d-md-block">
                <v-icon name="angle-double-left" /> Back
              </b-btn>
              <b-btn v-if="emailValid && !submitting" variant="primary" size="lg" @click="next">
                Freegle it! <v-icon name="angle-double-right" />
              </b-btn>
            </div>
          </div>
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
    </client-only>
  </div>
</template>
<script>
import loginOptional from '@/mixins/loginOptional.js'
import compose from '@/mixins/compose.js'
import buildHead from '@/mixins/buildHead.js'
import EmailValidator from '../../components/EmailValidator'

const EmailBelongsToSomeoneElse = () =>
  import('~/components/EmailBelongsToSomeoneElse')
const WizardProgress = () => import('~/components/WizardProgress')

export default {
  components: {
    EmailBelongsToSomeoneElse,
    EmailValidator,
    WizardProgress
  },
  mixins: [loginOptional, buildHead, compose],
  data() {
    return {
      id: null,
      postType: 'Offer',
      emailValid: false,
      emailBelongsToSomeoneElse: false
    }
  },
  computed: {
    progressValue() {
      const progress = this.$store.getters['compose/getProgress']
      console.log('Progress', progress)
      return progress
    }
  },
  mounted() {
    if (!this.valid) {
      this.$router.push('/give/whatisit')
    }
  },
  methods: {
    async next() {
      this.emailBelongsToSomeoneElse = false
      console.log('Check email')

      if (this.emailIsntOurs) {
        // Need to check if it's ok to use.
        console.log('Not ours')
        const inuse = await this.emailInUse(this.email)

        if (!inuse) {
          // Not in use - that's ok.
          console.log('Not in use')
          this.freegleIt('Offer')
        } else {
          // We can't proceed.
          console.log('Belongs to someone else')
          this.emailBelongsToSomeoneElse = true
        }
      } else {
        console.log('One of ours')
        this.freegleIt('Offer')
      }
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
