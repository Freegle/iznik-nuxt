<template>
  <div>
    <client-only>
      <!-- Navbar for large screens -->
      <b-navbar id="navbar_large" toggleable="lg" type="dark" class="ourBack d-none d-md-flex">
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
        <b-navbar-toggle v-if="loggedIn" target="nav_collapse" />
        <b-collapse v-if="loggedIn" id="nav_collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item id="menu-option-chitchat" class="text-center p-0" to="/chitchat" @mousedown="maybeReload('/chitchat')">
              <v-icon name="coffee" scale="2" /><br>
              ChitChat
            </b-nav-item>
            <b-nav-item id="menu-option-myposts" class="text-center p-0" to="/myposts" @mousedown="maybeReload('/myposts')">
              <v-icon name="home" scale="2" /><br>
              My&nbsp;Posts
            </b-nav-item>
            <b-nav-item id="menu-option-mygroups" class="text-center p-0" to="/mygroups" @mousedown="maybeReload('/mygroups')">
              <v-icon name="users" scale="2" /><br>
              My&nbsp;Groups
            </b-nav-item>
            <b-nav-item id="menu-option-give" class="text-center p-0" to="/give" @mousedown="maybeReload('/give')">
              <v-icon name="gift" scale="2" /><br>
              Give
            </b-nav-item>
            <b-nav-item id="menu-option-find" class="text-center p-0" to="/find" @mousedown="maybeReload('/find')">
              <v-icon name="search" scale="2" /><br>
              Find
            </b-nav-item>
            <b-nav-item id="menu-option-explore" class="text-center p-0" to="/explore" @mousedown="maybeReload('/explore')">
              <v-icon name="map-marked-alt" scale="2" /><br>
              Explore
            </b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item id="menu-option-notification" class="text-center p-0" />
            <b-nav-item-dropdown class="white text-center notiflist" lazy right @shown="showNotifications">
              <template slot="button-content">
                <v-icon name="bell" scale="2" class="ml-3" /><br>Notifications
              </template>
              <b-dropdown-item v-for="(notification, $index) in notifications" :key="'notification-' + $index" class="p-0 notpad">
                <Notification :notification="notification" class="p-0" @showModal="showAboutMe" />
              </b-dropdown-item>
              <infinite-loading :distance="distance" @infinite="loadMore">
                <span slot="no-results" />
                <span slot="no-more" />
                <span slot="spinner">
                  <b-img-lazy src="~/static/loader.gif" />
                </span>
              </infinite-loading>
            </b-nav-item-dropdown>
            <a class="d-none dropdown-item" />
            <b-nav-item id="menu-option-chat" class="text-center p-0" to="/chats" @mousedown="maybeReload('/chats')">
              <v-icon name="comments" scale="2" /><br>
              Chats
            </b-nav-item>
            <b-nav-item id="menu-option-settings" class="text-center p-0" to="/settings" @mousedown="maybeReload('/settings')">
              <v-icon name="cog" scale="2" /><br>
              Settings
            </b-nav-item>
            <b-nav-item id="menu-option-logout" class="text-center p-0" @click="logOut()">
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
      </b-navbar>
      <!-- Navbar for small screens -->
      <b-navbar id="navbar_small" toggleable="md" type="dark" class="ourBack d-flex d-md-none">
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
        <nuxt-link id="menu-option-chat" class="text-center p-0 white" to="/chats" style="position: absolute; right: 110px;">
          <v-icon name="comments" scale="2" /><br>
        </nuxt-link>
        <b-dropdown
          class="white text-center notiflist"
          variant="success"
          lazy
          right
          style="position: absolute; right: 50px;"
          @shown="showNotifications"
        >
          <template slot="button-content">
            <v-icon name="bell" scale="2" />
          </template>
          <b-dropdown-item v-for="(notification, $index) in notifications" :key="'notification-' + $index" class="p-0 notpad">
            <Notification :notification="notification" class="p-0" @showModal="showAboutMe" />
          </b-dropdown-item>
          <infinite-loading :distance="distance" @infinite="loadMore">
            <span slot="no-results" />
            <span slot="no-more" />
            <span slot="spinner">
              <b-img-lazy src="~/static/loader.gif" />
            </span>
          </infinite-loading>
        </b-dropdown>
        <a class="d-none dropdown-item" />
        <b-navbar-toggle v-if="loggedIn" target="nav_collapse_mobile" style="position: absolute; right: 0px;" />
        <ul class="navbar-nav mr-auto" />
        <ul class="nav navbar-nav navbar-right">
          <li>
            <b-button v-if="!loggedIn" class="btn-white" @click="requestLogin">
              Sign in
            </b-button>
          </li>
        </ul>
      </b-navbar>
      <b-collapse v-if="loggedIn" id="nav_collapse_mobile" class="w-100 ourBack">
        <b-navbar-nav class="ml-auto flex-row small">
          <b-nav-item class="text-center p-0 white" to="/chitchat" @mousedown="maybeReload('/chitchat')">
            <v-icon name="coffee" scale="2" /><br>
            ChitChat
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/myposts" @mousedown="maybeReload('/myposts')">
            <v-icon name="home" scale="2" /><br>
            My&nbsp;Posts
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/give" @mousedown="maybeReload('/give')">
            <v-icon name="gift" scale="2" /><br>
            Give
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/find" @mousedown="maybeReload('/find')">
            <v-icon name="search" scale="2" /><br>
            Find
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/mygroups" @mousedown="maybeReload('/mygroups')">
            <v-icon name="users" scale="2" /><br>
            My&nbsp;Groups
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/explore" @mousedown="maybeReload('/explore')">
            <v-icon name="map-marked-alt" scale="2" /><br>
            Explore
          </b-nav-item>
          <b-nav-item id="menu-option-chat" class="text-center p-0" to="/chats" @mousedown="maybeReload('/chats')">
            <v-icon name="comments" scale="2" /><br>
            Chats
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/settings" @mousedown="maybeReload('/settings')">
            <v-icon name="cog" scale="2" /><br>
            Settings
          </b-nav-item>
          <b-nav-item class="text-center p-0" @click="logOut()">
            <v-icon name="sign-out-alt" scale="2" /><br>
            Logout
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>

      <nuxt ref="pageContent" class="ml-0 pl-1 pageContent" />
      <ChatPopups v-if="loggedIn" />
      <LoginModal ref="loginModal" />
      <AboutMeModal ref="modal" />
      <div class="navbar-toggle" style="display: none" />
    </client-only>
  </div>
</template>

<style scoped>
/*TODO DESIGN Menu dropdown on mobile needs a bit of love.*/
/*TODO Shrink navbar on scroll? */
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

#navbar_large .nav-item {
  width: 95px;
  text-align: center;
}

nav .navbar-nav li a.nuxt-link-active[data-v-314f53c6] {
  color: rgba(255, 255, 255, 0.5) !important;
}

.navbar-dark .navbar-nav .nav-link {
  color: white !important;
}

.navbar-dark .navbar-nav .nav-link:hover,
.navbar-dark .navbar-nav .nav-link:focus {
  color: rgba(255, 255, 255, 0.75) !important;
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
const LoginModal = () => import('~/components/LoginModal')
const AboutMeModal = () => import('~/components/AboutMeModal')
const ChatPopups = () => import('~/components/ChatPopups')
const Notification = () => import('~/components/Notification')

export default {
  components: {
    ChatPopups,
    Notification,
    AboutMeModal,
    LoginModal
  },

  data: function() {
    return {
      complete: false,
      distance: 1000
    }
  },

  computed: {
    loggedIn() {
      const ret = Boolean(this.$store.getters['auth/user']())
      return ret
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
    // await this.$store.dispatch('notifications/list')
  },

  methods: {
    showAboutMe() {
      this.$refs.modal.show()
    },
    logOut() {
      // Remove all cookies, both client and server.  This seems to be necessary to kill off the PHPSESSID cookie
      // on the server, which would otherwise keep us logged in despite our efforts.
      try {
        this.$cookies.removeAll()
      } catch (e) {}

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
    },

    requestLogin() {
      this.$refs.loginModal.show()
    },

    maybeReload(route) {
      if (this.$router.currentRoute.path === route) {
        // We have clicked to route to the page we're already on.  Force a full refresh.
        window.location.reload(true)
      }
    }
  }
}
</script>
