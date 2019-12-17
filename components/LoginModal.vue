<template>
  <b-modal
    v-if="!loggedIn"
    id="loginModal"
    ref="loginModal"
    v-model="showModal"
    title="Let's get freegling!"
    no-stacking
    visible
    size="lg"
    hide-footer
    no-close-on-backdrop
    :hide-header-close="modalIsForced"
    :no-close-on-esc="modalIsForced"
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
      <b-col cols="12" lg="6" class="text-center">
        <p v-if="signUp">
          <b>Using one of these buttons is the easiest way to create an account:</b>
        </p>
        <button class="social-button social-button--facebook" :disabled="facebookDisabled" @click="loginFacebook">
          <b-img src="~/static/signinbuttons/facebook-logo.png" class="social-button__image" />
          <span class="p-2 font-weight-bold">Continue with Facebook</span>
        </button>
        <button class="social-button social-button--google" :disabled="googleDisabled" @click="loginGoogle">
          <b-img src="~/static/signinbuttons/google-logo.svg" class="social-button__image" />
          <span class="p-2 font-weight-bold">Continue with Google</span>
        </button>
        <button class="social-button social-button--yahoo" :disabled="yahooDisabled" @click="loginYahoo">
          <b-img src="~/static/signinbuttons/yahoo-logo.svg" class="social-button__image" />
          <span class="p-2 font-weight-bold">Continue with Yahoo</span>
        </button>
        <notice-message v-if="socialblocked" variant="warning">
          Social sign in blocked - check your privacy settings
        </notice-message>
      </b-col>
      <b-col cols="12" class="d-block d-lg-none">
        <b-row>
          <b-col cols="5">
            <hr class="text-danger pb-2 d-block d-lg-none login__splitter">
          </b-col>
          <b-col cols="2" class="text-center">
            <em>Or</em>
          </b-col>
          <b-col cols="5">
            <hr class="text-danger pb-2 d-block d-lg-none login__splitter">
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="12" lg="6" class="mt-0">
        <b-form ref="form" action="/" autocomplete="on" method="post" @submit="loginNative">
          <div>
            <b-row v-if="signUp">
              <b-col>
                <b-form-group
                  id="firstnameGroup"
                  label="Your first name"
                  label-for="firstname"
                  label-class="mb-0"
                >
                  <b-form-input
                    id="firstname"
                    ref="firstname"
                    v-model="firstname"
                    name="firstname"
                    class="mb-3"
                    autocomplete="given-name"
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row v-if="signUp">
              <b-col>
                <b-form-group
                  id="lastnameGroup"
                  label="Your last name"
                  label-for="lastname"
                  label-class="mb-0"
                >
                  <b-form-input
                    id="lastname"
                    ref="lastname"
                    v-model="lastname"
                    name="lastname"
                    class="mb-3"
                    autocomplete="family-name"
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group
                  id="emailGroup"
                  label="Your email address"
                  label-for="email"
                  label-class="mb-0"
                >
                  <b-form-input
                    id="email"
                    ref="email"
                    v-model="email"
                    name="email"
                    class="mb-3"
                    autocomplete="username email"
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-group
                  id="passwordGroup"
                  label="Your password"
                  label-for="password"
                  label-class="mb-0"
                >
                  <b-form-input
                    id="password"
                    ref="password"
                    v-model="password"
                    name="password"
                    type="password"
                    class="mb-2"
                    autocomplete="current-password"
                  />
                </b-form-group>
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
                  <span v-if="!signUp">
                    Sign in to Freegle
                  </span>
                  <span v-else>
                    Sign up to Freegle
                  </span>
                </b-btn>
              </b-col>
            </b-row>
            <b-row v-if="!signUp">
              <b-col class="text-center">
                <nuxt-link to="/forgot">
                  I forgot my password
                </nuxt-link>
              </b-col>
            </b-row>
            <b-row v-if="!signUp">
              <b-col class="text-center">
                New freegler? <a href="#" @click="clickShowSignUp">Sign Up</a>
              </b-col>
            </b-row>
            <b-row v-else>
              <b-col class="text-center">
                Already a freegler? <a href="#" @click="clickShowSignIn">Sign In</a>
              </b-col>
            </b-row>
          </div>
        </b-form>
      </b-col>
    </b-row>
    <b-alert v-if="loginError" variant="danger" show>
      Login Failed: {{ loginError }}
    </b-alert>
  </b-modal>
</template>

<script>
// TODO Eye icon to show password for mobile
// TODO DESIGN Need vertical line or some other way to indicate that the form on the right is an alternative to
// the buttons.
// TODO DESIGN MINOR Would be nice to have "Sign up" buttons for social sign in.
import Vue from 'vue'
import { LoginError } from '../api/BaseAPI'
const NoticeMessage = () => import('~/components/NoticeMessage')

export default {
  name: 'LoginModal',
  components: {
    NoticeMessage
  },
  data: function() {
    return {
      bump: Date.now(),
      firstname: null,
      lastname: null,
      email: null,
      password: null,
      pleaseShowModal: false,
      showSignUp: false,
      forceSignIn: false,
      loginError: null
    }
  },

  computed: {
    loggedIn() {
      const ret = Boolean(this.$store.getters['auth/user'])
      return ret
    },

    // Use of this.bump means we will recompute when we need to, i.e. when the modal is shown.  This is overriding
    // normal reactivity but that's because the SDKs we use aren't written in Vue.
    facebookDisabled() {
      return this.bump && typeof Vue.FB === 'undefined'
    },

    googleDisabled() {
      return this.bump && (!window || !window.gapi || !window.gapi.client)
    },

    yahooDisabled() {
      // Yahoo currently can't be disabled, because it's redirect auth flow rather than load of a JS toolkit.
      return false
    },

    socialblocked() {
      const ret =
        this.bump &&
        (this.facebookDisabled || this.googleDisabled || this.yahooDisabled)
      return ret
    },

    showModal: {
      get() {
        return this.pleaseShowModal || this.$store.getters['auth/forceLogin']
      },
      set(value) {
        this.pleaseShowModal = value
      }
    },

    modalIsForced() {
      return this.$store.getters['auth/forceLogin']
    },

    loggedInEver() {
      return this.$store.getters['auth/loggedInEver']
    },

    signUp() {
      if (this.forceSignIn) {
        return false
      } else {
        return !this.loggedInEver || this.showSignUp
      }
    }
  },

  methods: {
    tryLater() {
      this.loginError = 'Something went wrong; please try later.'
    },
    show() {
      // Force reconsideration of social signin disabled.
      this.bump = Date.now()
      this.pleaseShowModal = true
    },
    hide() {
      this.pleaseShowModal = false
    },
    loginNative(e) {
      const self = this
      this.loginError = null
      e.preventDefault()
      e.stopPropagation()

      if (this.signUp) {
        this.$store
          .dispatch('auth/signup', {
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            password: this.password
          })
          .then(() => {
            // We are now logged in. Prompt the browser to remember the credentials.
            if (window.PasswordCredential) {
              try {
                const c = new window.PasswordCredential(e.target)
                navigator.credentials
                  .store(c)
                  .then(function() {
                    self.pleaseShowModal = false
                  })
                  .catch(err => {
                    console.error('Failed to save credentials', err)
                  })
              } catch (e) {
                self.pleaseShowModal = false
              }
            } else {
              self.pleaseShowModal = false
            }

            if (this.$nuxt.path === '/' || !this.$nuxt.path) {
              // We've signed up from the home page.  Send them to chitchat - that shows some activity, and also
              // has the Give/Find prompt.
              this.$router.push('/chitchat')
            }
          })
      } else {
        // Login
        this.$store
          .dispatch('auth/login', {
            email: this.email,
            password: this.password
          })
          .then(() => {
            // We are now logged in. Prompt the browser to remember the credentials.
            if (window.PasswordCredential) {
              try {
                const c = new window.PasswordCredential(e.target)
                navigator.credentials
                  .store(c)
                  .then(function() {
                    self.pleaseShowModal = false
                  })
                  .catch(err => {
                    console.error('Failed to save credentials', err)
                  })
              } catch (e) {
                self.pleaseShowModal = false
              }
            } else {
              self.pleaseShowModal = false
            }
          })
          .catch(e => {
            console.log('Login failed', e)
            if (e instanceof LoginError) {
              console.log('Login error')
              this.loginError = e.status
            } else {
              throw e // let others bubble up
            }
          })
      }
    },
    async loginFacebook() {
      this.loginError = null
      try {
        let response = null
        const promise = new Promise(function(resolve) {
          Vue.FB.login(
            function(ret) {
              response = ret
              resolve()
            },
            { scope: 'email' }
          )
        })

        await promise
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken

          await this.$store.dispatch('auth/login', {
            fblogin: 1,
            fbaccesstoken: accessToken
          })

          // We are now logged in.
          self.pleaseShowModal = false
        } else {
          this.loginError =
            'Facebook response is unexpected.  Please try later.'
        }
      } catch (e) {
        this.loginError = 'Facebook login error: ' + e.message
      }
    },

    loginGoogle() {
      this.loginError = null
      const params = {
        clientid: process.env.GOOGLE_CLIENT_ID,
        cookiepolicy: 'single_host_origin',
        callback: async authResult => {
          console.log('Signin returned', authResult)
          if (authResult.access_token) {
            console.log('Signed in')

            await this.$store.dispatch('auth/login', {
              googleauthcode: authResult.code,
              googlelogin: true
            })

            // We are now logged in.
            console.log('Logged in')
            self.pleaseShowModal = false
          } else if (authResult.error) {
            this.loginError = 'Google login failed: ' + authResult.error
          }
        },
        immediate: false,
        scope: 'profile email',
        app_package_name: 'org.ilovefreegle.direct'
      }

      window.gapi.auth.signIn(params)
    },

    loginYahoo() {
      // Sadly Yahoo doesn't support a Javascript-only OAuth flow, so far as I can tell.  So what we do is
      // post to the server, get a redirection URL from there, redirect on here to Yahoo to complete the
      // signin, and then return to a /yahoologin route.
      this.loginError = null
      let match
      const pl = /\+/g // Regex for replacing addition symbol with a space
      const search = /([^&=]+)=?([^&]*)/g
      const decode = function(s) {
        return decodeURIComponent(s.replace(pl, ' '))
      }
      const query = window.location.search.substring(1)

      // We want to post to the server to do the login there.  We pass all the URL
      // parameters we have, which include the OpenID response.
      const urlParams = {}
      while ((match = search.exec(query)))
        urlParams[decode(match[1])] = decode(match[2])

      urlParams.yahoologin = true
      urlParams.returnto = document.URL
      urlParams.host =
        window.location.protocol +
        '//' +
        window.location.hostname +
        (window.location.port ? ':' + window.location.port : '')

      this.$axios
        .post(process.env.API + '/session', urlParams)
        .then(result => {
          const ret = result.data

          console.log('Default Session login returned', ret)
          if (ret.redirect) {
            // We are not logged in - we need to redirect to Yahoo
            //
            // The URL returned by the server has its hostname in it, but perhaps we are running on a different
            // host, especially when developing.
            let url = ret.redirect
            const apihost = process.env.API.replace('https://', '').replace(
              '/api',
              ''
            )

            if (apihost) {
              const re = new RegExp(apihost, 'g')
              url = url.replace(
                re,
                window.location.hostname +
                  (window.location.port ? ':' + window.location.port : '')
              )
            }

            console.log('Redirect to Yahoo', url)
            window.location = url
          } else if (ret.ret === 0) {
            // We are logged in.  Get the logged in user
            console.log('Logged in')
            this.$store.dispatch('auth/fetchUser')
            self.pleaseShowModal = false
          } else {
            console.error('Server login failed', ret)
            this.tryLater()
          }
        })
        .catch(e => {
          this.tryLater()
        })
    },

    clickShowSignUp(e) {
      this.showSignUp = true
      this.forceSignIn = false
      e.preventDefault()
      e.stopPropagation()
    },

    clickShowSignIn(e) {
      this.showSignUp = false
      this.forceSignIn = true
      e.preventDefault()
      e.stopPropagation()
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

$color-facebook: #4267b2;
$color-google: #4285f4;
$color-yahoo: #6b0094;

.login__splitter {
  border-top: 1px solid $color-red;
}

.social-button {
  display: flex;
  width: 250px;
  border-radius: 3px;
  align-items: center;
  padding: 0;
  margin-bottom: 20px;
  color: $color-white;
}

.social-button:disabled {
  opacity: 0.2;
}

.social-button__image {
  width: 46px;
  height: 46px;
  background-color: $color-white;
}

.social-button--facebook {
  border: 2px solid $color-facebook;
  background-color: $color-facebook;
}

.social-button--google {
  border: 2px solid $color-google;
  background-color: $color-google;
}

.social-button--yahoo {
  border: 2px solid $color-yahoo;
  background-color: $color-yahoo;
}
</style>
