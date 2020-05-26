<template>
  <div>
    <b-row class="m-0">
      <b-col cols="0" md="3" class="d-none d-md-block" />
      <b-col cols="12" md="6" class="p-0">
        <b-modal
          id="successmodal"
          v-model="succeeded"
          title="Verification Succeeded"
          no-stacking
        >
          <template slot="default">
            <b-row>
              <b-col>
                <p>Thanks - we've verified your email address. Happy freegling!</p>
                <p>Don't forget to check your spam folder - sometimes mails end up in there.</p>
              </b-col>
            </b-row>
          </template>
          <template slot="modal-footer">
            <b-button variant="primary" @click="closed">
              Close
            </b-button>
          </template>
        </b-modal>
        <b-modal
          id="failuremodal"
          v-model="failed"
          title="Verification Failed"
          no-stacking
        >
          <template slot="default">
            <b-row>
              <b-col>
                <p>Sorry - we failed to verify your email address.</p>
                <p> <b>Please try again.</b> Resend verification mail to:</p>
                <b-form-input v-model="email" placeholder="Enter your email" class="mb-2" />
                <p>If you keep having trouble, please mail <a href="mailto:support@ilovefreegle.org">support@ilovefreegle.org</a>.</p>
              </b-col>
            </b-row>
          </template>
          <template slot="modal-footer">
            <b-button variant="white" @click="closed">
              Cancel
            </b-button>
            <b-button variant="primary" @click="resend">
              Resend verification mail
            </b-button>
          </template>
        </b-modal>
        <b-modal
          id="retrymodal"
          v-model="resent"
          title="Verification Sent"
          no-stacking
        >
          <template slot="default">
            <b-row>
              <b-col>
                <p>We've resent the mail.  Please check your email, including your spam folders</p>
                <p>If you have multiple verification mails, please click on the most recent.</p>
                <p>If you keep having trouble, please mail <a href="mailto:support@ilovefreegle.org">support@ilovefreegle.org</a>.</p>
              </b-col>
            </b-row>
          </template>
          <template slot="modal-footer">
            <b-button variant="primary" @click="closed">
              Close
            </b-button>
          </template>
        </b-modal>
      </b-col>
      <b-col cols="0" md="3" class="d-none d-md-block" />
    </b-row>
  </div>
</template>
<style scoped lang="scss">
@import 'color-vars';
</style>
<script>
import loginRequired from '@/mixins/loginRequired.js'
import buildHead from '@/mixins/buildHead'

export default {
  components: {},
  mixins: [loginRequired, buildHead],
  data: function() {
    return {
      succeeded: false,
      failed: false,
      resent: false,
      email: null
    }
  },
  computed: {},
  created() {
    this.key = this.$route.params.key
  },
  async mounted() {
    await this.$store.dispatch('auth/fetchUser', {
      components: ['me'],
      force: true
    })

    const me = this.$store.getters['auth/user']
    this.email = me.email

    try {
      await this.$store.dispatch('auth/saveAndGet', {
        key: this.key
      })

      this.succeeded = true
    } catch (e) {
      this.failed = true
    }
  },
  methods: {
    closed() {
      this.$router.push('/chitchat')
    },
    async resend() {
      await this.$store.dispatch('auth/saveAndGet', {
        email: this.email
      })

      this.resent = true
    }
  },
  head() {
    return this.buildHead(
      'Confirm Email',
      'Confirm your email address so that we send mails to the right place.'
    )
  }
}
</script>
