<template>
  <div>
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
            <b-nav-item id="menu-option-search" class="text-center small p-0" to="/search" @mousedown="maybeReload('/search')">
              <v-icon name="search" scale="2" /><br>
              <span class="nav-item__text">Search</span>
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
            <b-nav-item-dropdown v-if="!simple" class="white text-center notiflist" lazy right @shown="loadLatestNotifications">
              <template slot="button-content">
                <div class="notifwrapper text-center small">
                  <v-icon name="bell" scale="2" />
                  <b-badge v-if="notificationCount" variant="danger" class="notification-badge">
                    {{ notificationCount }}
                  </b-badge><br>
                  <span class="nav-item__text">Notifications</span>
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
              <infinite-loading :distance="distance" @infinite="loadMoreNotifications">
                <span slot="no-results" />
                <span slot="no-more" />
                <span slot="spinner">
                  <b-img-lazy src="~/static/loader.gif" alt="Loading" />
                </span>
              </infinite-loading>
            </b-nav-item-dropdown>
            <b-nav-item id="menu-option-chat" class="text-center small p-0" to="/chats" @click="toChats">
              <div class="notifwrapper">
                <v-icon name="comments" scale="2" /><br>
                <span class="nav-item__text">Chats</span>
                <b-badge v-if="chatCount" variant="danger" class="chatbadge">
                  {{ chatCount }}
                </b-badge>
              </div>
            </b-nav-item>
            <b-nav-item v-if="!simple" id="menu-option-spread" class="text-center small p-0" to="/spread" @mousedown="maybeReload('/spread')">
              <div class="notifwrapper">
                <v-icon name="bullhorn" scale="2" /><br>
                <span class="nav-item__text">Spread</span>
                <b-badge v-if="spreadCount" variant="info" class="chatbadge">
                  {{ spreadCount }}
                </b-badge>
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
          <b-dropdown
            v-if="loggedIn"
            class="white text-center notiflist mr-2"
            variant="transparent"
            lazy
            right
            @shown="loadLatestNotifications"
          >
            <template slot="button-content">
              <div class="notifwrapper">
                <v-icon name="bell" scale="2" class="" />
                <b-badge v-if="notificationCount" variant="danger" class="notification-badge">
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
            <infinite-loading :distance="distance" @infinite="loadMoreNotifications">
              <span slot="no-results" />
              <span slot="no-more" />
              <span slot="spinner">
                <b-img-lazy src="~/static/loader.gif" alt="Loading" />
              </span>
            </infinite-loading>
          </b-dropdown>

          <a v-if="loggedIn" id="menu-option-chat-sm" href="#" class="text-white mr-3 position-relative" @click="toChats">
            <v-icon name="comments" scale="2" /><br>
            <b-badge v-if="chatCount" variant="danger" class="chatbadge">
              {{ chatCount }}
            </b-badge>
          </a>
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
          <b-nav-item class="text-center p-0" to="/search" @mousedown="maybeReload('/search')">
            <v-icon name="search" scale="2" /><br>
            <span class="nav-item__text">Search</span>
          </b-nav-item>
          <b-nav-item v-if="!simple" class="text-center p-0" to="/communityevents" @mousedown="maybeReload('/communityevents')">
            <v-icon name="calendar-alt" scale="2" /><br>
            <span class="nav-item__text">Events</span>
          </b-nav-item>
          <b-nav-item v-if="!simple" class="text-center p-0" to="/volunteerings" @mousedown="maybeReload('/volunteerings')">
            <v-icon name="hands-helping" scale="2" /><br>
            <span class="nav-item__text">Volunteer</span>
          </b-nav-item>
          <b-nav-item v-if="!simple" class="text-center p-0" to="/spread" @mousedown="maybeRemodload('/spread')">
            <v-icon name="bullhorn" scale="2" /><br>
            <span class="nav-item__text">Spread</span>
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

    <nuxt ref="pageContent" class="ml-0 pl-0 pl-sm-1 pr-0 pr-sm-1 pageContent" />
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

const AboutMeModal = () => import('~/components/AboutMeModal')
const ChatPopups = () => import('~/components/ChatPopups')
const Notification = () => import('~/components/Notification')
const NchanSubscriber = require('nchan')
const InfiniteLoading = () => import('vue-infinite-loading')
const ExternalLink = () => import('~/components/ExternalLink')

export default {
  components: {
    SimpleView,
    InfiniteLoading,
    ChatPopups,
    Notification,
    AboutMeModal,
    LoginModal,
    LocalStorageMonitor,
    BouncingEmail,
    ExternalLink
  },

  data: function() {
    return {
      complete: false,
      distance: 1000,
      chatPoll: null,
      nchan: null,
      logo: require(`@/static/icon.png`)
    }
  },

  head() {
    const totalCount = this.notificationCount + this.chatCount
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

  computed: {
    notifications() {
      return this.$store.getters[
        'notifications/getCurrentListInDescendingDateOrder'
      ]
    },
    notificationCount() {
      return this.$store.getters['notifications/getUnreadCount']
    },
    chatCount() {
      // Don't show so many that the layout breaks.
      return Math.min(99, this.$store.getters['chats/unseenCount'])
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

  mounted() {
    if (process.browser) {
      // Add class for screen background.
      document.body.classList.add('fd')
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
      console.log('Start NCHAN from mount')
      this.startNCHAN(me.id)

      // Get notifications and chats and poll regularly for new ones.  Would be nice if this was event driven instead but requires server work.
      this.fetchLatestChats()
      this.$store.dispatch('notifications/updateNotifications')
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
    clearTimeout(this.chatPoll)

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

          if (!mt && ret && ret.text) {
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
    async fetchLatestChats() {
      const me = this.$store.getters['auth/user']

      if (me && me.id) {
        const currentCount = this.$store.getters['chats/unseenCount']
        const newCount = await this.$store.dispatch('chats/unseenCount')

        if (newCount !== currentCount) {
          await this.$store.dispatch('chats/listChats', {
            chattypes: ['User2User', 'User2Mod'],
            summary: true,
            noerror: true
          })
        }
      }

      this.chatPoll = setTimeout(this.fetchLatestChats, 30000)
    },

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

    loadMoreNotifications: function($state) {
      const currentCount = this.notifications.length

      if (this.complete) {
        $state.complete()
      } else {
        this.busy = true
        this.$store
          .dispatch('notifications/fetchNextListChunk')
          .then(() => {
            try {
              const notifications = this.$store.getters[
                'notifications/getCurrentList'
              ]

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

    loadLatestNotifications() {
      // We want to make sure we have the most up to date notifications.
      this.complete = false
      this.$store.dispatch('notifications/clear')
      this.$store.dispatch('notifications/fetchNextListChunk')
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

      this.$router.push('/chats')
    },

    async markAllRead() {
      await this.$store.dispatch('notifications/allSeen')
      await this.$store.dispatch('notifications/updateUnreadNotificationCount')
      await this.$store.dispatch('notifications/fetchNextListChunk')
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

.notifwrapper {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: 0px;
  left: 18px;

  @include media-breakpoint-up(xl) {
    left: 40px;
  }
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

.notiflist ::v-deep .dropdown-toggle {
  color: $color-white;
}
</style>
