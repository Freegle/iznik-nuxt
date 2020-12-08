<template>
  <header>
    <!-- Navbar for large screens-->
    <b-navbar id="navbar_large" toggleable="xl" type="dark" class="ourBack d-none d-xl-flex pl-1" fixed="top">
      <b-navbar-brand to="/" class="p-0">
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
        <b-navbar-toggle v-if="loggedIn" target="nav_collapse" />
        <b-collapse v-if="loggedIn" id="nav_collapse" ref="nav_collapse" is-nav class="flex-nowrap justify-content-between">
          <b-navbar-nav class="mainnav mainnav--left">
            <b-nav-item id="menu-option-mygroups" class="text-center small p-0 ml-2" to="/browse" @mousedown="maybeReload('/browse')">
              <v-icon name="eye" scale="2" /><br>
              <span class="nav-item__text">Browse</span>
            </b-nav-item>
            <b-nav-item id="menu-option-give" class="text-center small p-0" to="/give" @mousedown="maybeReload('/give')">
              <v-icon name="gift" scale="2" /><br>
              <span class="nav-item__text">Give</span>
            </b-nav-item>
            <b-nav-item id="menu-option-find" class="text-center small p-0" to="/find" @mousedown="maybeReload('/find')">
              <v-icon name="shopping-cart" scale="2" /><br>
              <span class="nav-item__text">&nbsp;Ask</span>
            </b-nav-item>
            <b-nav-item id="menu-option-myposts" class="text-center small p-0" to="/myposts" @mousedown="maybeReload('/myposts')">
              <v-icon name="home" scale="2" /><br>
              <span class="nav-item__text">My Posts</span>
            </b-nav-item>
            <b-nav-item v-if="!simple" id="menu-option-chitchat" class="text-center small p-0" to="/chitchat" @mousedown="maybeReload('/chitchat')">
              <v-icon name="coffee" scale="2" /><br>
              <span class="nav-item__text">ChitChat</span>
            </b-nav-item>
            <b-nav-item v-if="!simple" id="menu-option-communityevents" class="text-center small p-0" to="/communityevents" @mousedown="maybeReload('/communityevents')">
              <v-icon name="calendar-alt" scale="2" /><br>
              <span class="nav-item__text">Events</span>
            </b-nav-item>
            <b-nav-item v-if="!simple" id="menu-option-volunteering" class="text-center small p-0" to="/volunteerings" @mousedown="maybeReload('/volunteerings')">
              <v-icon name="hands-helping" scale="2" /><br>
              <span class="nav-item__text">Volunteer</span>
            </b-nav-item>
          </b-navbar-nav>
          <client-only>
            <div class="simplewrapper pb-2">
              <SimpleView :key="'simpleview-' + simple" navbar />
            </div>
          </client-only>
          <b-navbar-nav class="mainnav mainnav--right">
            <NotificationOptions v-if="!simple" :distance="distance" :small-screen="false" :unread-notification-count.sync="unreadNotificationCount" @showAboutMe="showAboutMe" />
            <ChatMenu id="menu-option-chat" :is-list-item="true" :chat-count.sync="chatCount" />
            <b-nav-item v-if="!simple" id="menu-option-spread" class="text-center small p-0" to="/promote" @mousedown="maybeReload('/promote')">
              <div class="position-relative">
                <v-icon name="bullhorn" scale="2" /><br>
                <span class="nav-item__text">Promote</span>
              </div>
            </b-nav-item>
            <b-nav-item id="menu-option-help" class="text-center small p-0" to="/help" @mousedown="maybeReload('/help')">
              <v-icon name="question-circle" scale="2" /><br>
              <span class="nav-item__text">Help</span>
            </b-nav-item>
            <b-nav-item id="menu-option-settings" class="text-center small p-0" to="/settings" @mousedown="maybeReload('/settings')">
              <v-icon name="cog" scale="2" /><br>
              <span class="nav-item__text">Settings</span>
            </b-nav-item>
            <b-nav-item id="menu-option-logout" class="text-center p-0 small" @click="logOut">
              <v-icon name="sign-out-alt" scale="2" /><br>
              <span class="nav-item__text">Logout</span>
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </client-only>
      <b-navbar-nav v-if="!loggedIn" class="ml-auto">
        <client-only>
          <b-nav-item>
            <div class="btn btn-white" @click="requestLogin">
              Sign&nbsp;in
            </div>
          </b-nav-item>
        </client-only>
      </b-navbar-nav>
    </b-navbar>
    <!-- Navbar for small screens -->
    <b-navbar id="navbar_small" toggleable="xl" type="dark" class="ourBack d-flex justify-content-between d-xl-none" fixed="top">
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
      <div class="d-flex align-items-center">
        <client-only>
          <NotificationOptions :distance="distance" :small-screen="true" :unread-notification-count.sync="unreadNotificationCount" @showAboutMe="showAboutMe" />
          <ChatMenu v-if="loggedIn" id="menu-option-chat-sm" :is-list-item="false" :chat-count.sync="chatCount" class="mr-3" />
        </client-only>

        <b-navbar-nav>
          <client-only>
            <b-nav-item v-if="!loggedIn">
              <div class="btn btn-white" @click="requestLogin">
                Sign in
              </div>
            </b-nav-item>
          </client-only>
        </b-navbar-nav>

        <b-navbar-nav class="">
          <b-btn v-if="loggedIn" v-b-toggle.nav_collapse_mobile class="toggler white">
            <v-icon name="bars" class="mb-1" scale="1.5" />
          </b-btn>
        </b-navbar-nav>
      </div>
      <b-collapse v-if="loggedIn" id="nav_collapse_mobile" ref="nav_collapse_mobile" class="w-100 ourBack">
        <b-navbar-nav class="ml-auto flex-row flex-wrap small">
          <b-nav-item class="text-center p-0" to="/browse" @mousedown="maybeReload('/browse')">
            <v-icon name="eye" scale="2" /><br>
            <span class="nav-item__text">Browse</span>
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/give" @mousedown="maybeReload('/give')">
            <v-icon name="gift" scale="2" /><br>
            <span class="nav-item__text">Give</span>
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/find" @mousedown="maybeReload('/find')">
            <v-icon name="shopping-cart" scale="2" /><br>
            <span class="nav-item__text">Ask</span>
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/myposts" @mousedown="maybeReload('/myposts')">
            <v-icon name="home" scale="2" /><br>
            <span class="nav-item__text">My Posts</span>
          </b-nav-item>
          <b-nav-item v-if="!simple" class="text-center p-0 white" to="/chitchat" @mousedown="maybeReload('/chitchat')">
            <v-icon name="coffee" scale="2" /><br>
            <span class="nav-item__text">ChitChat</span>
          </b-nav-item>
          <b-nav-item v-if="!simple" class="text-center p-0" to="/communityevents" @mousedown="maybeReload('/communityevents')">
            <v-icon name="calendar-alt" scale="2" /><br>
            <span class="nav-item__text">Events</span>
          </b-nav-item>
          <b-nav-item v-if="!simple" class="text-center p-0" to="/volunteerings" @mousedown="maybeReload('/volunteerings')">
            <v-icon name="hands-helping" scale="2" /><br>
            <span class="nav-item__text">Volunteer</span>
          </b-nav-item>
          <b-nav-item v-if="!simple" class="text-center p-0" to="/promote" @mousedown="maybeReload('/promote')">
            <v-icon name="bullhorn" scale="2" /><br>
            <span class="nav-item__text">Promote</span>
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/help" @mousedown="maybeReload('/help')">
            <v-icon name="question-circle" scale="2" /><br>
            <span class="nav-item__text">Help</span>
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/settings" @mousedown="maybeReload('/settings')">
            <v-icon name="cog" scale="2" /><br>
            <span class="nav-item__text">Settings</span>
          </b-nav-item>
          <b-nav-item class="text-center p-0" @click="logOut">
            <v-icon name="sign-out-alt" scale="2" /><br>
            <span class="nav-item__text">Logout</span>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <client-only>
      <LoginModal ref="loginModal" />
      <AboutMeModal ref="aboutMeModal" />
    </client-only>
  </header>
</template>

<script>
import SimpleView from '../components/SimpleView'
import NotificationOptions from '~/components/NotificationOptions'
import ChatMenu from '~/components/ChatMenu'
// Import login modal as I've seen an issue where it's not in $refs when you click on the signin button too rapidly.
import LoginModal from '~/components/LoginModal'
const AboutMeModal = () => import('~/components/AboutMeModal')

export default {
  name: 'MainHeader',
  components: {
    SimpleView,
    NotificationOptions,
    ChatMenu,
    LoginModal,
    AboutMeModal
  },
  data: function() {
    return {
      distance: 1000,
      logo: require(`@/static/icon.png`),
      unreadNotificationCount: 0,
      chatCount: 0
    }
  },
  watch: {
    unreadNotificationCount: function() {
      this.$emit('update:unreadNotificationCount', this.unreadNotificationCount)
    },
    chatCount: function() {
      this.$emit('update:chatCount', this.chatCount)
    },
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
    // Look for a custom logo.
    setTimeout(async () => {
      const res = await this.$axios.get(process.env.API + '/logo')

      if (res.status === 200) {
        const ret = res.data

        if (ret.ret === 0 && ret.logo) {
          this.logo = ret.logo.path
        }
      }
    }, 5000)
  },
  methods: {
    requestLogin() {
      this.$refs.loginModal.show()
    },
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
    showAboutMe() {
      this.$refs.aboutMeModal.show()
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

<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

#navbar_large .nav-item {
  text-align: center;
}

.ourBack {
  background-color: $colour-green-background !important;
}

.mainnav {
  display: flex;
  justify-content: space-between;
}

.mainnav--left {
  width: 50%;
  max-width: 520px;
}

.mainnav--right {
  width: 40%;
  max-width: 400px;
}

.nuxt-link-active .nav-item__text {
  border-bottom: 1px solid white;
  padding-top: 2px;
}

/* Style the external nav-link class */
::v-deep .nav-link {
  padding-left: 2px !important;
  padding-right: 2px !important;
  padding-top: 0px !important;
  padding-bottom: 0px !important;

  color: $color-white !important;

  &:hover,
  &:focus {
    color: $color-white-opacity-75 !important;
  }
}

nav .navbar-nav li a.nuxt-link-active {
  color: $color-white-opacity-50 !important;
}

#nav_collapse_mobile {
  margin-top: 5px;

  .navbar-nav {
    border-top: 1px solid $color-gray--light;
    padding-top: 5px;
    margin-top: 5px;
    justify-content: center;
  }

  .nav-item {
    flex: 1;
    flex-basis: 25%;
    margin: 20px 0;

    @include media-breakpoint-up(md) {
      flex-basis: unset;
    }
  }

  a {
    &.nav-link {
      color: $color-white;
    }
  }
}

.notiflist {
  max-width: 100%;
}

/* These classes style the external b-nav-item-dropdown component */
.notiflist ::v-deep .dropdown-menu {
  height: 500px;
  overflow-y: auto;
}

.notiflist ::v-deep .dropdown-item {
  width: 300px;
  max-width: 100%;
  padding-left: 5px;
  overflow-wrap: break-word;
}

.navbar-brand a {
  color: $color-white !important;
}

.navbar a.navbar-brand {
  padding: 0px;
  margin: 0;
}

.navbar .logo {
  width: 58px !important;
  padding: 0px;
  margin-top: -5px;
  margin-bottom: -5px;
}

.simplewrapper {
  width: 150px;
}

svg.fa-icon {
  height: 32px;
  margin-bottom: 0;
}

.toggler {
  background: transparent;
  border-color: $color-white;
}

.toggler:hover {
  background: $color-white !important;
  color: $colour-success !important;
}

.toggler svg {
  vertical-align: -20px;
}
</style>
