<template>
  <div>
    <b-row class="m-0">
      <b-col cols="0" md="3" />
      <b-col cols="12" md="6" class="bg-white">
        <h1>
          Want to leave Freegle?
        </h1>
        <p>
          We'd love you to stay, but sometimes if you love someone, you have to let them go.
        </p>
        <notice-message class="mb-3">
          Too many emails? Don't leave! Go to <nuxt-link to="/settings">
            Settings
          </nuxt-link> and adjust your Mail Settings.
        </notice-message>
        <div v-if="loggedIn">
          <b-btn size="lg" variant="primary" class="mb-2" @click="unsubscribe">
            Unsubscribe completely
          </b-btn>
          <div v-if="groupCount" class="mt-2">
            <p>You can also leave communities individually:</p>
            <div class="mb-2">
              <GroupRememberSelect v-model="groupid" remember="unsubscribe" size="lg" />
              <b-btn v-if="groupid" variant="white" :disabled="leaving" @click="leave">
                <v-icon v-if="leaving" name="sync" class="fa-spin" />
                <v-icon v-else name="trash-alt" />
                Leave the community
              </b-btn>
            </div>
          </div>
          <p>
            <!-- eslint-disable-next-line -->
            If you need help, please mail <ExternalLink href="mailto:support@ilovefreegle.org">our Support Volunteers</ExternalLink>.
          </p>
        </div>
        <div v-else>
          <h4>Please enter your email address</h4>
          <p>We'll email you to confirm.</p>
          <EmailValidator
            :valid="emailValid"
            :email="email"
            label=""
            @update:valid="emailValid = $event"
            @update:email="email = $event"
          />
          <SpinButton
            size="lg"
            name="trash-alt"
            variant="primary"
            class="mt-2 mb-2"
            label="Unsubscribe"
            @handler="emailConfirm"
          />
          <NoticeMessage v-if="emailSent" variant="primary" class="mt-2 mb-2">
            We've sent you an email to confirm.  Please check your email, including your spam folder.
          </NoticeMessage>
          <NoticeMessage v-else-if="emailProblem" variant="warning" class="mt-2 mb-2">
            We don't recognise that email address.  Please email
            <!-- eslint-disable-next-line -->
            <ExternalLink href="mailto:support@ilovefreegle.org">support@ilovefreegle.org</ExternalLink> and they'll help you out.
          </NoticeMessage>
        </div>
      </b-col>
      <b-col cols="0" md="3" />
    </b-row>
    <ConfirmModal ref="confirm" @confirm="forget" />
    <ForgetFailModal ref="forgetfail" />
    <ForgetSucceedModal ref="forgetsucceed" />
  </div>
</template>

<style scoped lang="scss">
</style>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import EmailValidator from '../../components/EmailValidator'
import SpinButton from '../../components/SpinButton'
import ForgetFailModal from '@/components/ForgetFailModal'
import ForgetSucceedModal from '@/components/ForgetSucceedModal'
import buildHead from '@/mixins/buildHead.js'
import loginOptional from '@/mixins/loginOptional.js'
import validationHelpers from '@/mixins/validationHelpers'
const GroupRememberSelect = () => import('~/components/GroupRememberSelect.vue')
const ConfirmModal = () => import('~/components/ConfirmModal.vue')
const NoticeMessage = () => import('~/components/NoticeMessage')
const ExternalLink = () => import('~/components/ExternalLink')

export default {
  components: {
    SpinButton,
    EmailValidator,
    ForgetSucceedModal,
    ForgetFailModal,
    GroupRememberSelect,
    ConfirmModal,
    NoticeMessage,
    ExternalLink
  },
  mixins: [loginOptional, buildHead, validationMixin, validationHelpers],
  data() {
    return {
      groupid: null,
      leaving: false,
      email: null,
      emailValid: false,
      emailSent: false,
      emailProblem: false,
      userid: null,
      confirm: false
    }
  },
  computed: {
    groupCount() {
      const myGroups = this.$store.getters['auth/groups']
      return myGroups ? myGroups.length : 0
    }
  },
  watch: {
    me(newme) {
      console.log('New me', newme, this.userid, this.confirm)
      if (newme && newme.id === this.userid && this.confirm) {
        console.log('Trigger unsub on watch')
        this.forget()
      }
    }
  },
  mounted() {
    this.userid = parseInt(this.$route.params.id)
    this.confirm = parseInt(this.$route.query.confirm)

    if (this.userid === this.myid && this.confirm) {
      console.log('Trigger unsub on mount')
      this.forget()
    }
  },
  methods: {
    unsubscribe() {
      const me = this.$store.getters['auth/user']

      if (!me) {
        // If we're trying to do this, we must have logged in at some point in the past, even if not on this device
        // and therefore not according to our store.  Set that, which will force us to show the sign in rather than
        // sign up variant of the login modal.
        this.$store.dispatch('auth/loggedInEver', true)
        this.$store.dispatch('auth/forceLogin', true)
      } else {
        this.$refs.confirm.show()
      }
    },
    async leave() {
      this.leaving = true

      const me = this.$store.getters['auth/user']

      if (this.groupid) {
        await this.$store.dispatch('auth/leaveGroup', {
          userid: me.id,
          groupid: this.groupid
        })
      }

      this.leaving = false
      this.groupid = 0
    },

    async forget() {
      const ret = await this.$store.dispatch('auth/forget')

      if (ret) {
        this.$refs.forgetfail.show()
      } else {
        this.$refs.forgetsucceed.show()
      }
    },

    async emailConfirm() {
      this.$v.$touch()
      if (this.$v.$anyError) {
        this.validationFocusFirstError()
      } else {
        // Valid email.  See if the server likes it.
        this.leaving = true

        const ret = await this.$store.dispatch('auth/unsubscribe', {
          email: this.email.trim()
        })

        console.log('Returned', ret)
        this.leaving = false

        if (ret.ret === 0) {
          this.emailSent = true
        } else {
          this.emailProblem = true
        }
      }
    }
  },
  validations: {
    email: {
      required,
      email
    }
  },

  head() {
    return this.buildHead(
      'Unsubscribe',
      'Want to leave Freegle?  You can do that from here.'
    )
  }
}
</script>
