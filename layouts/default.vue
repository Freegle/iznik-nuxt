<template>
  <div>
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
            <fa icon="coffee" size="2x" /><br>
            ChitChat
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/mygroups">
            <fa icon="users" size="2x" /><br>
            My&nbsp;Groups
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/give">
            <fa icon="gift" size="2x" /><br>
            Give
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/find">
            <fa icon="search" size="2x" /><br>
            Find
          </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item id="menu-option-notification" class="text-center p-0" />
          <b-nav-item-dropdown class="text-center notiflist" lazy>
            <template slot="button-content">
              <fa icon="bell" size="2x" /><br>Notifications
            </template>
            <b-dropdown-item v-for="(notification, $index) in notifications" :key="'notification-' + $index" href="#">
              <Notification v-bind="notification" />
            </b-dropdown-item>
            <infinite-loading @infinite="loadMore">
              <span slot="no-results" />
              <span slot="no-more" />
              <span slot="spinner">
                <b-img-lazy src="~/static/loader.gif" />
              </span>
            </infinite-loading>
          </b-nav-item-dropdown>

          <b-nav-item id="menu-option-chat" class="text-center p-0" to="/chats">
            <fa icon="comments" size="2x" /><br>
            Chats
          </b-nav-item>
          <b-nav-item class="text-center p-0" @click="signOut()">
            <fa icon="sign-out-alt" size="2x" /><br>
            Logout
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
      <ul class="navbar-nav mr-auto" />
      <ul class="nav navbar-nav navbar-right">
        <li>
          <b-button v-if="!loggedIn" v-b-modal.signInModal class="btn-white">
            Sign in
          </b-button>
        </li>
      </ul>
      <b-navbar-toggle v-if="loggedIn" target="nav_collapse" />
    </b-navbar>
    <nuxt class="ml-0 pl-1 pageContent" />
    <b-modal id="signInModal" ref="loginModal" title="Sign In">
      <template slot="default">
        <b-form-input ref="email" v-model="email" placeholder="Your email address" alt="Email address" />
        <b-form-input ref="password" v-model="password" type="password" placeholder="Your password" alt="Password" />
      </template>

      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button size="sm" variant="white" @click="cancel()">
          Cancel
        </b-button>
        <b-button size="sm" variant="success" @click="signInNative()">
          Sign in
        </b-button>
      </template>
    </b-modal>
    <ChatPopups />
  </div>
</template>

<style scoped>
/*TODO Make menu dropdown horizontal on mobile*/
/*TODO Shrink navbar on scroll?*/
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
</style>

<script>
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
      complete: false
    }
  },

  serverPrefetch() {
    // We need to prefetch the session on the server side so that we are logged in, otherwise we'll render the
    // page logged out in what we return to the client, which will cause flicker.
    return this.$auth.fetchUser()
  },

  computed: {
    loggedIn() {
      return this.$store.state.auth.user
    },
    notifications() {
      const notifications = Object.values(
        this.$store.getters['notifications/list']()
      )
      return notifications
    }
  },

  async mounted() {
    await this.$store.dispatch('notifications/clear')
    await this.$store.dispatch('notifications/list')
  },

  methods: {
    signOut() {
      this.$auth.logout()

      // Remove all cookies, both client and server.  This seems to be necessary to kill off the PHPSESSID cookie
      // on the server, which would otherwise keep us logged in despite our efforts.
      this.$cookies.removeAll()
    },

    async signInNative() {
      await this.$auth
        .loginWith('native', {
          data: {
            email: this.email,
            password: this.password
          }
        })
        .catch(e => {
          console.error('Failed login', e)
        })

      this.$refs.loginModal.hide()
    },

    logout() {
      console.log('Logout')
      this.$store.dispatch('security/logout').then(() => {
        console.log('Now go to home page')
        this.$router.push({
          path: '/'
        })
      })
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
          .dispatch('notifications/list', {
            chatid: this.id
          })
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
    }
  }
}
</script>
