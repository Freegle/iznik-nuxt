<template>
  <div>
    <!-- Navbar for large screens-->
    <b-navbar id="navbar_large" toggleable="xl" type="dark" class="ourBack d-none d-xl-flex" fixed="top">
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
        <b-collapse v-if="loggedIn" id="nav_collapse" ref="nav_collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item id="menu-option-chitchat" class="text-center small p-0" to="/chitchat" @mousedown="maybeReload('/chitchat')">
              <v-icon name="coffee" scale="2" /><br>
              ChitChat
            </b-nav-item>
            <b-nav-item id="menu-option-myposts" class="text-center small p-0" to="/myposts" @mousedown="maybeReload('/myposts')">
              <v-icon name="home" scale="2" /><br>
              My Posts
            </b-nav-item>
            <b-nav-item id="menu-option-give" class="text-center small p-0" to="/give" @mousedown="maybeReload('/give')">
              <v-icon name="gift" scale="2" /><br>
              Give
            </b-nav-item>
            <b-nav-item id="menu-option-find" class="text-center small p-0" to="/find" @mousedown="maybeReload('/find')">
              <v-icon name="search" scale="2" /><br>
              Find
            </b-nav-item>
            <b-nav-item id="menu-option-mygroups" class="text-center small p-0" to="/communities" @mousedown="maybeReload('/communities')">
              <v-icon name="users" scale="2" /><br>
              Communities
            </b-nav-item>
            <b-nav-item id="menu-option-explore" class="text-center small p-0" to="/explore" @mousedown="maybeReload('/explore')">
              <v-icon name="map-marker-alt" scale="2" /><br>
              Explore
            </b-nav-item>
            <b-nav-item id="menu-option-communityevents" class="text-center small p-0" to="/communityevents" @mousedown="maybeReload('/communityevents')">
              <v-icon name="calendar-alt" scale="2" /><br>
              Events
            </b-nav-item>
            <b-nav-item id="menu-option-volunteering" class="text-center small p-0" to="/volunteerings" @mousedown="maybeReload('/volunteerings')">
              <v-icon name="hands-helping" scale="2" /><br>
              Volunteer
            </b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item id="menu-option-notification" class="text-center p-0" />
            <b-nav-item-dropdown class="white text-center notiflist" lazy right @shown="showNotifications">
              <template slot="button-content">
                <div class="notifwrapper text-center small">
                  <v-icon name="bell" scale="2" />
                  <b-badge v-if="notificationCount" variant="danger" class="ml-3 notifbadge">
                    {{ notificationCount }}
                  </b-badge><br>
                  Notifications
                </div>
              </template>
              <b-dropdown-item class="text-right">
                <b-btn variant="white" size="sm" @click="markAllRead">
                  Mark all read
                </b-btn>
              </b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item v-for="notification in notifications" :key="'notification-' + notification.id" class="p-0 notpad">
                <Notification :notification="notification" class="p-0" @showModal="showAboutMe" />
              </b-dropdown-item>
              <infinite-loading :distance="distance" @infinite="loadMore">
                <span slot="no-results" />
                <span slot="no-more" />
                <span slot="spinner">
                  <b-img-lazy src="~/static/loader.gif" alt="Loading" />
                </span>
              </infinite-loading>
            </b-nav-item-dropdown>
            <b-nav-item id="menu-option-chat" class="text-center small p-0" to="/chats" @mousedown="maybeReload('/chats')">
              <div class="notifwrapper">
                <v-icon name="comments" scale="2" /><br>
                Chats
                <b-badge v-if="chatCount" variant="danger" class="ml-3 chatbadge">
                  {{ chatCount }}
                </b-badge>
              </div>
            </b-nav-item>
            <b-nav-item id="menu-option-spread" class="text-center small p-0" to="/spread" @mousedown="maybeReload('/spread')">
              <div class="notifwrapper">
                <v-icon name="bullhorn" scale="2" /><br>
                Spread
                <b-badge v-if="spreadCount" variant="info" class="ml-3 chatbadge">
                  {{ spreadCount }}
                </b-badge>
              </div>
            </b-nav-item>
            <b-nav-item id="menu-option-help" class="text-center small p-0" to="/help" @mousedown="maybeReload('/help')">
              <v-icon name="question-circle" scale="2" /><br>
              Help
            </b-nav-item>
            <b-nav-item id="menu-option-settings" class="text-center small p-0" to="/settings" @mousedown="maybeReload('/settings')">
              <v-icon name="cog" scale="2" /><br>
              Settings
            </b-nav-item>
            <b-nav-item id="menu-option-logout" class="text-center p-0 small" @click="logOut()">
              <v-icon name="sign-out-alt" scale="2" /><br>
              Logout
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </client-only>
      <b-navbar-nav class="ml-auto">
        <client-only>
          <b-nav-item>
            <div v-if="!loggedIn" class="btn btn-white" @click="requestLogin">
              Sign in
            </div>
          </b-nav-item>
        </client-only>
      </b-navbar-nav>
    </b-navbar>
    <!-- Navbar for small screens -->
    <b-navbar id="navbar_small" toggleable="xl" type="dark" class="ourBack d-flex justify-content-end d-xl-none" fixed="top">
      <b-navbar-brand to="/" class="p-0 mr-auto">
        <b-img
          class="logo mr-2"
          height="58"
          width="58"
          rounded
          :src="require(`@/static/icon.png`)"
          alt="Home"
        />
      </b-navbar-brand>

      <client-only>
        <b-dropdown
          v-if="loggedIn"
          class="white text-center notiflist mr-2"
          variant="success"
          lazy
          right
          @shown="showNotifications"
        >
          <template slot="button-content">
            <div class="notifwrapper">
              <v-icon name="bell" scale="2" class="" />
              <b-badge v-if="notificationCount" variant="danger" class="notifbadgesm">
                {{ notificationCount }}
              </b-badge>
            </div>
          </template>
          <b-dropdown-item class="text-right">
            <b-btn variant="white" size="sm" @click="markAllRead">
              Mark all read
            </b-btn>
          </b-dropdown-item>
          <b-dropdown-divider />
          <b-dropdown-item v-for="notification in notifications" :key="'notification-' + notification.id" class="p-0 notpad">
            <Notification :notification="notification" class="p-0" @showModal="showAboutMe" />
          </b-dropdown-item>
          <infinite-loading :distance="distance" @infinite="loadMore">
            <span slot="no-results" />
            <span slot="no-more" />
            <span slot="spinner">
              <b-img-lazy src="~/static/loader.gif" alt="Loading" />
            </span>
          </infinite-loading>
        </b-dropdown>

        <nuxt-link v-if="loggedIn" id="menu-option-chat-sm" class="text-white mr-3" to="/chats">
          <div class="notifwrapper">
            <v-icon name="comments" scale="2" /><br>
            <b-badge v-if="chatCount" variant="danger" class="chatbadge">
              {{ chatCount }}
            </b-badge>
          </div>
        </nuxt-link>
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
        <b-navbar-toggle v-if="loggedIn" target="nav_collapse_mobile" />
      </b-navbar-nav>

      <b-collapse v-if="loggedIn" id="nav_collapse_mobile" ref="nav_collapse_mobile" class="w-100 ourBack">
        <b-navbar-nav class="ml-auto flex-row flex-wrap small">
          <b-nav-item class="text-center p-0 white" to="/chitchat" @mousedown="maybeReload('/chitchat')">
            <v-icon name="coffee" scale="2" /><br>
            ChitChat
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/myposts" @mousedown="maybeReload('/myposts')">
            <v-icon name="home" scale="2" /><br>
            My Posts
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/give" @mousedown="maybeReload('/give')">
            <v-icon name="gift" scale="2" /><br>
            Give
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/find" @mousedown="maybeReload('/find')">
            <v-icon name="search" scale="2" /><br>
            Find
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/communities" @mousedown="maybeReload('/communities')">
            <v-icon name="users" scale="2" /><br>
            Communities
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/explore" @mousedown="maybeReload('/explore')">
            <v-icon name="map-marker-alt" scale="2" /><br>
            Explore
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/communityevents" @mousedown="maybeReload('/communityevetns')">
            <v-icon name="calendar-alt" scale="2" /><br>
            Events
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/volunteerings" @mousedown="maybeReload('/volunteerings')">
            <v-icon name="hands-helping" scale="2" /><br>
            Volunteer
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/spread" @mousedown="maybeReload('/spread')">
            <v-icon name="bullhorn" scale="2" /><br>
            Spread
          </b-nav-item>
          <b-nav-item class="text-center p-0" to="/help" @mousedown="maybeReload('/help')">
            <v-icon name="question-circle" scale="2" /><br>
            Help
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
    </b-navbar>


    <nuxt ref="pageContent" class="ml-0 pl-0 pl-sm-1 pr-0 pr-sm-1 pageContent" />
    <div v-if="localStorageErrors" class="storage w-100 text-center">
      <b-alert show variant="danger">
        <p>We can't access local storage on your browser.</p>
        <p>Please clear your cache for this site. If you have security software, please disable it for this site.</p>
        <p>We'll carry on, but things may go wrong...</p>
      </b-alert>
    </div>
    <client-only>
      <ChatPopups v-if="loggedIn" class="d-none d-sm-block" />
      <LoginModal ref="loginModal" />
      <AboutMeModal ref="modal" />
    </client-only>
    <div class="navbar-toggle" style="display: none" />
    <div id="serverloader" class="bg-white">
      <b-img src="~/static/loader.gif" alt="Loading..." />
      <p>
        <b>Loading...</b>
        <br>
        Stuck here? <a href="mailto:support@ilovefreegle.org">Contact us</a>
        <br>Try refreshing.  Or Chrome.
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import 'color-vars';

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
  width: 80px;
  text-align: center;
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

#menu-option-chat-sm {
  &:hover,
  &:focus {
    color: $color-white-opacity-75 !important;
  }

  &.nuxt-link-active {
    color: $color-white-opacity-50 !important;

    &:hover,
    &:focus {
      color: $color-white-opacity-75 !important;
    }
  }
}

$bootstrap-sm: 768px;

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

    @media (min-width: $bootstrap-sm) {
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

svg.fa-icon {
  height: 32px;
}

.signindisabled {
  opacity: 0.2;
  pointer-events: none;
}

.notifwrapper {
  position: relative;
}

.notifbadge {
  position: absolute;
  top: 0px;
  left: 24px;
}

.notifbadgesm {
  position: absolute;
  top: 0px;
  left: 18px;
}

.chatbadge {
  position: absolute;
  top: 0px;
  left: 25px;
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

.storage {
  position: fixed;
  bottom: 0%;
}
</style>
<script>
// Import login modal as I've seen an issue where it's not in $refs when you click on the signin button too rapidly.
import LoginModal from '~/components/LoginModal'
const AboutMeModal = () => import('~/components/AboutMeModal')
const ChatPopups = () => import('~/components/ChatPopups')
const Notification = () => import('~/components/Notification')
const NchanSubscriber = require('nchan')
const InfiniteLoading = () => import('vue-infinite-loading')

export default {
  components: {
    InfiniteLoading,
    ChatPopups,
    Notification,
    AboutMeModal,
    LoginModal
  },

  data: function() {
    return {
      complete: false,
      distance: 1000,
      notificationPoll: null,
      nchan: null,
      logo: require(`@/static/icon.png`),
      localStorageErrors: false
    }
  },

  head() {
    const totalCount = this.notificationCount + this.chatCount
    return {
      titleTemplate: totalCount > 0 ? `(${totalCount}) %s` : '%s'
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
    notifications() {
      const notifications = this.$store.getters['notifications/list']

      notifications.sort(function(a, b) {
        return new Date(b.timestamp) - new Date(a.timestamp)
      })

      return notifications
    },
    notificationCount() {
      return this.$store.getters['notifications/count']
    },
    chatCount() {
      return Object.values(this.$store.getters['chats/list']).reduce(
        (total, chat) => total + chat.unseen,
        0
      )
    },
    spreadCount() {
      return this.me && this.me.invitesleft ? this.me.invitesleft : 0
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
    },
    me(newVal, oldVal) {
      if (this.nchan && this.nchan.running) {
        // Stop old listen.
        try {
          this.nchan.stop()
        } catch (e) {}
      }

      this.nchan = null

      if (newVal) {
        // We are now logged in.
        console.log('Start NCHAN from watch')
        this.startNCHAN(newVal.id)
      }
    }
  },

  async mounted() {
    if (document) {
      // We added a basic loader into the HTML.  This helps if we are loaded on an old browser where our JS bombs
      // out - at least we display something, with a link to support.  But now we're up and running, remove that.
      //
      // We have an animation on the loader so that it only becomes visible after ~10s.  That prevents page flicker
      // if we manage to get up and running rapidly.
      const l = document.getElementById('serverloader')
      l.style.display = 'none'
    }

    // Clear old notifications because they're probably out of date now.
    await this.$store.dispatch('notifications/clear')

    const me = this.$store.getters['auth/user']

    if (me && me.id) {
      console.log('Start NCHAN from mount')
      this.startNCHAN(me.id)

      // Get notifications and poll regularly for new ones.  Would be nice if this was event driven instead but requires server work.
      this.getNotificationCount()
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

    if (me) {
      // Set the context for sentry so that we know which users are having errors.
      this.$sentry.setUser({ userid: me.id })

      // Set the build date.  This may get superceded by Sentry releases, but it does little harm to add it in.
      this.$sentry.setExtra('builddate', process.env.BUILD_DATE)
    }

    this.monitorLocalStorage()
  },

  async beforeCreate() {
    if (this.$route.query.u && this.$route.query.k) {
      // Log in using the username and key.
      await this.$store.dispatch('auth/login', {
        u: this.$route.query.u,
        k: this.$route.query.k,
        force: true
      })

      setTimeout(() => {
        // Route to where we've been asked to go, without the auth info.  Don't really know why this requires a delay
        // and a reload - obviously that means I don't understand the codepath properly.  But it works.
        this.$router.push(this.$route.path, () => {
          if (process.client) {
            window.location.reload()
          }
        })
      }, 1000)
    }
  },

  beforeDestroy() {
    console.log('Destroy layout')
    clearTimeout(this.notificationPoll)

    if (this.nchan && this.nchan.running) {
      console.log('Stop NCHAN')
      try {
        this.nchan.stop()
      } catch (e) {}
    }

    this.nchan = null
  },

  methods: {
    startNCHAN(id) {
      this.nchan = new NchanSubscriber(
        process.env.CHAT_HOST + '/subscribe?id=' + id,
        {
          subscriber: ['longpoll']
        }
      )

      // We store the last message we got from NCHAN.  This avoids us getting duplicate messages (triggering server
      // work) when we load up.
      const lastNCHAN = this.$store.getters['auth/nchan']

      if (lastNCHAN) {
        this.nchan.lastMessageId = lastNCHAN.id
      }

      // Disabled for now until things settle down.
      console.log('Not starting NCHAN')
      // this.nchan.start()

      this.nchan.on('error', function(code, descr) {
        console.error('NCHAN error', code, descr)
      })

      this.nchan.on('message', async (ret, meta) => {
        console.log('NCHAN', ret, meta)

        if (meta.id) {
          this.$store.dispatch('auth/setNCHAN', {
            id: meta.id
          })
        }

        if (ret) {
          ret = JSON.parse(ret)

          // We will get notified for both MT and FD chats.  But we only want to react to
          // the one which this client actually is.
          const mt =
            ret && Object.keys(ret).includes('modtools') ? ret.modtools : false

          if (process.env.MODTOOLS === mt && ret && ret.text) {
            const data = ret.text

            if (data) {
              if (data.newroom) {
                // We have been notified that we are now in a new chat.  Load it into the store; once we've
                // done that then anything else needed will follow.
                console.log('Load new room', data.newroom)
                await this.$store.dispatch('chats/fetch', {
                  id: data.newroom
                })
              } else if (data.roomid) {
                // Activity on this room.  Fetch it.
                console.log('Activity on room', data.roomid)
                await this.$store.dispatch('chats/fetch', {
                  id: data.roomid
                })
              }
            }
          }
        }
      })
    },
    async getNotificationCount() {
      const me = this.$store.getters['auth/user']

      if (me && me.id) {
        await this.$store.dispatch('notifications/count')
        await this.$store.dispatch('chats/listChats', {
          chattypes: ['User2User', 'User2Mod'],
          summary: true
        })
      }

      this.notificationPoll = setTimeout(this.getNotificationCount, 30000)
    },

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

      this.$store.dispatch('auth/logout')
    },

    loadMore: function($state) {
      const currentCount = this.notifications.length

      if (this.complete) {
        $state.complete()
      } else {
        this.busy = true
        this.$store
          .dispatch('notifications/list')
          .then(() => {
            try {
              const notifications = this.$store.getters['notifications/list']

              if (currentCount === notifications.length) {
                this.complete = true
                $state.complete()
              } else {
                $state.loaded()
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
    },

    async markAllRead() {
      await this.$store.dispatch('notifications/allSeen')
      await this.$store.dispatch('notifications/count')
      await this.$store.dispatch('notifications/list')
    },

    monitorLocalStorage() {
      // We have trouble on some devices setting info to localStorage, due to quota or security reasons.  This can
      // break us.  Try to set something to local storage so that we can check if it makes it there;
      // if not, then do a toast.
      console.log('Monitor local storage')
      const now = Date.now()
      this.$store.dispatch('misc/set', {
        key: 'localStorageMonitor',
        value: now
      })

      setTimeout(() => {
        // Go directly to local storage to see if it's made it.
        console.log('Now check if it made it')
        let ok = false

        try {
          console.log('Get data')
          const stored = localStorage.getItem('iznik')
          console.log('Parse stored')
          const decoded = JSON.parse(stored)
          console.log('Decoded')

          if (decoded && decoded.misc && decoded.misc.localStorageMonitor) {
            console.log('Got back', decoded.misc.localStorageMonitor)
            const age =
              now - new Date(decoded.misc.localStorageMonitor).getTime()
            console.log('Age', age)

            if (age < 60000) {
              console.log('Ok')
              ok = true
            }
          } else {
            console.log("Doesn't have what we expect", decoded)
          }
        } catch (e) {
          console.log('Failed to parse local storage')
        }

        if (!ok) {
          console.error('Errors with local storage')
          this.localStorageErrors = true

          setTimeout(() => {
            this.localStorageErrors = false
          }, 30000)
        }
      }, 30000)
    }
  }
}
</script>
