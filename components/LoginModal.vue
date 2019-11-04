<template>
  <b-modal
    id="loginModal"
    ref="loginModal"
    v-model="showModal"
    title="Let's get freegling!"
    no-stacking
    visible
    size="lg"
    hide-footer
    no-close-on-backdrop
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
        <b-img alt="Facebook login" class="loginbutton clickme" src="~/static/signinbuttons/facebook.png" @click="loginFacebook" />
        <b-img alt="Google login" :class="'mb-1 loginbutton clickme ' + disabled('google')" src="~/static/signinbuttons/google.png" @click="loginGoogle" />
        <b-img alt="Yahoo login" class="loginbutton clickme" src="~/static/signinbuttons/yahoo.png" @click="loginYahoo" />
        <b-alert v-if="socialblocked" variant="error">
          Social login blocked - check your privacy settings
        </b-alert>
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
          <div v-if="existinguser">
            <b-row>
              <b-col>
                <b-form-input
                  id="email"
                  ref="email"
                  v-model="email"
                  name="email"
                  placeholder="Your email address"
                  alt="Email address"
                  class="mb-3"
                  autocomplete="username email"
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
                  autocomplete="current-password"
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
</template>

<style scoped lang="scss">
@import 'color-vars';

.loginbutton {
  width: 303px;
}

.login__splitter {
  border-top: 1px solid $color-red;
}
</style>

<script>
// TODO Sign Up
// TODO Eye icon to show password for mobile
// TODO DESIGN Spacing and alignment of the buttons is a bit off.
import Vue from 'vue'

export default {
  // props: {
  // TODO
  //   showSignIn: {
  //     type: Boolean,
  //     required: false,
  //     default: false
  //   }
  // },
  data: function() {
    return {
      email: null,
      password: null,
      socialblocked: false,
      existinguser: true,
      pleaseShowModal: false
    }
  },

  computed: {
    googleDisabled() {
      const ret =
        !window || !window.gapi || !window.gapi.client || !window.auth2
      return ret
    },

    showModal() {
      return this.pleaseShowModal || this.$store.getters['auth/forceLogin']()
    }
  },

  methods: {
    show() {
      this.pleaseShowModal = true
    },
    hide() {
      this.pleaseShowModal = false
    },
    disabled(type) {
      // TODO We might compute this the first time before the API has loaded, and therefore still show the
      // button disabled even after the API has loaded successfully.
      let ret = false
      switch (type) {
        case 'google':
          ret = !window || !window.gapi || !window.gapi.client
          break
      }

      return ret ? 'signindisabled' : ''
    },
    loginNative(e) {
      console.log('loginNative')
      const self = this
      e.preventDefault()
      e.stopPropagation()

      this.$store
        .dispatch('auth/login', {
          email: this.email,
          password: this.password
        })
        .then(() => {
          // We are now logged in. Prompt the browser to remember the credentials.
          if (window.PasswordCredential) {
            const c = new window.PasswordCredential(e.target)
            navigator.credentials
              .store(c)
              .then(function() {
                self.pleaseShowModal = false
              })
              .catch(err => {
                console.error('Failed to save credentials', err)
              })
          } else {
            self.pleaseShowModal = false
          }
        })
        .catch(e => {
          // TODO
          console.error('Native login failed', e)
        })
    },
    async loginFacebook() {
      console.log('Facebook login')
      // TODO Do we still have the Chrome on IOS problem?
      try {
        let response = null
        const promise = new Promise(function(resolve, reject) {
          Vue.FB.login(
            function(ret) {
              console.log('Returned in promise', ret)
              response = ret
              resolve()
            },
            { scope: 'email' }
          )
        })

        await promise
        console.log('Returned after promise', response)
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken
          console.log('Now login on server', accessToken)

          await this.$store.dispatch('auth/login', {
            fblogin: 1,
            fbaccesstoken: accessToken
          })

          // We are now logged in.
          console.log('Logged in')
          self.pleaseShowModal = false
        } else {
          console.error('Facebook response missing auth', response)
          throw new Error('Facebook response missing auth')
        }
      } catch (e) {
        // TODO
        console.error('Native login failed', e)
      }
    },

    loginGoogle() {
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
            // TODO
            console.error('There was an error: ' + authResult.error)
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
      console.log(
        'Yahoo login',
        this.$route.query.page,
        window.location,
        document.URL
      )
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
      console.log('Got URL params', urlParams)

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
            const re = new RegExp(apihost, 'g')
            url = url.replace(
              re,
              window.location.hostname +
                (window.location.port ? ':' + window.location.port : '')
            )
            console.log('Redirect to Yahoo', url)
            window.location = url
          } else if (ret.ret === 0) {
            // We are logged in.  Get the logged in user
            console.log('Logged in')
            this.$store.dispatch('auth/fetchUser')
            self.pleaseShowModal = false
          } else {
            // TODO
            console.error('Server login failed', ret)
          }
        })
        .catch(e => {
          // TODO
          console.error('Yahoo login failed', e)
        })
    }
  }
}
</script>
