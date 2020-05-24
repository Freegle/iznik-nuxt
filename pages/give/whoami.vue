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
            <b-col class="text-muted text-center">
              <p>We need your email address to let you know when you have replies.  We won't give your email to anyone else.</p>
              <p>You will get emails from us, which you can control or turn off from Settings.</p>
              <EmailValidator :email.sync="email" :valid.sync="emailValid" />
            </b-col>
          </b-row>
          <transition name="fadein">
            <b-row v-if="emailValid && !submitting">
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
    </client-only>
  </div>
</template>
<script>
import EmailValidator from '../../components/EmailValidator'
import loginOptional from '@/mixins/loginOptional.js'
import compose from '@/mixins/compose.js'
import buildHead from '@/mixins/buildHead.js'

const WizardProgress = () => import('~/components/WizardProgress')

export default {
  components: {
    EmailValidator,
    WizardProgress
  },
  mixins: [loginOptional, buildHead, compose],
  data() {
    return {
      id: null,
      submitting: false,
      postType: 'Offer',
      emailValid: false
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
    next() {
      this.submitting = true

      this.$store
        .dispatch('compose/submit', {
          type: 'Offer'
        })
        .then(results => {
          // Fetch the group we posted on so that it's in the store for the whatsnext page - it might not be if
          // we weren't a member or logged in.
          //
          // All posts are made to the same group so it's ok to check just the first.
          if (results.length > 0 && results[0].groupid) {
            this.$store
              .dispatch('group/fetch', {
                id: results[0].groupid
              })
              .then(() => {
                // Go to the next page.  The params we pass from the results may crucially include new user information,
                // and depending on timing this may not appear in the first result, so look for one of those first.
                let params = null

                console.log('Got results', results)
                results.forEach(res => {
                  if (params === null || res.newuser) {
                    console.log('Save params', res)
                    params = res
                  }
                })

                this.$router.push({
                  name: 'give-whatnext',
                  params: params
                })
              })
          } else {
            // Was probably already submitted
            this.$router.push({
              name: 'give-whatnext'
            })
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
