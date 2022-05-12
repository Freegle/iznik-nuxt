<template>
  <div>
    <b-row class="m-0">
      <b-col cols="12" lg="6" offset-lg="3" class="bg-white">
        <h1>
          There's a problem with Facebook Login at the moment
        </h1>
        <NoticeMessage variant="danger" class="mb-2">
          Facebook have blocked our use of Facebook Login.  We're working urgently to get it back but, y'know, Facebook
          are Facebook.
        </NoticeMessage>
        <p>
          Meanwhile, you can log in by triggering a "lost password" type email, which will give you a link to log in.
        </p>
        <b-alert v-if="error" variant="danger" show>
          {{ error }}
        </b-alert>
        <b-alert v-if="response" variant="warning" show>
          We've sent you a link to log in. If you don't see it, please check your spam folder! Just click the button which
          says "Click here to set a new password" and it'll log you in.
        </b-alert>
        <EmailValidator
          ref="email"
          size="lg"
          :email.sync="email"
          :valid.sync="emailValid"
        />
        <SpinButton
          v-if="emailValid && !response"
          name="envelope"
          spinclass="success"
          variant="primary"
          size="lg"
          :handler="mail"
          label="Mail login link"
          class="mb-2"
        />
      </b-col>
      <b-col cols="0" md="3" />
    </b-row>
  </div>
</template>

<script>
import { email, required } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import loginOptional from '@/mixins/loginOptional.js'
import validationHelpers from '@/mixins/validationHelpers'

import buildHead from '@/mixins/buildHead.js'
import NoticeMessage from '../components/NoticeMessage'
import SpinButton from '../components/SpinButton'
import EmailValidator from '../components/EmailValidator'

export default {
  components: {
    SpinButton,
    EmailValidator,
    NoticeMessage
  },
  mixins: [buildHead, validationMixin, validationHelpers, loginOptional],
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
  mounted() {
    if (this.me) {
      this.$router.push('/')
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
