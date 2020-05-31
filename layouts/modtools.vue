<template>
  <client-only>
    <div class="pageback">
      <b-navbar id="navbar" type="dark" class="navback p-0 p-sm-1" fixed="top">
        <b-navbar-brand class="p-0 pr-2 d-flex">
          <b-img
            class="logo clickme"
            fluid
            rounded
            :src="logo"
            alt="Home"
            @click="clicklogo"
          />
          <ModStatus class="status" />
        </b-navbar-brand>
        <b-navbar-nav class="d-flex w-100 justify-content-end">
          <b-nav-item v-if="loggedIn" id="menu-option-modtools-discourse2" class="text-center p-0" @click="discourse">
            <div>
              <span class="d-none d-sm-inline">
                <v-icon name="brands/discourse" scale="2" class="fw" /><br>
                Us
              </span>
              <div class="position-relative d-inline">
                <v-icon name="brands/discourse" class="d-inline d-sm-none ml-2 mr-2 mt-2" scale="2.5" />
                <b-badge v-show="discourseCount" variant="success">
                  {{ discourseCount }}
                </b-badge>
              </div>
            </div>
          </b-nav-item>
          <b-nav-item v-if="loggedIn" id="menu-option-modtools-chat2" class="text-center p-0" @click="toChats">
            <div>
              <span class="d-none d-sm-inline">
                <v-icon name="comments" scale="2" class="fw" /><br>
                Chats
              </span>
              <div class="position-relative d-inline">
                <v-icon name="comments" class="d-inline d-sm-none ml-2 mr-4 mt-2" scale="2.5" />
                <b-badge v-show="chatCount" variant="danger" class="badge">
                  {{ chatCount }}
                </b-badge>
              </div>
            </div>
          </b-nav-item>
          <b-nav-item v-if="loggedIn">
            <div class="position-relative">
              <b-btn variant="white" class="menu" @click="toggleMenu">
                <v-icon name="bars" class="mb-1" scale="2.2" />
              </b-btn>
              <b-badge v-show="menuCount" v-if="!showMenu" variant="danger" class="menuCount position-absolute">
                {{ menuCount }}
              </b-badge>
            </div>
          </b-nav-item>
          <b-nav-item v-if="!loggedIn">
            <b-btn variant="white" @click="requestLogin">
              Sign in
            </b-btn>
          </b-nav-item>
        </b-navbar-nav>
      </b-navbar>

      <div class="d-flex">
        <div v-if="showMenu" class="leftmenu">
          <ModMenuItemLeft link="/modtools" name="Dashboard" />
          <hr>
          <div class="pl-1">
            Messages
          </div>
          <ModMenuItemLeft link="/modtools/messages/pending" name="Pending" :count="['pending']" :othercount="['pendingother']" indent />
          <ModMenuItemLeft link="/modtools/messages/approved" name="Approved" indent />
          <ModMenuItemLeft link="/modtools/messages/review" name="Review" :count="['spam']" :othercount="['spamother']" indent />
          <ModMenuItemLeft link="/modtools/messages/edits" name="Edits" :count="['editreview']" indent />
          <hr>
          <div class="pl-1">
            Members
          </div>
          <ModMenuItemLeft link="/modtools/members/pending" name="Pending" :count="['pendingmembers']" :othercount="['pendingmembersother']" indent />
          <ModMenuItemLeft link="/modtools/members/approved" name="Approved" indent />
          <ModMenuItemLeft link="/modtools/members/review" name="Member Review" :count="['spammembers']" :othercount="['spammembersother']" indent />
          <ModMenuItemLeft link="/modtools/chats/review" name="Chat Review" :count="['chatreview']" :othercount="['chatreviewother']" indent />
          <ModMenuItemLeft link="/modtools/members/related" name="Related" :count="['relatedmembers']" indent />
          <ModMenuItemLeft link="/modtools/members/stories" name="Stories" indent :count="['stories']" />
          <ModMenuItemLeft v-if="hasPermissionNewsletter" link="/modtools/members/newsletter" name="Newsletter" indent :count="['newsletterstories']" />
          <ModMenuItemLeft link="/modtools/members/feedback" name="Feedback" indent :othercount="['happiness']" />
          <hr>
          <hr>
          <ModMenuItemLeft link="/modtools/communityevents" name="Events" :count="['pendingevents']" />
          <ModMenuItemLeft link="/modtools/volunteering" name="Volunteering" :count="['pendingvolunteering']" />
          <ModMenuItemLeft link="/modtools/publicity" name="Publicity" :count="['socialactions']" />
          <ModMenuItemLeft link="/modtools/admins" name="Admins" :count="['pendingadmins']" />
          <ModMenuItemLeft link="/modtools/spammers" name="Spammers" :count="supportOrAdmin ? ['spammerpendingadd', 'spammerpendingremove'] : []" />
          <hr>
          <ModMenuItemLeft link="/modtools/logs" name="Logs" />
          <ModMenuItemLeft v-if="supportOrAdmin" link="/modtools/support" name="Support" />
          <ModMenuItemLeft link="/modtools/settings" name="Settings" />
          <ModMenuItemLeft link="/modtools/teams" name="Teams" />
          <div>
            <ExternalLink href="https://discourse.ilovefreegle.org" class="pl-1">
              Help
            </ExternalLink>
          </div>
          <div>
            <a href="#" class="pl-1" @click="logOut">
              Logout
            </a>
          </div>
        </div>
        <nuxt ref="pageContent" class="ml-0 pl-0 pl-sm-1 pr-0 pr-sm-1 pageContent flex-grow-1" />
      </div>
      <ChatPopups v-if="loggedIn" class="d-none d-sm-block" />
      <LoginModal ref="loginModal" />
      <div id="sizer" ref="sizer" class="d-none d-lg-block" />
    </div>
  </client-only>
</template>

<script>
import ModMenuItemLeft from '../components/ModMenuItemLeft'
import waitForRef from '../mixins/waitForRef'
import LoginModal from '~/components/LoginModal'
import ModStatus from '~/components/ModStatus'
const ExternalLink = () => import('~/components/ExternalLink')
import { setBadgeCount } from '../plugins/app-init-push' // CC

const ChatPopups = () => import('~/components/ChatPopups')

export default {
  components: {
    ModMenuItemLeft,
    ChatPopups,
    LoginModal,
    ModStatus,
    ExternalLink
  },
  mixins: [waitForRef],
  data: function() {
    return {
      logo: require(`@/static/icon_modtools.png`),
      showMenu: false,
      sliding: false
    }
  },
  computed: {
    chatCount() {
      // Don't show so many that the layout breaks.
      return Math.min(99, this.$store.getters['chats/unseenCount'])
    },
    discourseCount() {
      const discourse = this.$store.getters['auth/discourse']
      return discourse
        ? discourse.notifications + discourse.newtopics + discourse.unreadtopics
        : 0
    },
    slideclass() {
      return this.showMenu ? 'slide-in' : 'slide-out'
    },
    menuCount() {
      const work = this.$store.getters['auth/work']
      if (process.env.IS_APP) setBadgeCount(this.chatCount + work.total) // CC
      return work.total
    },
    work() {
      return this.$store.getters['auth/work']
    }
  },
  watch: {
    $route() {
      this.waitForRef('sizer', () => {
        const el = document.getElementById('sizer')
        if (getComputedStyle(el).display !== 'block') {
          // Not large screen, hide menu on move.
          this.showMenu = false
        }
      })
    }
  },
  mounted() {
    console.log('MODTOOLS.VUE mounted')
    if (process.browser) {
      // Add class for screen background.
      document.body.classList.add('modtools')

      this.waitForRef('sizer', () => {
        const el = document.getElementById('sizer')
        if (getComputedStyle(el).display === 'block') {
          // Large screen, show menu by default.
          this.showMenu = true
        }
      })
    }

    // Ensure we know whether we're FD or MT.
    this.$store.dispatch('misc/set', {
      key: 'modtools',
      value: true
    })

    this.workTimer = setTimeout(this.checkWork, 0)
    this.$store.dispatch('modconfigs/fetch', {
      all: true
    })

    this.updateFavicon()
  },
  beforeDestroy() {
    if (this.workTimer) {
      clearTimeout(this.workTimer)
    }

    if (this.faviconTimer) {
      clearTimeout(this.faviconTimer)
    }
  },
  methods: {
    updateFavicon() {
      if (process.env.IS_APP) return;
      if (process.client) {
        // This is a bit of a hack, but seems necessary to make the favicon stick.
        //
        // Check if it's ok first, as otherwise we keep fetching the icon.
        let link = document.querySelector("link[rel*='icon']")

        if (!link) {
          link = document.createElement('link')
          link.type = 'image/x-icon'
          link.rel = 'icon'
          link.href = require('~/static/icon_modtools.png')
          document.getElementsByTagName('head')[0].appendChild(link)
        } else if (link.href.indexOf('icon_modtools.png') === -1) {
          link.href = require('~/static/icon_modtools.png')
        }
      }

      this.faviconTimer = setTimeout(this.updateFavicon, 100)
    },
    async logOut() {
      // Remove all cookies, both client and server.  This seems to be necessary to kill off the PHPSESSID cookie
      // on the server, which would otherwise keep us logged in despite our efforts.
      console.log('Logout')
      try {
        this.$cookies.removeAll()
      } catch (e) {}

      await this.$store.dispatch('auth/logout')
      this.$store.dispatch('auth/forceLogin', false)

      // Go to the landing page.
      this.$router.push('/modtools')
    },
    requestLogin() {
      console.log('MODTOOLS.VUE requestLogin')
      this.$refs.loginModal.show()
    },
    checkWork() {
      this.$store.dispatch('auth/fetchUser', {
        components: ['work'],
        force: true
      })

      setTimeout(this.checkWork, 30000)
    },
    discourse(e) {
      window.open('https://discourse.ilovefreegle.org/')
      e.stopPropagation()
      e.preventDefault()
    },
    chats(e) {
      this.$router.push('/modtools/chats')
      e.stopPropagation()
      e.preventDefault()
    },
    clicklogo(e) {
      if (this.$route.fullPath === '/modtools') {
        // Click on current route.  Reload.
        e.stopPropagation()
        this.$router.go()
      } else {
        this.$router.push('/modtools')
      }
    },
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
    toChats(e) {
      if (e) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
      }

      // Ensure we have no chat selected.  On mobile this will force us to show the chat list.
      this.$store.dispatch('chats/currentChat', {
        chatid: null
      })

      this.$router.push('/modtools/chats')
    }
  },
  head() {
    const totalCount = this.menuCount + this.chatCount

    const ret = {
      titleTemplate: totalCount > 0 ? `(${totalCount}) ModTools` : 'ModTools'
    }

    if (process.client) {
      this.updateFavicon()
    } else {
      ret.link = [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: require('~/static/icon_modtools.png')
        }
      ]
    }

    return ret
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

@include media-breakpoint-up(sm) {
  #navbar .nav-item {
    width: 80px;
    text-align: center;
  }
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
  height: 58px !important;
  padding: 0px;
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
  min-width: 185px;
  padding-top: 68px;
  font-size: 1.2em;
  background-color: $color-modtools-leftmenu-bg;

  a {
    color: $color-modtools-menu;
  }
}

.fw {
  width: 2rem;
  height: 2rem;
}

.status {
  left: -13px;
  position: relative;
  top: 1px;
}

.leftanddown {
  position: relative;
  left: -10px;
  top: 12px;
}

.leftandtop {
  position: relative;
  left: 25px;
  top: -39px;
}

.menu {
  color: $color-modtools-blue--dark !important;
  background-color: $color-white;
}

@include media-breakpoint-down(xs) {
  .menuCount {
    right: 7px;
    top: 5px;
  }

  .badge {
    position: absolute;
    top: 0px;
    left: 25px;
  }
}

@include media-breakpoint-up(sm) {
  .menuCount {
    right: 15px;
    top: 5px;
  }
}
</style>
