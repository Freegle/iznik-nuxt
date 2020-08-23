<template>
  <div>
    <b-row class="m-0">
      <b-col cols="12" lg="6" offset-lg="3" class="bg-white">
        <h1>
          Forgotten your password?
        </h1>
        <p>
          If you log in using Facebook, Google or Yahoo, then you don't use a password - just click those buttons.
        </p>
        <p>
          But if you log in with your email address and a password you set up for Freegle, then enter your email
          address and we'll mail you a link so that you can log in.
        </p>
        <b-alert v-if="error" variant="danger" show>
          {{ error }}
        </b-alert>
        <b-alert v-if="response" variant="warning" show>
          We've sent you a link to log in. Please check your spam folder!
        </b-alert>
        <EmailValidator
          ref="email"
          size="lg"
          :valid="emailValid"
          :email="email"
          @update:valid="emailValid = $event"
          @update:email="email = $event"
        />
        <SpinButton
          v-if="emailValid"
          name="envelope"
          spinclass="success"
          variant="success"
          size="lg"
          :handler="mail"
          label="Mail login link"
        />
        <p>
          <!-- eslint-disable-next-line -->
          If you have trouble, you can also contact <ExternalLink href="mailto:support@ilovefreegle.org">support@ilovefreegle.org</ExternalLink>.
        </p>
      </b-col>
      <b-col cols="0" md="3" />
    </b-row>
  </div>
</template>

<script>
import { email, required } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import EmailValidator from '../components/EmailValidator'
import SpinButton from '../components/SpinButton'
import validationHelpers from '@/mixins/validationHelpers'

import buildHead from '@/mixins/buildHead.js'
const ExternalLink = () => import('~/components/ExternalLink')

export default {
  components: {
    SpinButton,
    EmailValidator,
    ExternalLink
  },
  mixins: [buildHead, validationMixin, validationHelpers],
  data() {
    return {
      error: null,
      email: null,
      emailValid: false,
      response: false
    }
  },
  validations: {
    email: {
      required,
      email
    }
  },
  methods: {
    async mail() {
      const res = await this.$store.dispatch('auth/lostPassword', {
        email: this.email
      })

      if (res.data.ret === 0) {
        this.response = true
      } else {
        this.error = res.data.status
      }
    }
  },
  head() {
    return this.buildHead(
      'Lost Password',
      "Lost your password?  We'll help you log back in."
    )
  }
}
</script>
