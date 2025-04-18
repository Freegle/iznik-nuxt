<template>
  <b-modal
    v-if="!loggedIn"
    id="loginModal"
    ref="loginModal"
    v-model="showModal"
    size="lg"
    hide-footer
    no-close-on-backdrop
    :hide-header-close="modalIsForced"
    :no-close-on-esc="modalIsForced"
  >
    <!-- This is required as the default bootstrap component makes the main title an h5 -->
    <template slot="modal-title">
      <h2 v-if="!modtools">
        Let's get freegling!
      </h2>
      <h2 v-else>
        Please log in to ModTools
      </h2>
    </template>
    <p v-if="signUp" class="text-center">
      You'll get emails.  Name, approximate location, and profile picture are public - you can hide your real name and
      picture from Settings.  Logging in adds cookies and local
      <!-- eslint-disable-next-line -->
      storage.  Read <nuxt-link target="_blank" to="/terms">Terms of Use</nuxt-link> and
      <!-- eslint-disable-next-line -->
      <nuxt-link target="_blank" to="/privacy">Privacy</nuxt-link> for details.  Ok?  Now come on in...
    </p>
    <p v-if="modtools" class="text-center">
      <!-- eslint-disable-next-line -->
      Need any help moderating?  Mail <ExternalLink href="mailto:mentors@ilovefreegle.org">mentors@ilovefreegle.org</ExternalLink>.
    </p>
    <p v-if="loginType" class="text-center font-weight-bold">
      You usually log in using {{ loginType }}.
    </p>
    <div class="d-flex flex-column flex-lg-row justify-content-between p-3">
      <div class="signin__section--social">
        <h3 class="header--size5 pb-3">
          Log in with a social account
        </h3>
        <p v-if="signUp" class="font-weight-bold">
          Using one of these buttons is the easiest way to create an account:
        </p>
        <b-btn class="social-button social-button--facebook" :disabled="facebookDisabled" @click="loginFacebook">
          <b-img src="~/static/signinbuttons/facebook-logo.png" class="social-button__image" />
          <span class="p-2 text--medium font-weight-bold">Continue with Facebook</span>
        </b-btn>
        <b-btn id="googleLoginButton" ref="googleLoginButton" class="social-button social-button--google" :disabled="googleDisabled" />
        <b-btn class="social-button social-button--yahoo" :disabled="yahooDisabled" @click="loginYahoo">
          <b-img src="~/static/signinbuttons/yahoo-logo.svg" class="social-button__image" />
          <span class="p-2 text--medium font-weight-bold">Continue with Yahoo</span>
        </b-btn>
        <notice-message v-if="socialblocked" variant="warning">
          Social log in blocked - check your privacy settings, including any ad blockers such as
          Adblock Plus.
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
        <h3 class="header--size5 pb-0">
          <span v-if="signUp">
            Register a new Freegle account
          </span>
          <span v-else>Log in with your Freegle account</span>
        </h3>
        <b-form
          id="loginform"
          ref="form"
          action="/"
          autocomplete="on"
          method="post"
          class="mt-1"
          @submit="loginNative"
        >
          <div v-if="signUp">
            <b-form-group
              id="firstnameGroup"
              label="First name"
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
              label="Last name"
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
          <EmailValidator
            ref="email"
            size="md"
            :email.sync="email"
            :valid.sync="emailValid"
            label="Email address"
          />
          <NoticeMessage v-if="referToGoogleButton">
            Please use the <em>Continue with Google</em> button to log in.  That way you don't need to remember a password on this site.
          </NoticeMessage>
          <NoticeMessage v-if="referToYahooButton">
            Please use the <em>Continue with Yahoo</em> button to log in.  That way you don't need to remember a password on this site.
          </NoticeMessage>
          <PasswordEntry :original-password="password" :password.sync="password" />
          <b-btn
            v-b-modal.add
            block
            size="lg"
            variant="primary"
            class="mb-2 mt-2"
            type="submit"
            value="login"
            :disabled="nativeDisabled"
          >
            <span v-if="!signUp">
              Log in to Freegle
            </span>
            <span v-else>
              Register on Freegle
            </span>
          </b-btn>
          <p v-if="signUp" class="text-center font-weight-bold">
            <b-btn variant="link" class="font-weight-bold pl-1 py-0 border-0 align-top" @click="clickShowSignIn">
              Already a freegler? Log in
            </b-btn>
          </p>
          <b-alert v-if="nativeLoginError" variant="danger" show>
            Login Failed: {{ nativeLoginError }}
          </b-alert>
          <div v-if="!signUp" class="text-center link">
            <nuxt-link to="/forgot" class="nodecor" @click.native="forgot">
              I forgot my password
            </nuxt-link>
            <p class="mb-0">
              <b-btn variant="link" class="pl-0 pr-0 py-0 border-0 align-top" @click="clickShowSignUp">
                New freegler? Register
              </b-btn>
            </p>
          </div>
        </b-form>
      </div>
    </div>
  </b-modal>
</template>

<script>
import Vue from 'vue'
import { LoginError, SignUpError } from '../api/BaseAPI'
import EmailValidator from './EmailValidator'

const ExternalLink = () => import('~/components/ExternalLink')
const NoticeMessage = () => import('~/components/NoticeMessage')
const PasswordEntry = () => import('~/components/PasswordEntry')

export default {
  name: 'LoginModal',
  components: {
    EmailValidator,
    ExternalLink,
    NoticeMessage,
    PasswordEntry
  },
  data: function() {
    return {
      bump: Date.now(),
      firstname: null,
      lastname: null,
      email: null,
      emailValid: false,
      password: null,
      showModal: false,
      pleaseShowModal: false,
      showSignUp: false,
      forceSignIn: false,
      nativeLoginError: null,
      socialLoginError: null,
      showPassword: false,
      loginType: null,
      initialisedSocialLogin: false,
      showSocialLoginBlocked: false,
      nativeBump: 1,
      timerElapsed: false
    }
  },
  computed: {
    clientId() {
      return process.env.GOOGLE_CLIENT_ID
    },
    modtools() {
      return this.$store.getters['misc/get']('modtools')
    },
    // Use of this.bump means we will recompute when we need to, i.e. when the modal is shown.  This is overriding
    // normal reactivity but that's because the SDKs we use aren't written in Vue.
    facebookDisabled() {
      console.log(
        'Evaluate Facebook disabled',
        this.showSocialLoginBlocked,
        typeof Vue.FB,
        this.bump
      )
      return (
        this.bump &&
        (this.showSocialLoginBlocked || typeof Vue.FB === 'undefined')
      )
    },
    googleDisabled() {
      return (
        this.bump &&
        this.showSocialLoginBlocked &&
        (!window || !window.gapi || !window.gapi.client)
      )
    },
    yahooDisabled() {
      // Yahoo currently can't be disabled, because it's redirect auth flow rather than load of a JS toolkit.
      return false
    },
    socialblocked() {
      const ret =
        this.bump &&
        this.initialisedSocialLogin &&
        (this.facebookDisabled || this.googleDisabled || this.yahooDisabled) &&
        this.timerElapsed
      return ret
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
        return !this.loggedInEver || this.showSignUp || this.modtools
      }
    },
    referToGoogleButton() {
      return (
        this.email &&
        (this.email.toLowerCase().indexOf('gmail') !== -1 ||
          this.email.toLowerCase().indexOf('googlemail') !== -1)
      )
    },
    referToYahooButton() {
      return this.email && this.email.toLowerCase().indexOf('yahoo') !== -1
    },
    forceLogin() {
      return this.$store.getters['auth/forceLogin']
    },
    nativeDisabled() {
      return this.nativeBump && (!this.emailValid || !this.password)
    }
  },
  watch: {
    showModal: {
      immediate: true,
      handler(newVal) {
        this.pleaseShowModal = newVal

        if (newVal) {
          if (!this.initialisedSocialLogin) {
            // We only use the Google and Facebook SDKs in login, so we can install them here in the modal.  This means we
            // don't load the scripts for every page.
            this.installFacebookSDK()
            this.initialisedSocialLogin = true
          }

          // Need to install Google every time to get the button rendered.
          this.installGoogleSDK()
        }
      }
    },
    pleaseShowModal: {
      immediate: true,
      handler(newVal) {
        this.showModal = newVal || this.$store.getters['auth/forceLogin']
      }
    },
    forceLogin: {
      immediate: true,
      handler(newVal) {
        this.showModal = this.pleaseShowModal || newVal
      }
    },
    me(newVal) {
      // Need to do this when we log out to get the signin button rendered on the login modal.
      if (!newVal) {
        this.$nextTick(() => {
          this.installGoogleSDK()
        })
      }
    }
  },
  beforeDestroy() {
    if (this.bumpTimer) {
      clearTimeout(this.bumpTimer)
      this.bumpTimer = null
    }
  },
  mounted() {
    this.bumpIt()

    // Get the login type here rather than a computed property to avoid it flickering on the screen when you click
    // the login button.
    this.loginType = this.$store.getters['auth/loginType']
  },
  methods: {
    tryLater(native) {
      if (native) {
        this.nativeLoginError = 'Something went wrong; please try later.'
      } else {
        this.socialLoginError = 'Something went wrong; please try later.'
      }
    },
    bumpIt() {
      // Force reconsideration of social signin disabled.  Need to do that regularly in case the SDKs haven't loaded
      // by the time we open the modal.
      this.bump = Date.now()
      this.bumpTimer = setTimeout(this.bumpIt, 500)

      // And similarly naive signin.  This helps with some password managers which don't trigger events properly.
      this.nativeBump++
    },
    show() {
      this.pleaseShowModal = true
      this.nativeLoginError = null
      this.socialLoginError = null
      const self = this

      setTimeout(() => {
        self.timerElapsed = true
      }, 3000)
    },
    hide() {
      this.pleaseShowModal = false
    },
    loginNative(e) {
      this.$store.dispatch('auth/setLoginType', 'Freegle')

      const self = this
      this.nativeLoginError = null
      this.socialLoginError = null
      e.preventDefault()
      e.stopPropagation()

      // Probably this is someone who is already a user and is trying to log in, but has cleared their cache
      // (so we've forgotten that they've previously signed in) and hasn't noticed that they need to switch.
      const confused =
        !this.firstname && !this.lastname && this.email && this.password

      if (!confused && this.signUp) {
        if (
          !this.firstname ||
          !this.lastname ||
          !this.email ||
          !this.password
        ) {
          this.nativeLoginError = 'Please fill out the form.'
        } else {
          this.$store
            .dispatch('auth/signup', {
              firstname: this.firstname,
              lastname: this.lastname,
              email: this.email,
              password: this.password
            })
            .then(async () => {
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

              console.log('Current path', this.$nuxt, this.$router, this.$route)

              // Pick up the new user
              await this.fetchMe(['me'], true)

              if (this.$route.path === '/' || !this.$route.path) {
                // We've signed up from the home page.  Send them to the explore page to find a group.
                this.$router.push('/explore')
              }
            })
            .catch(e => {
              console.log('Signup failed', e)
              if (e instanceof SignUpError) {
                console.log('Login error')
                this.nativeLoginError = e.status
              } else {
                throw e // let others bubble up
              }
            })
        }
      } else if (this.email && this.password) {
        // Login
        console.log('Log in')
        this.$store
          .dispatch('auth/login', {
            email: this.email,
            password: this.password
          })
          .then(() => {
            // We are now logged in. Prompt the browser to remember the credentials.
            console.log('Signed in')
            if (window.PasswordCredential) {
              console.log('Try save')
              try {
                // We used to pass in the DOM element, but in Chrome 92 that causes a crash.
                const c = new window.PasswordCredential({
                  id: this.email,
                  password: this.password
                })
                console.log('Got creds')
                navigator.credentials
                  .store(c)
                  .then(function() {
                    console.log('Stored')
                    self.pleaseShowModal = false
                  })
                  .catch(err => {
                    console.error('Failed to save credentials', err)
                  })
              } catch (e) {
                console.log('Failed to save', e)
                self.pleaseShowModal = false
              }
            } else {
              console.log('No credentials')
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
      this.$store.dispatch('auth/setLoginType', 'Facebook')

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
    async handleGoogleCredentialsResponse(response) {
      console.log('Google login', response)
      this.loginType = 'Google'
      this.nativeLoginError = null
      this.socialLoginError = null
      if (response?.credential) {
        console.log('Signed in', response)

        try {
          await this.$store.dispatch('auth/login', {
            googlejwt: response.credential,
            googlelogin: true
          })

          // We are now logged in.
          console.log('Logged in')
          this.pleaseShowModal = false
        } catch (e) {
          this.socialLoginError = 'Google login failed: ' + e.message
        }
      } else if (response?.error && response.error !== 'immediate_failed') {
        this.socialLoginError = 'Google login failed: ' + response.error
      }
    },
    loginYahoo() {
      this.$store.dispatch('auth/setLoginType', 'Yahoo')

      // Sadly Yahoo doesn't support a Javascript-only OAuth flow, so far as I can tell.  So what we do is
      // redirect to Yahoo, which returns back to us with a code parameter, which we then pass to the server
      // to complete the signin.  This replaces the old flow which stopped working in Jan 2020.
      this.nativeLoginError = null
      this.socialLoginError = null

      const url =
        'https://api.login.yahoo.com/oauth2/request_auth?client_id=' +
        process.env.YAHOO_CLIENTID +
        '&redirect_uri=' +
        encodeURIComponent(
          window.location.protocol +
            '//' +
            window.location.hostname +
            (window.location.port ? ':' + window.location.port : '') +
            '/yahoologin?returnto=' +
            this.$route.fullPath
        ) +
        '&response_type=code&language=en-us&scope=sdpp-w'

      window.location = url
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
    },
    installGoogleSDK() {
      this.$nextTick(() => {
        if (
          window &&
          window.google &&
          window.google.accounts &&
          window.google.accounts.id
        ) {
          console.log('Install google SDK')
          // Google client library should be loaded by default.vue.
          window.google.accounts.id.initialize({
            client_id: this.clientId,
            callback: this.handleGoogleCredentialsResponse
          })
          console.log(
            'Render google button',
            document.getElementById('googleLoginButton')
          )

          this.waitForRef('googleLoginButton', () => {
            console.log('Found google button ref')
            window.google.accounts.id.renderButton(
              document.getElementById('googleLoginButton'),
              { theme: 'outline', size: 'large', width: '300px' }
            )
          })
        } else {
          console.log('Google not yet fully loaded')
        }
      })
    },
    installFacebookSDK() {
      if (typeof Vue.FB === 'undefined') {
        console.log('Need to install Facebook SDK')
        const VueFB = {}

        VueFB.install = function install(Vue, options) {
          Vue.FB = undefined

          window.fbAsyncInit = function() {
            window.FB.init(options)
            window.FB.AppEvents.logPageView()
            Vue.FB = window.FB

            // We need to have some special code for IE11 - see https://stackoverflow.com/questions/27176983/dispatchevent-not-working-in-ie11.
            let event

            if (typeof Event === 'function') {
              event = new Event('fb-sdk-ready')
            } else {
              event = document.createEvent('Event')
              event.initEvent('fb-sdk-ready', true, true)
            }
          }
          ;(function(d, s, id) {
            setTimeout(() => {
              try {
                const fjs = d.getElementsByTagName(s)[0]
                if (d.getElementById(id)) {
                  return
                }

                const js = d.createElement(s)
                js.id = id
                js.src = '//connect.facebook.net/en_US/sdk.js'
                fjs.parentNode.insertBefore(js, fjs)
              } catch (e) {
                console.error('Failed to load Facebook SDK', e)
              }
            }, 1000)
          })(document, 'script', 'facebook-jssdk')
        }

        Vue.use(VueFB, {
          appId: process.env.FACEBOOK_APPID,
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v4.0'
        })

        console.log('Installed FB SDK, bump')
        this.bump++
      } else {
        console.log('FB SDK already loaded')
      }
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
  flex: 0 1 auto;

  @include media-breakpoint-up(lg) {
    flex: 0 1 37%;
  }
}

.signin__section--freegle {
  flex: 0 1 auto;

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

.social-button--facebook {
  border: 2px solid $color-facebook;
  background-color: $color-facebook;
  width: 100%;
}

.social-button--google {
  border: 2px solid $color-google;
  background-color: #dadce0;
  width: 100%;
  min-height: 44px;
}

.social-button--yahoo {
  border: 2px solid $color-yahoo;
  background-color: $color-yahoo;
  width: 100%;
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
</style>
