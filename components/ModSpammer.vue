<template>
  <NoticeMessage :variant="variant" class="mb-1">
    <div>
      {{ collname }}: {{ user.spammer.reason }}
    </div>
    <div class="small">
      <span v-if="user.spammer.collection === 'PendingAdd'">
        Reported
      </span>
      <span v-else>
        Added
      </span>
      <span v-if="user.spammer.byuser">
        by
        {{ user.spammer.byuser.displayname }}
        (<ExternalLink :href="'mailto:' + user.spammer.byuser.email">{{ user.spammer.byuser.email }}</ExternalLink>)
      </span>
      #{{ user.spammer.byuserid }} {{ user.spammer.added | timeago }}
    </div>
  </NoticeMessage>
</template>
<script>
import NoticeMessage from './NoticeMessage'
const ExternalLink = () => import('~/components/ExternalLink')
export default {
  components: { NoticeMessage, ExternalLink },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    variant() {
      switch (this.user.spammer.collection) {
        case 'Spammer': {
          return 'danger'
        }
        case 'Whitelisted': {
          return 'primary'
        }
        default: {
          return 'warning'
        }
      }
    },
    collname() {
      switch (this.user.spammer.collection) {
        case 'Spammer': {
          return 'Confirmed Spammer'
        }
        case 'Whitelisted': {
          return 'Whitelisted'
        }
        case 'PendingAdd': {
          return 'Unconfirmed Spammer'
        }
        case 'PendingRemove': {
          return 'Disputed Spammer'
        }
        default:
          return this.user.spammer.collection
      }
    }
  }
}
</script>
