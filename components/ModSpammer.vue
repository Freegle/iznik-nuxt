<template>
  <NoticeMessage :variant="variant" class="mb-1">
    <div>
      {{ collname }}: {{ user.spammer.reason }}
    </div>
    <div class="small">
      <span v-if="user.spammer.collection === 'PendingAdd'">
        Reported by
      </span>
      <span v-else>
        Added by
      </span>
      <span v-if="user.spammer.byuser">
        {{ user.spammer.byuser.displayname }}
        <span v-if="user.spammer.collection === 'PendingAdd' && hasPermissionSpamAdmin">
          (<ExternalLink :href="'mailto:' + user.spammer.byuser.email + '?cc=spammerlist@ilovefreegle.org'">{{ user.spammer.byuser.email }}</ExternalLink>)
        </span>
        <span v-else>
          (<ExternalLink :href="'mailto:' + user.spammer.byuser.email">{{ user.spammer.byuser.email }}</ExternalLink>)
        </span>
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
