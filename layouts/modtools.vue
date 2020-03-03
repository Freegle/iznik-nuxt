<template>
  <client-only>
    <div class="pageback">
      <b-navbar id="navbar" type="dark" class="navback" fixed="top">
        <b-navbar-brand to="/modtools" class="p-0 d-flex">
          <b-img
            class="logo mr-2"
            height="58"
            width="58"
            rounded
            :src="logo"
            alt="Home"
          />
          <ModStatus v-if="supportOrAdmin" class="mt-3" />
        </b-navbar-brand>
        <b-navbar-nav />
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right class="d-block d-sm-none">
            <template v-slot:button-content>
              <ModMenuItemNav :count="['pending', 'chatreview']" icon="envelope" class="menuicon" />
            </template>
            <b-dropdown-item>
              <ModMenuItemNav name="Pending" :count="['pending']" :othercount="['pending']" link="/modtools/messages/pending" />
            </b-dropdown-item>
            <b-dropdown-item>
              <ModMenuItemNav name="Approved" link="/modtools/messages/approved" />
            </b-dropdown-item>
            <b-dropdown-item>
              <ModMenuItemNav name="Review" :count="['spam']" :othercount="['spamother']" link="/modtools/messages/review" />
            </b-dropdown-item>
            <b-dropdown-item>
              <ModMenuItemNav name="Edits" :count="['editreview']" link="/modtools/messages/edits" />
            </b-dropdown-item>
            <b-dropdown-item>
              <ModMenuItemNav name="Chat Review" :count="['chatreview']" link="/modtools/chats/review" />
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown right class="d-block d-sm-none">
            <template v-slot:button-content>
              <ModMenuItemNav v-if="hasPermissionNewsletter" :count="['pendingmembers', 'stories', 'newsletterstories', 'socialactions']" icon="users" class="menuicon" />
            </template>
            <b-dropdown-item>
              <ModMenuItemNav name="Pending" :count="['pendingmembers']" link="/modtools/members/pending" />
            </b-dropdown-item>
            <b-dropdown-item>
              <ModMenuItemNav name="Approved" link="/modtools/members/approved" />
            </b-dropdown-item>
            <b-dropdown-item v-if="supportOrAdmin">
              <ModMenuItemNav name="Related" link="/modtools/members/related" :count="['relatedmembers']" />
            </b-dropdown-item>
            <b-dropdown-item>
              <ModMenuItemNav name="Stories" :count="['stories']" href="/modtools/members/stories" />
            </b-dropdown-item>
            <b-dropdown-item>
              <ModMenuItemNav name="Newsletter" :count="['newsletterstories']" href="/modtools/members/newsletter" />
            </b-dropdown-item>
            <b-dropdown-item>
              <ModMenuItemNav name="Publicity" :count="['socialactions']" href="/modtools/publicity" />
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item v-if="loggedIn" id="menu-option-modtools-discourse" class="text-center p-0" @click="discourse">
            <div class="notifwrapper">
              <span class="d-none d-sm-inline">
                <v-icon name="brands/discourse" scale="2" class="fa-fw" /><br>
                Us
              </span>
              <v-icon name="brands/discourse" class="d-inline d-sm-none mt-2" scale="2" />
              <b-badge v-if="discourseCount" variant="success">
                {{ discourseCount }}
              </b-badge>
            </div>
          </b-nav-item>
          <b-nav-item v-if="loggedIn" id="menu-option-modtools-chat" class="text-center p-0" to="/modtools/chats">
            <div class="notifwrapper">
              <span class="d-none d-sm-inline">
                <v-icon name="comments" scale="2" class="fa-fw" /><br>
                Chats
              </span>
              <v-icon name="comments" class="d-inline d-sm-none" scale="2" />
              <b-badge v-if="chatCount" variant="danger">
                {{ chatCount }}
              </b-badge>
            </div>
          </b-nav-item>
          <b-nav-item v-if="loggedIn" id="menu-option-modtools-logout" class="text-center p-0" @click="logOut">
            <v-icon name="sign-out-alt" scale="2" class="d-inline fa-fw" /><br>
            Logout
          </b-nav-item>
          <b-nav-item v-if="!loggedIn">
            <b-btn variant="white" @click="requestLogin">
              Sign in
            </b-btn>
          </b-nav-item>
        </b-navbar-nav>
      </b-navbar>

      <div class="d-flex">
        <div class="leftmenu d-none d-sm-block">
          <nuxt-link to="/modtools" class="pl-1">
            Dashboard
          </nuxt-link>
          <hr>
          <div class="pl-1">
            Messages
          </div>
          <ModMenuItemLeft link="/modtools/messages/pending" name="Pending" count="pending" othercount="pendingother" indent />
          <ModMenuItemLeft link="/modtools/messages/approved" name="Approved" indent />
          <ModMenuItemLeft link="/modtools/messages/review" name="Review" count="spam" othercount="spamother" indent />
          <ModMenuItemLeft link="/modtools/messages/edits" name="Edits" count="editreview" indent />
          <hr>
          <div class="pl-1">
            Members
          </div>
          <ModMenuItemLeft link="/modtools/members/pending" name="Pending" count="pendingmembers" othercount="pendingmembersother" indent />
          <ModMenuItemLeft link="/modtools/members/approved" name="Approved" indent />
          <ModMenuItemLeft link="/modtools/members/related" name="Related" count="relatedmembers" indent />
          <ModMenuItemLeft link="/modtools/members/stories" name="Stories" indent count="stories" />
          <ModMenuItemLeft v-if="hasPermissionNewsletter" link="/modtools/members/newsletter" name="Newsletter" indent count="newsletterstories" />
          <hr>
          <div class="pl-1">
            Chat
          </div>
          <ModMenuItemLeft link="/modtools/chats/review" name="Review" count="chatreview" indent />
          <hr>
          <ModMenuItemLeft link="/modtools/publicity" name="Publicity" count="socialactions" />
        </div>
        <nuxt ref="pageContent" class="ml-0 pl-0 pl-sm-1 pr-0 pr-sm-1 pageContent flex-grow-1" />
      </div>
      <ChatPopups v-if="loggedIn" class="d-none d-sm-block" />
      <LoginModal ref="loginModal" />
    </div>
  </client-only>
</template>

<script>
import ModMenuItemLeft from '../components/ModMenuItemLeft'
import ModMenuItemNav from '../components/ModMenuItemNav'
import LoginModal from '~/components/LoginModal'

const ChatPopups = () => import('~/components/ChatPopups')
const ModStatus = () => import('~/components/ModStatus')

export default {
  components: {
    ModMenuItemNav,
    ModMenuItemLeft,
    ChatPopups,
    LoginModal,
    ModStatus
  },

  data: function() {
    return {
      logo: require(`@/static/icon_modtools.png`)
    }
  },

  computed: {
    chatCount() {
      // Don't show so many that the layout breaks.
      return Math.min(999, this.$store.getters['chats/unseenCount'])
    },
    discourseCount() {
      const discourse = this.$store.getters['auth/discourse']
      return discourse
        ? discourse.notifications + discourse.newtopics + discourse.unreadtopics
        : 0
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
      document.body.classList.add('modtools')
    }

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
    discourse() {
      window.open('https://discourse.ilovefreegle.org/')
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
  background-color: $color-modtools-blue--dark;
}

nav .navbar-nav li a,
.discourse {
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

.fa-fw {
  width: 2rem;
  height: 2rem;
}

.menuicon {
  position: relative;
  top: 13px;
}
</style>
