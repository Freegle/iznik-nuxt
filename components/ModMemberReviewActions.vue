<template>
  <b-card no-body>
    <b-card-body class="p-2">
      <div>
        <strong>{{ membership.namedisplay.length > 32 ? (membership.namedisplay.substring(0, 32) + '...') : membership.namedisplay }}</strong>
        <span :class="'small ' + (daysago(membership.added) < 31 ? 'text-danger font-weight-bold' : 'text-muted')">joined {{ timeago(membership.added) }}</span>
        <span v-if="membership.reviewreason" class="text-danger ml-1 mr-1">{{ membership.reviewreason }}</span>
      </div>
      <div v-if="amAModOn(membership.id) && needsReview" class="d-flex mt-2">
        <SpinButton
          name="check"
          spinclass="success"
          variant="primary"
          :handler="ignore"
          label="Ignore"
          class="mr-2"
        />
        <SpinButton
          name="trash-alt"
          spinclass="success"
          variant="warning"
          :handler="remove"
          label="Remove"
          class="mr-2"
        />
        <b-btn :to="'/modtools/members/approved/search/' + membership.id + '/' + member.userid" variant="secondary">
          Go to membership
        </b-btn>
      </div>
    </b-card-body>
    <ConfirmModal ref="removeConfirm" :title="'Remove ' + member.displayname + ' from ' + membership.namedisplay + '?'" @confirm="removeConfirmed" />
  </b-card>
</template>
<script>
import SpinButton from '@/components/SpinButton'
import ConfirmModal from './ConfirmModal'

export default {
  components: {
    SpinButton,
    ConfirmModal
  },
  props: {
    member: {
      type: Object,
      required: true
    },
    membership: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      reviewed: false
    }
  },
  computed: {
    needsReview() {
      if (this.reviewed) {
        return false
      }

      return (
        new Date(this.membership.reviewrequestedat).getTime() >
        new Date(this.membership.reviewedat).getTime()
      )
    }
  },
  methods: {
    async remove() {
      await this.waitForRef('removeConfirm', () => {
        this.$refs.removeConfirm.show()
      })

      setTimeout(() => {
        this.reviewed = true
      }, 2000)
    },
    async removeConfirmed() {
      await this.$store.dispatch('members/remove', {
        userid: this.member.userid,
        groupid: this.member.id
      })

      setTimeout(() => {
        this.reviewed = true
      }, 2000)
    },
    async ignore() {
      await this.$store.dispatch('members/spamignore', {
        userid: this.member.userid,
        groupid: this.membership.id
      })

      setTimeout(() => {
        this.reviewed = true
      }, 2000)
    },
    daysago(d) {
      return this.$dayjs().diff(this.$dayjs(d), 'days')
    }
  }
}
</script>
