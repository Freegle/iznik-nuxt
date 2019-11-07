<template>
  <div>
    <b-row class="m-0">
      <b-col cols="0" md="3" />
      <b-col cols="12" md="6">
        <h1>
          Want to leave Freegle?
        </h1>
        <p>
          We'd love you to stay, but sometimes if you love someone, you have to let them go.
        </p>
        <p class="bg-info p-2">
          <!--          TODO DESIGN This should be a Notice box once we replace b-alert with those. -->
          Too many emails? Don't leave! Go to <nuxt-link to="/settings">
            Settings
          </nuxt-link> and adjust your Mail Settings.
        </p>
        <b-btn size="lg" variant="success" class="mb-2" @click="unsubscribe">
          Unsubscribe completely
        </b-btn>
        <div v-if="loggedIn && groupCount" class="mt-2">
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
          If you need help, please mail <a href="mailto:support@ilovefreegle.org">our Support Volunteers</a>.
        </p>
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
import ForgetFailModal from '../components/ForgetFailModal'
import ForgetSucceedModal from '../components/ForgetSucceedModal'
import loginOptional from '@/mixins/loginOptional.js'
const GroupRememberSelect = () => import('~/components/GroupRememberSelect.vue')
const ConfirmModal = () => import('~/components/ConfirmModal.vue')
// TODO MINOR If you have to sign in, should go straight to confirmation once we return to the page signed in.

export default {
  components: {
    ForgetSucceedModal,
    ForgetFailModal,
    GroupRememberSelect,
    ConfirmModal
  },
  mixins: [loginOptional],
  data() {
    return {
      groupid: 0,
      leaving: false
    }
  },
  computed: {
    loggedIn() {
      const ret = Boolean(this.$store.getters['auth/user']())
      return ret
    },
    groupCount() {
      const myGroups = this.$store.getters['auth/groups']()
      return myGroups ? myGroups.length : 0
    }
  },
  methods: {
    unsubscribe() {
      const me = this.$store.getters['auth/user']()

      if (!me) {
        // If we're trying to do this, we must have logged in at some point in the past, even if not on this device
        // and therefore not according to our store.  Set that, which will force us to show the sign in rather than
        // sign up variant of the login modal.
        this.$store.dispatch('auth/setLoggedInEver', true)
        this.$store.dispatch('auth/forceLogin', true)
      } else {
        this.$refs.confirm.show()
      }
    },
    async leave() {
      this.leaving = true

      const me = this.$store.getters['auth/user']()

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
    }
  }
}
</script>
