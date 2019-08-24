<template>
  <div>
    <b-modal
      id="loginModal"
      ref="loginModal"
      title="Let's get freegling!"
      no-stacking
      visible
      size="lg"
      hide-footer
    >
      <b-row>
        <b-col class="text-center pb-3">
          You will receive emails, and your name and approximate location will be public.  You can
          control privacy from Settings.  Read <nuxt-link target="_blank" to="/terms">
            Terms of Use
          </nuxt-link> and
          <nuxt-link target="_blank" to="/privacy">
            Privacy
          </nuxt-link> for details.
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12" sm="6" class="text-center">
          <b-img alt="Facebook login" class="clickme" src="~/static/signinbuttons/facebook.png" @click="loginFacebook" />
          <b-img alt="Google login" class="signindisabled clickme" src="~/static/signinbuttons/google.png" />
          <b-img alt="Yahoo login" class="signindisabled clickme" src="~/static/signinbuttons/yahoo.png" />
          <b-alert v-if="socialblocked" variant="error">
            Social login blocked - check your privacy settings
          </b-alert>
        </b-col>
        <b-col cols="12" sm="6" class="mt-2">
          <b-form ref="form" action="/" autocomplete="on" method="post" @submit="loginNative">
            <div v-if="existinguser">
              <b-row>
                <b-col>
                  <b-form-input
                    id="email"
                    ref="email"
                    v-model="email"
                    v-focus
                    name="email"
                    placeholder="Your email address"
                    alt="Email address"
                    class="mb-3"
                  />
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-form-input
                    id="password"
                    ref="password"
                    v-model="password"
                    name="password"
                    type="password"
                    placeholder="Your password"
                    alt="Password"
                    class="mb-2"
                  />
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-btn
                    v-b-modal.add
                    block
                    size="lg"
                    variant="success"
                    class="mb-2 mt-2"
                    type="submit"
                    value="login"
                  >
                    Sign in with Freegle
                  </b-btn>
                </b-col>
              </b-row>
              <b-row>
                <b-col class="text-center">
                  <nuxt-link to="/forgot">
                    I forgot my password
                  </nuxt-link>
                </b-col>
              </b-row>
              <b-row>
                <b-col class="text-center">
                  New freegler? <span class="clickme">Sign Up</span>
                </b-col>
              </b-row>
            </div>
          </b-form>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>
<style scoped>
.signindisabled {
  opacity: 0.2;
  pointer-events: none;
}
</style>
<script>
// TODO DESIGN The existing site has a red vertical line to divide the social signin from the form.  Something like that.
// Not sure how to do it nicely as the form will appear below on mobile.
// TODO Signup
// TODO Lost password
export default {
  data() {
    return {
      email: '',
      password: '',
      rememberme: false,
      error: null,
      socialblocked: false,
      existinguser: true,
      facebookaccesstoken: null
    }
  },

  async mounted() {
    if (this.$store.state.auth.user) {
      // We are logged in - redirect to home page.  This can happen if we navigate to this URL directly.
      this.$router.push('/')
    }

    // If we have logged in with Facebook then we return here with the access token in the URL hash.  Grab it.
    console.log('Params', this.$route)
    if (this.$route.hash) {
      const matches = /#access_token=(.*?)&/.exec(this.$route.hash)
      console.log('Matches', matches)
      if (matches.length > 1) {
        const token = matches[1]

        // Now log in to the server.
        const ret = await this.$axios.post(process.env.API + '/session', {
          fblogin: 1,
          fbaccesstoken: token
        })

        console.log('Server login returned', ret)
        if (ret.status === 200 && ret.data.ret === 0 && ret.data.user) {
          // We have logged in successfully.  Go to whichever back prompted our login.
          console.log('Logged in Facebook')
          this.$router.back()
        }
      }
    }
  },

  methods: {
    async loginNative(e) {
      e.preventDefault()
      await this.$auth
        .loginWith('native', {
          data: {
            email: this.email,
            password: this.password
          }
        })
        .then(() => {
          // Return to the page, which will re-render now we're logged in.
          //
          // TODO Browser needs tricking into asking to remember our email/password, which isn't working yet.
          console.log('Logged in native')
          this.$router.back()
        })
        .catch(e => {
          console.error('Failed login', e)
          // TODO
        })
    },
    async loginFacebook(e) {
      e.preventDefault()
      console.log('Facebook login')
      await this.$auth
        .loginWith('facebook')
        .then(() => {
          // Return to the page, which will re-render now we're logged in.
          console.log('Done')
          this.$router.back()
        })
        .catch(e => {
          console.error('Failed login', e)
          // TODO
        })
    }
  }
}
</script>
