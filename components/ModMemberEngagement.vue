<template>
  <div v-if="member">
    <div v-if="member.lastaccess" :class="'mb-1 ' + (inactive ? 'text-danger': '')">
      Last active: {{ timeago(member.lastaccess) }}
      <span v-if="inactive">
        - won't send mails
      </span>
      <b-badge :variant="variant">
        {{ engagement }}
      </b-badge>
      <Supporter v-if="member.supporter" class="small" />
    </div>
  </div>
</template>
<script>
import Supporter from '@/components/Supporter'

export default {
  components: { Supporter },
  props: {
    member: {
      type: Object,
      required: true
    }
  },
  computed: {
    inactive() {
      // This code matches server code in sendOurMails.
      return (
        this.member &&
        this.member.lastaccess &&
        this.$dayjs().diff(this.$dayjs(this.member.lastaccess), 'days') >=
          365 / 2
      )
    },
    engagement() {
      if (!this.member) {
        return null
      }

      // Map a few of the server values.
      switch (this.member.engagement) {
        case 'At Risk': {
          return 'Dormant Soon'
        }
        case 'Obsessed': {
          return 'Very Frequent'
        }
        default: {
          return this.member.engagement
        }
      }
    },
    variant() {
      if (!this.member) {
        return null
      }

      // Colour-code based on engagement.
      let ret = 'light'

      switch (this.member.engagement) {
        case 'New': {
          ret = 'info'
          break
        }
        case 'Occasional': {
          ret = 'secondary'
          break
        }
        case 'Frequent': {
          ret = 'primary'
          break
        }
        case 'Obsessed': {
          ret = 'danger'
          break
        }
        case 'Inactive': {
          ret = 'light'
          break
        }
        case 'AtRisk': {
          ret = 'light'
          break
        }
        case 'Dormant': {
          ret = 'dark'
          break
        }
      }

      return ret
    }
  }
}
</script>
