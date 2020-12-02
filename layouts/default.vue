<template>
  <div>
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
    </header>
    <main>
      <nuxt ref="pageContent" class="ml-0 pl-0 pl-sm-1 pr-0 pr-sm-1 pageContent" />
    </main>
    <BouncingEmail />
    <LocalStorageMonitor />
    <client-only>
      <ChatPopups v-if="loggedIn" class="d-none d-sm-block" />
      <LoginModal ref="loginModal" />
      <AboutMeModal ref="aboutMeModal" />
    </client-only>
    <div class="navbar-toggle" style="display: none" />
    <div id="serverloader" class="bg-white">
      <b-img src="~/static/loader.gif" alt="Loading..." />
      <!-- Don't allow this to format neatly, otherwise SSR doesn't match and we get a client-side re-render -->
      <!-- eslint-disable-next-line -->
      <p><b>Loading...</b><br>Stuck here? <ExternalLink href="mailto:support@ilovefreegle.org">Contact us</ExternalLink><br>Try refreshing.  Or Chrome.</p>
    </div>
  </div>
</template>

<script>
// Import login modal as I've seen an issue where it's not in $refs when you click on the signin button too rapidly.
import SimpleView from '../components/SimpleView'
import LoginModal from '~/components/LoginModal'
import LocalStorageMonitor from '~/components/LocalStorageMonitor'
import BouncingEmail from '~/components/BouncingEmail'
import NotificationOptions from '~/components/NotificationOptions'
import ChatMenu from '~/components/ChatMenu'
import nchanHelper from '@/mixins/nchanHelper'

const AboutMeModal = () => import('~/components/AboutMeModal')
const ChatPopups = () => import('~/components/ChatPopups')
const ExternalLink = () => import('~/components/ExternalLink')

export default {
  components: {
    SimpleView,
    ChatPopups,
    AboutMeModal,
    LoginModal,
    LocalStorageMonitor,
    BouncingEmail,
    ExternalLink,
    NotificationOptions,
    ChatMenu
  },
  mixins: [nchanHelper],
  data: function() {
    return {
      complete: false,
      distance: 1000,
      nchan: null,
      logo: require(`@/static/icon.png`),
      timeTimer: null,
      unreadNotificationCount: 0,
      chatCount: 0
    }
  },

  head() {
    const totalCount = this.unreadNotificationCount + this.chatCount
    return {
      titleTemplate: totalCount > 0 ? `(${totalCount}) %s` : '%s',
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/icon.png'
        }
      ]
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
    if (process.browser) {
      // Add class for screen background.
      document.body.classList.add('fd')

      // Start our timer.  Holding the time in the store allows us to update the time regularly and have reactivity
      // cause displayed fromNow() values to change, rather than starting a timer for each of them.
      this.updateTime()
    }

    // Ensure we know whether we're FD or MT.
    this.$store.dispatch('misc/set', {
      key: 'modtools',
      value: false
    })

    if (document) {
      // We added a basic loader into the HTML.  This helps if we are loaded on an old browser where our JS bombs
      // out - at least we display something, with a link to support.  But now we're up and running, remove that.
      //
      // We have an animation on the loader so that it only becomes visible after ~10s.  That prevents page flicker
      // if we manage to get up and running rapidly.
      const l = document.getElementById('serverloader')
      l.style.display = 'none'
    }

    const me = this.$store.getters['auth/user']

    if (me && me.id) {
      // Get chats and poll regularly for new ones
      this.$store.dispatch('chats/fetchLatestChats')
    }

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

    try {
      // Set the build date.  This may get superceded by Sentry releases, but it does little harm to add it in.
      this.$sentry.setExtra('builddate', process.env.BUILD_DATE)

      if (me) {
        // Set the context for sentry so that we know which users are having errors.
        this.$sentry.setUser({ userid: me.id })

        // eslint-disable-next-line no-undef
        if (typeof __insp !== 'undefined') {
          // eslint-disable-next-line no-undef
          __insp.push([
            'tagSession',
            {
              userid: me.id,
              builddate: process.env.BUILD_DATE
            }
          ])
        }
      } else {
        // eslint-disable-next-line no-undef,no-lonely-if
        if (typeof __insp !== 'undefined') {
          // eslint-disable-next-line no-undef
          __insp.push([
            'tagSession',
            {
              userid: 'Logged out',
              builddate: process.env.BUILD_DATE
            }
          ])
        }
      }
    } catch (e) {
      console.log('Failed to set context', e)
    }
  },

  async beforeCreate() {
    if (this.$route.query.u && this.$route.query.k) {
      try {
        // Clear the related list.  This avoids accidentally flagging members as related if people forget to close
        // an incognito tab while impersonating.
        await this.$store.dispatch('auth/clearRelated')

        // Log in using the username and key.
        await this.$store.dispatch('auth/login', {
          u: this.$route.query.u,
          k: this.$route.query.k,
          force: true
        })
      } catch (e) {
        // Login failed.  Usually this is because they're logged in as someone else. Ignore it.
        console.log('Login failed', e)
      }
    }
  },

  beforeDestroy() {
    console.log('Destroy layout')
    clearTimeout(this.timeTimer)
  },

  methods: {
    showAboutMe() {
      this.$refs.aboutMeModal.show()
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

    requestLogin() {
      this.$refs.loginModal.show()
    },

    maybeReload(route) {
      if (this.$router.currentRoute.path === route) {
        // We have clicked to route to the page we're already on.  Force a full refresh.
        window.location.reload(true)
      }
    },

    updateTime() {
      this.$store.dispatch('misc/setTime')
      this.timeTimer = setTimeout(this.updateTime, 10000)
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

#navbar_large .nav-item {
  text-align: center;
}

/* Style the external nav-link class */
::v-deep .nav-link {
  padding-left: 2px !important;
  padding-right: 2px !important;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

nav .navbar-nav li a.nuxt-link-active {
  color: $color-white-opacity-50 !important;
}

.nuxt-link-active .nav-item__text {
  border-bottom: 1px solid white;
  padding-top: 2px;
}

::v-deep .nav-link {
  color: $color-white !important;

  &:hover,
  &:focus {
    color: $color-white-opacity-75 !important;
  }
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

.pageContent {
  padding-top: 68px;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
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

.ourBack {
  background-color: $colour-success !important;
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

svg.fa-icon {
  height: 32px;
}

#serverloader {
  z-index: 1000;
  text-align: center;
  position: fixed; /* or absolute */
  top: calc(50% - 44px);
  left: calc(50% - 44px);
  font-size: 12px;
  padding: 5px;
  border: 1px black;
  border-radius: 5px;
  animation: 15s fadeIn;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  90% {
    opacity: 0;
  }
  100% {
    visibility: visible;
    opacity: 1;
  }
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

.simplewrapper {
  width: 150px;
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
</style>
