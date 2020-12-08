<template>
  <component
    :is="notificationType"
    class="white text-center notification-list"
    :class="{'mr-2' : smallScreen}"
    :variant="smallScreen ? 'transparent' : ''"
    toggle-class="notification-list__dropdown-toggle"
    menu-class="notification-list__dropdown-menu"
    lazy
    right
    no-caret
    aria-label="notifications"
    @shown="loadLatestNotifications"
  >
    <template slot="button-content">
      <div class="position-relative" :class="{'text-center small' : !smallScreen}">
        <v-icon name="bell" scale="2" class="notification-list__icon" />
        <b-badge v-if="unreadNotificationCount" variant="danger" class="notification-badge">
          {{ unreadNotificationCount }}
        </b-badge>
        <div v-if="!smallScreen" class="nav-item__text">
          Notifications
        </div>
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
  </component>
</template>

<script>
const Notification = () => import('~/components/Notification')
const InfiniteLoading = () => import('vue-infinite-loading')

export default {
  name: 'NotificationOptions',
  components: {
    InfiniteLoading,
    Notification
  },
  props: {
    distance: {
      type: Number,
      required: true
    },
    smallScreen: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    notificationType() {
      // A different component needs to be created depending on the context in which it's used
      return this.smallScreen ? 'b-dropdown' : 'b-nav-item-dropdown'
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
      this.$emit('update:unreadNotificationCount', this.unreadNotificationCount)
    }
  },
  mounted() {
    const me = this.$store.getters['auth/user']

    if (me && me.id) {
      // Get notifications and poll regularly for new ones.
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
    loadMoreNotifications: async function($state) {
      if (this.complete) {
        $state.complete()
      } else {
        try {
          const currentCount = this.notifications.length

          await this.$store.dispatch('notifications/fetchNextListChunk')

          const notifications = this.$store.getters[
            'notifications/getCurrentList'
          ]

          if (currentCount === notifications.length) {
            this.complete = true
            $state.complete()
          } else {
            $state.loaded()
          }
        } catch (e) {
          console.error(e)
          $state.complete()
        }
      }
    },
    async markAllRead() {
      await this.$store.dispatch('notifications/allSeen')
      await this.$store.dispatch('notifications/updateUnreadNotificationCount')
      await this.$store.dispatch('notifications/fetchNextListChunk')
    },
    showAboutMe() {
      this.$emit('showAboutMe')
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

  &:hover {
    color: $color-white-opacity-75 !important;
  }
}

::v-deep .notification-list__dropdown-menu {
  height: 500px;
  overflow-y: auto;

  // The offset property of the b-dropdown doesn't function when contained
  // within a bootstrap nav element.  Therefore we have to manually shuffle
  // it so it fits on a smaller screen
  transform: translate(65px);

  @include media-breakpoint-up(sm) {
    transform: none;
  }
}

.notification-list ::v-deep .dropdown-item {
  width: 300px;
  max-width: 100%;
  padding-left: 5px;
  overflow-wrap: break-word;
}
</style>
