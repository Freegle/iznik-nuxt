<template>
  <b-card no-body>
    <b-card-body class="p-2">
      <div>
        <strong>{{ membership.namedisplay.length > 32 ? (membership.namedisplay.substring(0, 32) + '...') : membership.namedisplay }}</strong>
        <span :class="'small ' + (daysago(membership.added) < 31 ? 'text-danger font-weight-bold' : 'text-muted')">joined {{ timeago(membership.added) }}</span>
        <span v-if="membership.reviewreason" class="text-danger ml-1 mr-1">
          <span v-if="membership.reviewrequestedat" class="text-dark small ">flagged {{ timeago(membership.reviewrequestedat) }}</span>
          {{ membership.reviewreason }}
        </span>
      </div>
      <div v-if="amAModOn(membership.id) && needsReview && membership.heldby">
        <NoticeMessage variant="warning" class="mt-2 mb-2">
          <p v-if="me.id === membership.heldby">
            You held this member.  Other people will see a warning to check with
            you before releasing them.
          </p>
          <p v-else>
            Held by <v-icon name="hashtag" class="text-muted" scale="0.5" /><strong>{{ membership.heldby }}</strong>.  Please check before releasing them.
          </p>
        </NoticeMessage>
      </div>
      <div v-if="amAModOn(membership.id) && needsReview" class="d-flex mt-2 flex-wrap">
        <SpinButton
          v-if="!membership.heldby || membership.heldby.id === myid"
          name="check"
          spinclass="success"
          variant="primary"
          :handler="ignore"
          label="Ignore"
          class="mr-2 mb-1"
        />
        <SpinButton
          v-if="!membership.heldby || membership.heldby.id === myid"
          name="trash-alt"
          spinclass="success"
          variant="warning"
          :handler="remove"
          label="Remove"
          class="mr-2 mb-1"
        />
        <ModMemberButton
          v-if="!membership.heldby"
          :member="membership"
          variant="warning"
          icon="pause"
          reviewhold
          :reviewgroupid="groupid"
          label="Hold"
          class="mr-2 mb-1"
        />
        <ModMemberButton
          v-else
          :member="membership"
          variant="warning"
          icon="play"
          reviewrelease
          :reviewgroupid="groupid"
          label="Release"
          class="mr-2 mb-1"
        />
        <b-btn :to="'/modtools/members/approved/search/' + membership.id + '/' + member.userid" variant="secondary" class="mb-1">
          Go to membership
        </b-btn>
      </div>
    </b-card-body>
    <ConfirmModal ref="removeConfirm" :title="'Remove ' + member.displayname + ' from ' + membership.namedisplay + '?'" @confirm="removeConfirmed" />
  </b-card>
</template>
<script>
import SpinButton from '@/components/SpinButton'
import NoticeMessage from '@/components/NoticeMessage.vue'
import ConfirmModal from './ConfirmModal'
import ModMemberButton from '~/components/ModMemberButton.vue'

export default {
  components: {
    NoticeMessage,
    ModMemberButton,
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
    groupid() {
      let ret = null

      this.member.memberof.forEach(h => {
        if (h.id === this.membership.id) {
          ret = h.id
        }
      })

      return ret
    },
    needsReview() {
      if (this.reviewed) {
        return false
      }

      return (
        !this.membership.reviewedat ||
        new Date(this.membership.reviewrequestedat).getTime() >=
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
        groupid: this.membership.id
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
