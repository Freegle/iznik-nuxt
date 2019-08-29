<template>
  <div>
    <client-only>
      <b-navbar toggleable="lg" type="dark" class="ourBack">
        <b-navbar-brand to="/" class="p-0">
          <b-img
            class="logo mr-2"
            height="58"
            width="58"
            rounded
            :src="require(`@/static/icon.png`)"
            alt="Home"
          />
        </b-navbar-brand>
        <b-collapse v-if="loggedIn" id="nav_collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item class="text-center p-0" to="/chitchat">
              <v-icon name="coffee" scale="2" /><br>
              ChitChat
            </b-nav-item>
            <b-nav-item class="text-center p-0" to="/mygroups">
              <v-icon name="users" scale="2" /><br>
              My&nbsp;Groups
            </b-nav-item>
            <b-nav-item class="text-center p-0" to="/give">
              <v-icon name="gift" scale="2" /><br>
              Give
            </b-nav-item>
            <b-nav-item class="text-center p-0" to="/find">
              <v-icon name="search" scale="2" /><br>
              Find
            </b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item id="menu-option-notification" class="text-center p-0" />
            <b-nav-item-dropdown class="text-center notiflist" lazy right @shown="showNotifications">
              <template slot="button-content">
                <v-icon name="bell" scale="2" /><br>Notifications
              </template>
              <b-dropdown-item v-for="(notification, $index) in notifications" :key="'notification-' + $index" class="p-0 test">
                <Notification :notification="notification" />
              </b-dropdown-item>
              <infinite-loading @infinite="loadMore">
                <span slot="no-results" />
                <span slot="no-more" />
                <span slot="spinner">
                  <b-img-lazy src="~/static/loader.gif" />
                </span>
              </infinite-loading>
            </b-nav-item-dropdown>
            <a class="d-none dropdown-item" />
            <b-nav-item id="menu-option-chat" class="text-center p-0" to="/chats">
              <v-icon name="comments" scale="2" /><br>
              Chats
            </b-nav-item>
            <b-nav-item class="text-center p-0" @click="logOut()">
              <v-icon name="sign-out-alt" scale="2" /><br>
              Logout
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
        <ul class="navbar-nav mr-auto" />
        <ul class="nav navbar-nav navbar-right">
          <li>
            <b-button v-if="!loggedIn" class="btn-white" @click="requestLogin">
              Sign in
            </b-button>
          </li>
        </ul>
        <b-navbar-toggle v-if="loggedIn" target="nav_collapse" />
      </b-navbar>
      <nuxt class="ml-0 pl-1 pageContent" />
      <ChatPopups v-if="loggedIn" />
      <b-modal
        v-if="showModal"
        id="loginModal"
        ref="loginModal"
        title="Let's get freegling!"
        no-stacking
        visible
        size="lg"
        hide-footer
        no-close-on-backdrop
        @hide="modalHide"
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
            <b-img alt="Facebook login" class="loginbutton clickme" src="~/static/signinbuttons/facebook.png" @click="loginFacebook" />
            <b-img alt="Google login" :class="'loginbutton clickme ' + disabled('google')" src="~/static/signinbuttons/google.png" @click="loginGoogle" />
            <b-img alt="Yahoo login" class="loginbutton clickme" src="~/static/signinbuttons/yahoo.png" @click="loginYahoo" />
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
    </client-only>
  </div>
</template>

<style scoped>
/*TODO Make menu dropdown horizontal on mobile*/
/*TODO DESIGN Spacing of icons with different length text is wrong.*/
/*TODO Shrink navbar on scroll ?*/
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.dropdown-item {
  padding-left: 0px;
}

.notiflist {
  max-width: 100%;
}

.loginbutton {
  width: 303px;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.ourBack {
  background-color: #61ae24 !important;
}

nav .navbar-nav li a {
  color: #cdcdcd !important;
}

nav .navbar-nav li a.nuxt-link-active {
  color: white !important;
}

.navbar-brand a {
  color: white !important;
}

.navbar a.navbar-brand {
  padding: 0px;
}

.navbar .logo {
  width: 58px !important;
  padding: 0px;
  margin-top: -5px;
  margin-bottom: -5px;
}

body.modal-open {
  padding-right: 0px !important;
}

svg.fa-icon {
  height: 32px;
}

.signindisabled {
  opacity: 0.2;
  pointer-events: none;
}

.dropdown-item {
  padding-left: 0px;
  padding-right: 0px;
}
</style>

<script>
import Vue from 'vue'
import ChatPopups from '~/components/ChatPopups'
import Notification from '~/components/Notification'

export default {
  components: {
    ChatPopups,
    Notification
  },

  data: function() {
    return {
      email: null,
      password: null,
      complete: false,
      error: null,
      socialblocked: false,
      existinguser: true,
      pleaseLogin: null
    }
  },

  computed: {
    showModal() {
      const forceLogin = this.$store.getters['auth/forceLogin']()
      return forceLogin || this.pleaseLogin
    },
    loggedIn() {
      const ret = Boolean(this.$store.getters['auth/user']())
      return ret
    },
    notifications() {
      const notifications = Object.values(
        this.$store.getters['notifications/list']()
      )
      return notifications
    },
    googleDisabled() {
      return !window.gapi || !window.gapi.client || !window.auth2
    }
  },

  async mounted() {
    await this.$store.dispatch('notifications/clear')
    // await this.$store.dispatch('notifications/list')
  },

  methods: {
    disabled(type) {
      // TODO We might compute this the first time before the API has loaded, and therefore still show the
      // button disabled even after the API has loaded successfully.
      let ret = false
      switch (type) {
        case 'google':
          ret = !window.gapi || !window.gapi.client
          break
      }

      return ret ? 'signindisabled' : ''
    },
    requestLogin() {
      console.log('Request login')
      this.pleaseLogin = new Date().getTime()
    },
    modalHide() {
      // We've closed the modal.  If we opened it because we'd clicked to do so, that no longer applies.
      console.log('Modal hide')
      this.pleaseLogin = false
    },
    loginNative(e) {
      console.log('loginNative')
      e.preventDefault()
      e.stopPropagation()

      this.$store
        .dispatch('auth/login', {
          email: this.email,
          password: this.password
        })
        .then(() => {
          // We are now logged in.
          this.pleaseLogin = false
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
          this.pleaseLogin = false
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
            this.pleaseLogin = false
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
            this.pleaseLogin = false
          } else {
            // TODO
            console.error('Server login failed', ret)
          }
        })
        .catch(e => {
          // TODO
          console.error('Yahoo login failed', e)
        })
    },

    logOut() {
      // Remove all cookies, both client and server.  This seems to be necessary to kill off the PHPSESSID cookie
      // on the server, which would otherwise keep us logged in despite our efforts.
      this.$cookies.removeAll()

      // Go to the landing page.
      this.$router.push('/')

      this.$store.dispatch('auth/setUser', null)
    },

    loadMore: function($state) {
      const currentCount = this.notifications.length

      if (this.complete) {
        // This is a bit weird - calling complete() works here to stop the plugin firing, but not lower down in the
        // callback.  And we get the error message about no results, so I've overridden it above to be empty.
        // TODO Figure out what's going on here.  This kinda works but it's hacky.
        $state.complete()
      } else {
        this.busy = true
        this.$store
          .dispatch('notifications/list')
          .then(() => {
            try {
              const notifications = this.$store.getters['notifications/list']()

              if (currentCount === notifications.length) {
                this.complete = true
                $state.complete()
                console.log('Complete')
              } else {
                $state.loaded()
                console.log('Loaded')
              }
              this.busy = false
            } catch (e) {
              console.error(e)
              console.log('Error')
            }
          })
          .catch(e => {
            console.error(e)
            this.busy = false
            $state.complete()
          })
      }
    },

    showNotifications() {
      // We want to make sure we have the most up to date notifications.
      console.log('Click notifications')
      this.$store.dispatch('notifications/clearContext')
      this.$store.dispatch('notifications/list')
    }
  }
}
</script>
