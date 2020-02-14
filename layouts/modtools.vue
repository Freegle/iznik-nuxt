<template>
  <div class="pageback">
    <b-navbar id="navbar" type="dark" class="navback" fixed="top">
      <b-navbar-brand to="/modtools" class="p-0">
        <b-img
          class="logo mr-2"
          height="58"
          width="58"
          rounded
          :src="logo"
          alt="Home"
        />
      </b-navbar-brand>
      <client-only>
        <b-navbar-nav />
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="loggedIn" id="menu-option-modtools-discourse" class="text-center p-0" />
          <b-nav-item v-if="loggedIn" id="menu-option-modtools-chat" class="text-center p-0" to="/modtools/chats">
            <div class="notifwrapper">
              <v-icon name="comments" scale="2" /><br>
              Chats
              <b-badge v-if="chatCount" variant="danger">
                {{ chatCount }}
              </b-badge>
            </div>
          </b-nav-item>
          <b-nav-item v-if="loggedIn" id="menu-option-modtools-logout" class="text-center p-0 small" @click="logOut()">
            <v-icon name="sign-out-alt" scale="2" /><br>
            Logout
          </b-nav-item>
          <b-nav-item v-if="!loggedIn">
            <b-btn variant="white" @click="requestLogin">
              Sign in
            </b-btn>
          </b-nav-item>
        </b-navbar-nav>
      </client-only>
    </b-navbar>

    <div class="d-flex">
      <div class="leftmenu">
        <!--        TODO Counts for work-->
        <!--        TODO Reload on click-->
        <nuxt-link to="/modtools">
          Dashboard
        </nuxt-link>
        <hr>
        <div>
          Messages
        </div>
        <div>
          <!-- eslint-disable-next-line -->
          <nuxt-link to="/modtools/messages/pending" class="pl-3">Pending</nuxt-link>
          <b-badge v-if="getCount('pending')" variant="danger">
            {{ getCount('pending') }}
          </b-badge>
        </div>
        <div>
          <!-- eslint-disable-next-line -->
          <nuxt-link to="/modtools/messages/approved" class="pl-3">Approved</nuxt-link>
        </div>
      </div>
      <nuxt ref="pageContent" class="ml-0 pl-0 pl-sm-1 pr-0 pr-sm-1 pageContent flex-grow-1" />
    </div>
    <client-only>
      <ChatPopups v-if="loggedIn" class="d-none d-sm-block" />
      <LoginModal ref="loginModal" />
    </client-only>
  </div>
</template>

<script>
import LoginModal from '~/components/LoginModal'

const ChatPopups = () => import('~/components/ChatPopups')

export default {
  components: {
    ChatPopups,
    LoginModal
  },

  data: function() {
    return {
      logo: require(`@/static/icon_modtools.png`)
    }
  },

  computed: {
    loggedIn() {
      const ret = Boolean(this.$store.getters['auth/user'])
      return ret
    },
    me() {
      return this.$store.getters['auth/user']
    },
    work() {
      return this.$store.getters['auth/work']
    },
    chatCount() {
      return this.$store.getters['chats/unseenCount']
    }
  },

  watch: {
    $route() {
      // Close the dropdown menu when we move around.
      if (
        this.$refs.nav_collapse &&
        this.$refs.nav_collapse.$el.classList.contains('show')
      ) {
        this.$root.$emit('bv::toggle::collapse', 'nav_collapse')
      }

      if (
        this.$refs.nav_collapse_mobile &&
        this.$refs.nav_collapse_mobile.$el.classList.contains('show')
      ) {
        this.$root.$emit('bv::toggle::collapse', 'nav_collapse_mobile')
      }
    }
  },

  mounted() {
    // Ensure we know whether we're FD or MT.
    this.$store.dispatch('misc/set', {
      key: 'modtools',
      value: true
    })

    this.workTimer = setTimeout(this.checkWork, 0)
    this.$store.dispatch('modconfigs/fetch')
  },

  beforeDestroy() {
    if (this.workTimer) {
      clearTimeout(this.workTimer)
    }
  },

  methods: {
    async logOut() {
      // Remove all cookies, both client and server.  This seems to be necessary to kill off the PHPSESSID cookie
      // on the server, which would otherwise keep us logged in despite our efforts.
      try {
        this.$cookies.removeAll()
      } catch (e) {}

      await this.$store.dispatch('auth/logout')
      this.$store.dispatch('auth/forceLogin', false)

      // Go to the landing page.
      this.$router.push('/')
    },
    requestLogin() {
      this.$refs.loginModal.show()
    },
    checkWork() {
      this.$store.dispatch('auth/fetchUser', {
        components: ['work'],
        force: true
      })

      setTimeout(this.checkWork, 30000)
    },
    getCount(type) {
      for (const key in this.work) {
        if (key === type) {
          return this.work[key]
        }
      }

      return 0
    }
  },

  head() {
    // TODO Counts
    const totalCount = this.chatCount
    return {
      titleTemplate: totalCount > 0 ? `(${totalCount}) ModTools` : 'ModTools',
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/icon_modtools.png'
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

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

.pageback {
  background-color: $color-modtools-green--light;
}

#navbar .nav-item {
  width: 80px;
  text-align: center;
}

.pageContent {
  padding-top: 68px;
}

/* Style the external nav-link class */
::v-deep .nav-link {
  padding-left: 2px !important;
  padding-right: 2px !important;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

nav .navbar-nav li a.nuxt-link-active[data-v-314f53c6] {
  color: $color-white-opacity-50 !important;
}

.navbar-dark .navbar-nav .nav-link {
  color: $color-white !important;

  &:hover,
  &:focus {
    color: $color-white-opacity-75 !important;
  }
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.navback {
  background-color: $color-modtools-blue--dark !important;
}

nav .navbar-nav li a {
  color: $color-gray--light !important;
}

nav .navbar-nav li a.nuxt-link-active {
  color: $color-white !important;
}

.navbar-brand a {
  color: $color-white !important;
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

.chatbadge {
  position: absolute;
  top: 0px;
  left: 25px;
}

.leftmenu {
  height: 100vh;
  min-width: 200px;
  padding-top: 68px;
  font-size: 1.4em;
  background-color: $color-modtools-leftmenu-bg;

  a {
    color: $color-modtools-menu;
  }
}
</style>
