<template>
  <div>
    <MainHeader :key="'nuxt1-' + bump" :chat-count.sync="chatCount" :unread-notification-count.sync="unreadNotificationCount" @login="login" />
    <main :key="'nuxt2-' + bump">
      <nuxt ref="pageContent" class="ml-0 pl-0 pl-sm-1 pr-0 pr-sm-1 pageContent" />
    </main>
    <BouncingEmail />
    <div class="navbar-toggle" style="display: none" />
    <div id="serverloader" class="bg-white">
      <b-img src="~/static/loader.gif" alt="Loading..." />
      <!-- Don't allow this to format neatly, otherwise SSR doesn't match and we get a client-side re-render -->
      <!-- eslint-disable-next-line -->
      <p><span>Loading...</span><br><span class="font-weight-bold">Stuck here?  Try refreshing.  Or Chrome.</span><ExternalLink href="mailto:support@ilovefreegle.org" style="color: black;"><br> No luck? Contact us</ExternalLink></p>
    </div>
    <client-only>
      <ChatPopups v-if="loggedIn" class="d-none d-sm-block" />
      <span ref="breakpoint" class="d-inline d-sm-none" />
      <div class="d-none">
        <ChatButton v-if="replyToSend" ref="replyToPostChatButton" :userid="replyToUser" />
      </div>
      <Breakpoint />
      <GoogleOneTap @loggedin="googleLoggedIn" @complete="googleLoaded" />
      <LoginModal v-if="!loggedIn" ref="loginModal" :key="bumpLogin" />
    </client-only>
  </div>
</template>
<script>
import replyToPost from '@/mixins/replyToPost'
import BouncingEmail from '~/components/BouncingEmail'
import MainHeader from '~/components/MainHeader'
import LoginModal from '~/components/LoginModal'

const Breakpoint = () => import('~/components/Breakpoint')
const ChatPopups = () => import('~/components/ChatPopups')
const ChatButton = () => import('~/components/ChatButton')
const ExternalLink = () => import('~/components/ExternalLink')
const GoogleOneTap = () => import('~/components/GoogleOneTap')

export default {
  components: {
    Breakpoint,
    ChatPopups,
    ChatButton,
    BouncingEmail,
    ExternalLink,
    MainHeader,
    GoogleOneTap,
    LoginModal
  },
  mixins: [replyToPost],
  data: function() {
    return {
      timeTimer: null,
      unreadNotificationCount: 0,
      chatCount: 0,
      bump: 0,
      bumpLogin: 0
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
    $route(newVal) {
      // Automatic route tracking doesn't seem to be working.
      this.$ga.page(newVal.fullPath)
    }
  },
  async mounted() {
    if (process.client) {
      try {
        // Wait for the store if necessary.
        await this.$store.restored
      } catch (e) {
        console.log('Store restore wait failed', e)
      }

      // Add class for screen background.
      document.body.classList.add('fd')

      // Start our timer.  Holding the time in the store allows us to update the time regularly and have reactivity
      // cause displayed fromNow() values to change, rather than starting a timer for each of them.
      this.updateTime()
    }

    // Ensure we know whether we're FD or MT.
    const existingModtools = this.$store.getters['misc/get']('modtools')

    if (existingModtools) {
      this.$store.dispatch('misc/set', {
        key: 'modtools',
        value: false
      })
    }

    if (document) {
      // We added a basic loader into the HTML.  This helps if we are loaded on an old browser where our JS bombs
      // out - at least we display something, with a link to support.  But now we're up and running, remove that.
      //
      // We have an animation on the loader so that it only becomes visible after ~10s.  That prevents page flicker
      // if we manage to get up and running rapidly.
      const l = document.getElementById('serverloader')
      l.style.display = 'none'
    }

    if (this.me) {
      // Get chats and poll regularly for new ones
      this.$store.dispatch('chats/fetchLatestChats')

      // Get any existing trysts.
      this.$store.dispatch('tryst/fetch')
    }

    try {
      // Set the build date.  This may get superceded by Sentry releases, but it does little harm to add it in.
      this.$sentry.setExtra('builddate', process.env.BUILD_DATE)

      if (this.me) {
        // Set the context for sentry so that we know which users are having errors.
        this.$sentry.setUser({ userid: this.myid })

        // eslint-disable-next-line no-undef
        if (typeof __insp !== 'undefined') {
          // eslint-disable-next-line no-undef
          __insp.push([
            'tagSession',
            {
              userid: this.myid,
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

    if (process.client) {
      if (this.replyToSend) {
        // We have loaded the site with a reply that needs sending.  This happens if we force login in a way that
        // causes us to navigate away and back again.  Fetch the relevant message.
        await this.$store.dispatch('messages/fetch', {
          id: this.replyToSend.replyMsgId
        })

        this.replyToPost()
      }
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
    updateTime() {
      this.$store.dispatch('misc/setTime')
      this.timeTimer = setTimeout(this.updateTime, 10000)
    },
    googleLoggedIn() {
      // Re-render the page, now that we are logged in.
      this.bump++
    },
    googleLoaded() {
      if (
        this.$refs.loginModal &&
        this.$refs.loginModal.showModal &&
        this.$refs.loginModal.email
      ) {
        console.log(
          'Showing login modal - leave well alone',
          this.$refs.loginModal.email
        )
      } else {
        this.bumpLogin++
      }
    },
    login() {
      this.$refs.loginModal.show()
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
  box-sizing: border-box;
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

body.modal-open {
  padding-right: 0px !important;
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
</style>
