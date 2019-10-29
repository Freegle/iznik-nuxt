<template>
  <div>
    <client-only>
      <!-- Navbar for large screens -->
      <b-navbar id="navbar_large" toggleable="xl" type="dark" class="ourBack d-none d-xl-flex">
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
        <b-collapse v-if="loggedIn" id="nav_collapse" ref="nav_collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item id="menu-option-chitchat" class="text-center small p-0" to="/chitchat" @mousedown="maybeReload('/chitchat')">
              <v-icon name="coffee" scale="2" /><br>
              ChitChat
            </b-nav-item>
            <b-nav-item id="menu-option-myposts" class="text-center small p-0" to="/myposts" @mousedown="maybeReload('/myposts')">
              <v-icon name="home" scale="2" /><br>
              My&nbsp;Posts
            </b-nav-item>
            <b-nav-item id="menu-option-mygroups" class="text-center small p-0" to="/communities" @mousedown="maybeReload('/communities')">
              <v-icon name="users" scale="2" /><br>
              Communities
            </b-nav-item>
            <b-nav-item id="menu-option-give" class="text-center small p-0" to="/give" @mousedown="maybeReload('/give')">
              <v-icon name="gift" scale="2" /><br>
              Give
            </b-nav-item>
            <b-nav-item id="menu-option-find" class="text-center small p-0" to="/find" @mousedown="maybeReload('/find')">
              <v-icon name="search" scale="2" /><br>
              Find
            </b-nav-item>
            <b-nav-item id="menu-option-explore" class="text-center small p-0" to="/explore" @mousedown="maybeReload('/explore')">
              <v-icon name="map-marked-alt" scale="2" /><br>
              Explore
            </b-nav-item>
            <b-nav-item id="menu-option-communityevents" class="text-center small p-0" to="/communityevents" @mousedown="maybeReload('/communityevents')">
              <v-icon name="calendar-alt" scale="2" /><br>
              Events
            </b-nav-item>
            <b-nav-item id="menu-option-volunteering" class="text-center small p-0" to="/volunteering" @mousedown="maybeReload('/volunteering')">
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
              <b-dropdown-item>
                <b-btn variant="white" size="sm" @click="markAllRead">
                  <!--                  TODO DESIGN Align to right; float right breaks divider-->
                  Mark all as read
                </b-btn>
              </b-dropdown-item>
              <b-dropdown-divider />
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
            <b-nav-item id="menu-option-chat" class="text-center small p-0" to="/chats" @mousedown="maybeReload('/chats')">
              <div class="notifwrapper">
                <v-icon name="comments" scale="2" /><br>
                Chats
                <b-badge v-if="chatCount" variant="danger" class="ml-3 chatbadge">
                  {{ chatCount }}
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
        <b-navbar-nav class="ml-auto">
          <b-nav-item>
            <b-button v-if="!loggedIn" class="btn-white" @click="requestLogin">
              Sign in
            </b-button>
          </b-nav-item>
        </b-navbar-nav>
      </b-navbar>
      <!-- Navbar for small screens -->
      <b-navbar id="navbar_small" toggleable="xl" type="dark" class="ourBack d-flex justify-content-end d-xl-none">
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
              <b-badge v-if="notificationCount" variant="danger" class="notifbadge">
                {{ notificationCount }}
              </b-badge>
            </div>
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

        <nuxt-link v-if="loggedIn" id="menu-option-chat-sm" class="text-white mr-3" to="/chats">
          <div class="notifwrapper">
            <v-icon name="comments" scale="2" /><br>
            <b-badge v-if="chatCount" variant="danger" class="chatbadge">
              {{ chatCount }}
            </b-badge>
          </div>
        </nuxt-link>

        <b-navbar-nav>
          <b-nav-item v-if="!loggedIn">
            <b-button class="btn-white" @click="requestLogin">
              Sign in
            </b-button>
          </b-nav-item>
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
            <b-nav-item class="text-center p-0" to="/communities" @mousedown="maybeReload('/communities')">
              <v-icon name="users" scale="2" /><br>
              My&nbsp;Groups
            </b-nav-item>
            <b-nav-item class="text-center p-0" to="/explore" @mousedown="maybeReload('/explore')">
              <v-icon name="map-marked-alt" scale="2" /><br>
              Explore
            </b-nav-item>
            <b-nav-item class="text-center p-0" to="/communityevents" @mousedown="maybeReload('/communityevetns')">
              <v-icon name="calendar-alt" scale="2" /><br>
              Events
            </b-nav-item>
            <b-nav-item class="text-center p-0" to="/volunteering" @mousedown="maybeReload('/volunteering')">
              <v-icon name="hands-helping" scale="2" /><br>
              Volunteer
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
      <ChatPopups v-if="loggedIn" />
      <LoginModal ref="loginModal" />
      <AboutMeModal ref="modal" />
      <div class="navbar-toggle" style="display: none" />
    </client-only>
  </div>
</template>

<style scoped lang="scss">
@import 'color-vars';

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
  width: 80px;
  text-align: center;
}

.nav-link {
  padding-left: 2px !important;
  padding-right: 2px !important;
}

nav .navbar-nav li a.nuxt-link-active[data-v-314f53c6] {
  color: $color-white-opacity-50 !important;
}

.navbar-dark .navbar-nav .nav-link {
  color: $color-white !important;
}

.navbar-dark .navbar-nav .nav-link:hover,
.navbar-dark .navbar-nav .nav-link:focus {
  color: $color-white-opacity-75 !important;
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

.dropdown-item {
  padding-left: 0px;
  padding-right: 0px;
}

.notifwrapper {
  position: relative;
}

.notifbadge {
  position: absolute;
  top: 0px;
  left: 18px;
}

.chatbadge {
  position: absolute;
  top: 0px;
  left: 25px;
}
</style>

<script>
// TODO DESIGN Notification dropdown window isn't wide enough before it's loaded.
const LoginModal = () => import('~/components/LoginModal')
const AboutMeModal = () => import('~/components/AboutMeModal')
const ChatPopups = () => import('~/components/ChatPopups')
const Notification = () => import('~/components/Notification')
const NchanSubscriber = require('nchan')

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
      distance: 1000,
      notificationPoll: null,
      nchan: null
    }
  },

  computed: {
    loggedIn() {
      const ret = Boolean(this.$store.getters['auth/user']())
      console.log('Default logged in?', this.$store.getters['auth/user']())
      return ret
    },
    me() {
      return this.$store.getters['auth/user']()
    },
    notifications() {
      const notifications = Object.values(
        this.$store.getters['notifications/list']()
      )
      return notifications
    },
    notificationCount() {
      // TODO We also need to change the window title.
      return this.$store.getters['notifications/count']()
    },
    chatCount() {
      // TODO We also need to change the window title.
      const chats = Object.values(this.$store.getters['chats/list']())
      let count = 0

      for (const chat of chats) {
        count += chat.unseen
      }

      return count
    }
  },

  watch: {
    $route() {
      // Close the dropdown menu when we move around.
      console.log('Route changed')
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
      if (this.nchan) {
        // Stop old listen.
        try {
          this.nchan.stop()
        } catch (e) {}

        this.nchan = null
      }

      if (newVal) {
        // We are now logged in.
        console.log('Start NCHAN from watch')
        this.startNCHAN(newVal.id)
      }
    }
  },

  async mounted() {
    // Clear old notifications because they're probably out of date now.
    await this.$store.dispatch('notifications/clear')

    // Poll regularly for new ones.  Would be nice if this was event driven instead but requires server work.
    this.notificationPoll = setTimeout(this.getNotificationCount, 30000)

    const me = this.$store.getters['auth/user']()

    if (me && me.id) {
      console.log('Start NCHAN from mount')
      this.startNCHAN(me.id)
    }
  },

  beforeDestroy() {
    console.log('Destroy layout')
    clearTimeout(this.notificationPoll)

    if (this.nchan) {
      console.log('Stop NCHAN')
      try {
        this.nchan.stop()
      } catch (e) {}

      this.nchan = null
    }
  },

  methods: {
    startNCHAN(id) {
      this.nchan = new NchanSubscriber(
        process.env.CHAT_HOST + '/subscribe?id=' + id,
        {
          subscriber: ['websocket', 'eventsource', 'longpoll ']
        }
      )

      // We store the last message we got from NCHAN.  This avoids us getting duplicate messages (triggering server
      // work) when we load up.
      const lastNCHAN = this.$store.getters['auth/nchan']()

      if (lastNCHAN) {
        this.nchan.lastMessageId = lastNCHAN.id
      }

      this.nchan.start()

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
      await this.$store.dispatch('notifications/count')
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
    },

    async markAllRead() {
      await this.$store.dispatch('notifications/allSeen')
      await this.$store.dispatch('notifications/count')
      await this.$store.dispatch('notifications/list')
    }
  }
}
</script>
