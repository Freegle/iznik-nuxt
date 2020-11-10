<template>
  <component
    :is="whatami"
    v-if="!simple"
    class="white text-center notification-list"
    toggle-class="notification-list__dropdown-toggle"
    menu-class="notification-list__dropdown-menu"
    lazy
    right
    @shown="loadLatestNotifications"
  >
    <template slot="button-content">
      <div class="position-relative text-center small">
        <v-icon name="bell" scale="2" class="notification-list__icon" />
        <b-badge v-if="unreadNotificationCount" variant="danger" class="notification-badge">
          {{ unreadNotificationCount }}
        </b-badge><br>
        <span v-if="!smallScreen" class="nav-item__text">Notifications</span>
      </div>
    </template>
    <b-dropdown-item class="text-right" link-class="notification-list__item">
      <b-btn variant="white" size="sm" @click="markAllRead">
        Mark all read
      </b-btn>
    </b-dropdown-item>
    <b-dropdown-divider />
    <b-dropdown-item v-for="notification in notifications" :key="'notification-' + notification.id" class="p-0 notpad" link-class="notification-list__item">
      <Notification :notification="notification" class="p-0" @showModal="showAboutMe" />
    </b-dropdown-item>
    <infinite-loading :distance="distance" @infinite="loadMoreNotifications">
      <span slot="no-results" />
      <span slot="no-more" />
      <span slot="spinner">
        <b-img-lazy src="~/static/loader.gif" alt="Loading" />
      </span>
    </infinite-loading>
    <client-only>
      <AboutMeModal ref="aboutMeModal" />
    </client-only>
  </component>
</template>

<script>
const Notification = () => import('~/components/Notification')
const InfiniteLoading = () => import('vue-infinite-loading')
const AboutMeModal = () => import('~/components/AboutMeModal')

export default {
  components: {
    InfiniteLoading,
    Notification,
    AboutMeModal
  },
  props: {
    distance: {
      type: Number,
      required: true
    },
    smallScreen: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    whatami() {
      return this.smallScreen ? 'b-nav-item-dropdown' : 'b-dropdown'
    },
    notifications() {
      return this.$store.getters[
        'notifications/getCurrentListInDescendingDateOrder'
      ]
    },
    unreadNotificationCount() {
      return this.$store.getters['notifications/getUnreadCount']
    }
  },
  watch: {
    unreadNotificationCount: function() {
      this.$emit('unread-notification-count', this.unreadNotificationCount)
    }
  },
  mounted() {
    const me = this.$store.getters['auth/user']

    if (me && me.id) {
      // Get notifications and poll regularly for new ones.  Would be nice if this was event driven instead but requires server work.
      this.$store.dispatch('notifications/updateNotifications')
    }
  },
  methods: {
    loadLatestNotifications() {
      // We want to make sure we have the most up to date notifications.
      this.complete = false
      this.$store.dispatch('notifications/clear')
      this.$store.dispatch('notifications/fetchNextListChunk')
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
    async markAllRead() {
      await this.$store.dispatch('notifications/allSeen')
      await this.$store.dispatch('notifications/updateUnreadNotificationCount')
      await this.$store.dispatch('notifications/fetchNextListChunk')
    },
    showAboutMe() {
      this.$refs.aboutMeModal.show()
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.notification-badge {
  position: absolute;
  top: 0px;
  left: 18px;

  @include media-breakpoint-up(xl) {
    left: 40px;
  }
}

.notification-list {
  max-width: 100%;
}

.notification-list__icon {
  height: 32px;
  margin-bottom: 0;
}

/* These classes style the bootstrap b-nav-item-dropdown component */
::v-deep .notification-list__dropdown-toggle {
  color: $color-white !important;
}

::v-deep .notification-list__dropdown-menu {
  height: 500px;
  overflow-y: auto;
}

.notification-list ::v-deep .dropdown-item {
  width: 300px;
  max-width: 100%;
  padding-left: 5px;
  overflow-wrap: break-word;
}
</style>
