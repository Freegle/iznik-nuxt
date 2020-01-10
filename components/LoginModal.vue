<template>
  <b-modal
    v-if="!loggedIn"
    id="loginModal"
    ref="loginModal"
    v-model="showModal"
    no-stacking
    visible
    size="lg"
    hide-footer
    no-close-on-backdrop
    :hide-header-close="modalIsForced"
    :no-close-on-esc="modalIsForced"
  >
    <!-- This is required as the default bootstrap component makes the main title an h5 -->
    <template slot="modal-title">
      <h2>Let's get freegling!</h2>
    </template>
    <p v-if="showSignUp" class="text-center">
      You'll get emails.  Name, approx. location, and profile picture are public - you can hide your real name and
      picture from Settings.  Logging in adds cookies and local
      storage.  Read <nuxt-link target="_blank" to="/terms">
        Terms of Use
      </nuxt-link> and
      <nuxt-link target="_blank" to="/privacy">
        Privacy
      </nuxt-link> for details.  Ok?  Now come on in...
    </p>
    <div class="d-flex flex-column flex-lg-row justify-content-between p-3">
      <div class="signin__section--social">
        <h3 class="signin__header">
          Continue with your social account
        </h3>
        <p v-if="signUp">
          <b>Using one of these buttons is the easiest way to create an account:</b>
        </p>
        <b-btn class="social-button social-button--facebook" :disabled="facebookDisabled" @click="loginFacebook">
          <b-img src="~/static/signinbuttons/facebook-logo.png" class="social-button__image" />
          <span class="p-2 social-button__text font-weight-bold">Continue with Facebook</span>
        </b-btn>
        <b-btn class="social-button social-button--google" :disabled="googleDisabled" @click="loginGoogle">
          <b-img src="~/static/signinbuttons/google-logo.svg" class="social-button__image" />
          <span class="p-2 social-button__text font-weight-bold">Continue with Google</span>
        </b-btn>
        <b-btn class="social-button social-button--yahoo" :disabled="yahooDisabled" @click="loginYahoo">
          <b-img src="~/static/signinbuttons/yahoo-logo.svg" class="social-button__image" />
          <span class="p-2 social-button__text font-weight-bold">Continue with Yahoo</span>
        </b-btn>
        <notice-message v-if="socialblocked" variant="warning">
          Social sign in blocked - check your privacy settings
        </notice-message>
        <b-alert v-if="socialLoginError" variant="danger" show>
          Login Failed: {{ socialLoginError }}
        </b-alert>
      </div>
      <div class="divider__wrapper">
        <div class="divider" />
        <div class="divider__text">
          OR
        </div>
        <div class="divider" />
      </div>
      <div class="signin__section--freegle">
        <h3 class="signin__header">
          <span v-if="showSignUp">Create an account on Freegle</span>
          <span v-else>Continue with your Freegle account</span>
        </h3>
        <b-form ref="form" action="/" autocomplete="on" method="post" @submit="loginNative">
          <div v-if="signUp">
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
          </div>
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
          <b-form-group
            id="passwordGroup"
            label="Your password"
            label-for="password"
            label-class="mb-0"
          >
            <b-input-group class="mb-2">
              <b-form-input
                id="password"
                ref="password"
                v-model="password"
                name="password"
                :type="showPassword ? 'input' : 'password'"
                autocomplete="current-password"
              />
              <b-input-group-append>
                <!-- TODO RAHUL DESIGN MINOR The shadow on the input field that you get when you're focused ought really to include this append.-->
                <b-button variant="white" class="transbord" title="Show password" @click="togglePassword">
                  <v-icon v-if="showPassword" title="Hide password" class="text-secondary" flip="horizontal" @click="togglePassword">
                    <v-icon name="eye" />
                    <v-icon name="slash" />
                  </v-icon>
                  <v-icon v-else name="eye" class="text-secondary" />
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
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
          <b-alert v-if="nativeLoginError" variant="danger" show>
            Login Failed: {{ nativeLoginError }}
          </b-alert>
          <div v-if="!signUp" class="text-center">
            <nuxt-link to="/forgot" @click.native="forgot">
              I forgot my password
            </nuxt-link>
            <p class="mb-0">
              New freegler? <a href="#" @click="clickShowSignUp">Sign Up</a>
            </p>
          </div>
          <p v-else class="text-center">
            Already a freegler? <a href="#" @click="clickShowSignIn">Sign In</a>
          </p>
        </b-form>
      </div>
    </div>
  </b-modal>
</template>

<script>
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
      nativeLoginError: null,
      socialLoginError: null,
      showPassword: false
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

  beforeDestroy() {
    if (this.bumpTimer) {
      clearTimeout(this.bumpTimer)
    }
  },
  methods: {
    tryLater() {
      this.nativeLoginError = 'Something went wrong; please try later.'
    },
    bumpIt() {
      // Force reconsideration of social signin disabled.  Need to do that regularly in case the SDKs haven't loaded
      // by the time we open the modal.
      this.bump = Date.now()
      this.bumpTimer = setTimeout(this.bumpIt, 500)
    },
    show() {
      this.bumpIt()
      this.pleaseShowModal = true
    },
    hide() {
      this.pleaseShowModal = false
    },
    loginNative(e) {
      const self = this
      this.nativeLoginError = null
      this.socialLoginError = null
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
              this.nativeLoginError = e.status
            } else {
              throw e // let others bubble up
            }
          })
      }
    },
    async loginFacebook() {
      this.nativeLoginError = null
      this.socialLoginError = null
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
          this.socialLoginError =
            'Facebook response is unexpected.  Please try later.'
        }
      } catch (e) {
        this.socialLoginError = 'Facebook login error: ' + e.message
      }
    },

    loginGoogle() {
      this.nativeLoginError = null
      this.socialLoginError = null
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
            this.socialLoginError = 'Google login failed: ' + authResult.error
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
      this.nativeLoginError = null
      this.socialLoginError = null
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
    },

    togglePassword() {
      this.showPassword = !this.showPassword
    },

    forgot() {
      this.hide()
      this.$store.dispatch('auth/forceLogin', false)
      this.$router.push('/forgot')
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

$color-facebook: #4267b2;
$color-google: #4285f4;
$color-yahoo: #6b0094;

.signin__section--social {
  flex: 0 1 100%;

  @include media-breakpoint-up(lg) {
    flex: 0 1 37%;
  }
}

.signin__section--freegle {
  flex: 0 1 100%;

  @include media-breakpoint-up(lg) {
    flex: 0 1 44%;
  }
}

.social-button {
  display: flex;
  align-items: center;
  min-width: 250px;
  border-radius: 3px;
  padding: 0;
  margin: 0 auto 20px;
  color: $color-white;

  @include media-breakpoint-up(lg) {
    margin: 0 0 20px;
  }
}

.social-button:disabled {
  opacity: 0.2;
}

.social-button__image {
  width: 46px;
  height: 46px;
  background-color: $color-white;
}

.social-button__text {
  font-size: 1rem;
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

.signin__header {
  font-size: 1.1rem;
  padding-bottom: 15px;
}

.divider__wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @include media-breakpoint-up(lg) {
    flex-direction: column;
    margin-bottom: 0;
    flex-grow: 1;
  }
}

.divider {
  border-right: none;
  border-bottom: 1px solid $color-gray--light;
  width: 100%;

  @include media-breakpoint-up(lg) {
    border-right: 1px solid $color-gray--light;
    border-bottom: none;
    height: 100%;
    width: auto;
  }
}

.divider__text {
  margin: 0 7px 0 7px;
  color: $color-gray--base;
  font-size: 0.8rem;

  @include media-breakpoint-up(lg) {
    margin: 7px 0 7px 0;
  }
}

.transbord {
  // TODO DESIGN MINOR This colour is copied from bootstrap $input-border-color and should be done better.  Sorry Jason.
  // See also Autocomplete.
  border-color: #ced4da;
  border-left: none;
}
</style>
