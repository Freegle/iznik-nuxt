<template>
  <b-modal
    v-if="!loggedIn"
    id="loginModal"
    ref="loginModal"
    v-model="showModal"
    no-stacking
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
      You'll get emails.  Name, approx. location, and profile picture are public - you can hide your real name and
      picture from Settings.  Logging in adds cookies and local
      storage.  Read <nuxt-link target="_blank" to="/terms">
        Terms of Use
      </nuxt-link> and
      <nuxt-link target="_blank" to="/privacy">
        Privacy
      </nuxt-link> for details.  Ok?  Now come on in...
    </p>
    <p v-if="modtools" class="text-center">
      <!-- eslint-disable-next-line -->
      Need temporary help moderating?  Mail <ExternalLink href="mailto:mentors@ilovefreegle.org">mentors@ilovefreegle.org</ExternalLink>.
    </p>
    <p v-if="loginType" class="text-center font-weight-bold">
      You usually sign in using {{ loginType }}.
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
          Social sign in blocked - check your privacy settings, including any ad blockers such as
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
        <h3 class="signin__header pb-0">
          <span v-if="signUp">
            Create an account on Freegle
          </span>
          <span v-else>Continue with your Freegle account</span>
        </h3>
        <span v-if="signUp" class="text-center">
          <b>Already a freegler?
            <b-btn variant="link" class="font-weight-bold pl-1 py-0 border-0 align-top" @click="clickShowSignIn">
              Sign In
            </b-btn>
          </b></span>
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
          <EmailValidator
            ref="email"
            size="md"
            label="Your email address:"
            :valid="emailValid"
            :email="email"
            @update:valid="emailValid = $event"
            @update:email="email = $event"
          />
          <NoticeMessage v-if="referToGoogleButton">
            Please use the <em>Continue with Google</em> button to sign in.  That way you don't need to remember a password on this site.
          </NoticeMessage>
          <NoticeMessage v-if="referToYahooButton">
            Please use the <em>Continue with Yahoo</em> button to sign in.  That way you don't need to remember a password on this site.
          </NoticeMessage>
          <PasswordEntry v-model="password" :original-password="password" />
          <b-btn
            v-b-modal.add
            block
            size="lg"
            variant="primary"
            class="mb-2 mt-2"
            type="submit"
            value="login"
            :disabled="!emailValid || !password"
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
              New freegler?
              <b-btn variant="link" class="pl-1 pr-0 py-0 border-0 align-top" @click="clickShowSignUp">
                Sign Up
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
      pleaseShowModal: false,
      showSignUp: false,
      forceSignIn: false,
      nativeLoginError: null,
      socialLoginError: null,
      showPassword: false,
      loginType: null
    }
  },

  computed: {
    modtools() {
      return this.$store.getters['misc/get']('modtools')
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
    },
    show() {
      this.pleaseShowModal = true
      this.nativeLoginError = null
      this.socialLoginError = null
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

      if (this.signUp) {
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
              await this.$store.dispatch('auth/fetchUser', {
                components: ['me'],
                force: true
              })

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

    loginGoogle() {
      this.$store.dispatch('auth/setLoginType', 'Google')

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
</style>
