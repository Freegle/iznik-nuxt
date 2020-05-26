<template>
  <div>
    <div v-if="pending" class="d-inline">
      <ModMemberButton
        v-if="spamignore && member.suspectreason"
        :member="member"
        variant="primary"
        icon="check"
        spamignore
        label="Approve"
      />
      <ModMemberButton
        v-if="!member.heldby"
        :member="member"
        variant="primary"
        icon="check"
        approve
        label="Approve"
      />
      <ModMemberButton
        v-if="!member.heldby"
        :member="member"
        variant="warning"
        icon="times"
        reject
        label="Reject"
      />
      <ModMemberButton
        v-if="!member.heldby"
        :member="member"
        variant="danger"
        icon="trash-alt"
        delete
        label="Delete"
      />
      <ModMemberButton
        v-if="!member.heldby"
        :member="member"
        variant="warning"
        icon="pause"
        hold
        label="Hold"
      />
      <ModMemberButton
        v-if="!member.heldby"
        :member="member"
        variant="danger"
        icon="ban"
        spamreport
        label="Spammer"
      />
    </div>
    <div v-else-if="spam" class="d-inline">
      <ModMemberButton
        v-if="spamignore"
        :member="member"
        variant="primary"
        icon="check"
        spamignore
        label="Approve"
      />
      <div v-if="member.spammer.collection === 'PendingAdd'" class="d-inline">
        <ModMemberButton
          v-if="supportOrAdmin"
          :member="member"
          variant="primary"
          icon="check"
          spamconfirm
          label="Confirm add to spammer list"
        />
        <ModMemberButton
          v-if="supportOrAdmin"
          :member="member"
          variant="danger"
          icon="trash-alt"
          spamremove
          label="Reject add to spammer list"
        />
        <ModMemberButton
          v-if="supportOrAdmin"
          :member="member"
          variant="primary"
          icon="check"
          spamwhitelist
          label="Whitelist"
        />
        <ModMemberButton
          v-else
          :member="member"
          variant="primary"
          icon="times"
          spamrequestremove
          label="Request removal"
        />
      </div>
      <div v-else class="d-inline">
        <ModMemberButton
          v-if="supportOrAdmin"
          :member="member"
          variant="danger"
          icon="trash-alt"
          spamremove
          label="Remove from spammer list"
        />
        <ModMemberButton
          v-else
          :member="member"
          variant="primary"
          icon="times"
          spamrequestremove
          label="Request removal"
        />
      </div>
    </div>
    <div v-else-if="approved" class="d-inline">
      <ModMemberButton
        v-if="spamignore && member.suspectreason"
        :member="member"
        variant="primary"
        icon="check"
        spamignore
        label="Approve"
      />
      <ModMemberButton
        :member="member"
        variant="white"
        icon="envelope"
        leave
        label="Mail"
      />
      <ModMemberButton
        :member="member"
        variant="danger"
        icon="trash-alt"
        delete
        label="Delete"
      />
      <ModMemberButton
        :member="member"
        variant="danger"
        icon="ban"
        spamreport
        label="Spammer"
      />
    </div>
    <div v-if="!member.heldby" class="d-inline">
      <ModMemberButton
        v-for="stdmsg in filtered"
        :key="stdmsg.id"
        :variant="variant(stdmsg)"
        :icon="icon(stdmsg)"
        :label="stdmsg.title"
        :stdmsgid="stdmsg.id"
        :member="member"
      />
      <b-btn
        v-if="rareToShow && !showRare"
        variant="white"
        class="mb-1"
        @click="showRare = true"
      >
        <v-icon name="caret-down" /> +{{ rareToShow }}...
      </b-btn>
    </div>
  </div>
</template>
<script>
import ModMemberButton from './ModMemberButton'
import waitForRef from '@/mixins/waitForRef'

export default {
  components: { ModMemberButton },
  mixins: [waitForRef],
  props: {
    member: {
      type: Object,
      required: true
    },
    modconfig: {
      type: Object,
      required: false,
      default: null
    },
    spamignore: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      showRare: false,
      showSpamModal: false
    }
  },
  computed: {
    pending() {
      return this.hasCollection('Pending')
    },
    approved() {
      return this.hasCollection('Approved')
    },
    spam() {
      return this.member.spammer
    },
    validActions() {
      // The standard messages we show depend on the valid ones for this type of member.
      if (this.pending) {
        return ['Approve Member', 'Reject Member', 'Leave Member']
      } else if (this.approved) {
        return ['Leave Approved Member', 'Delete Approved Member']
      }

      return []
    },
    rareToShow() {
      return this.filterByAction.length - this.filtered.length
    },
    filterByAction() {
      if (this.modconfig) {
        return this.modconfig.stdmsgs.filter(stdmsg => {
          return this.validActions.indexOf(stdmsg.action) !== -1
        })
      }

      return []
    },
    filtered() {
      if (this.modconfig) {
        return this.filterByAction.filter(stdmsg => {
          return this.showRare || !parseInt(stdmsg.rarelyused)
        })
      }

      return []
    }
  },
  methods: {
    icon(stdmsg) {
      switch (stdmsg.action) {
        case 'Approve Member':
          return 'check'
        case 'Reject Member':
          return 'times'
        case 'Leave Member':
        case 'Leave Approved Member':
          return 'envelope'
        case 'Delete Approved Member':
          return 'trash-alt'
        case 'Edit':
          return 'pen'
        default:
          return 'check'
      }
    },

    variant(stdmsg) {
      switch (stdmsg.action) {
        case 'Approve Member':
          return 'success'
        case 'Reject Member':
          return 'warning'
        case 'Leave Member':
        case 'Leave Approved Member':
          return 'primary'
        case 'Delete Approved Member':
          return 'danger'
        case 'Edit':
          return 'primary'
        default:
          return 'white'
      }
    },

    hasCollection(coll) {
      let ret = false

      if (this.member.memberof) {
        this.member.memberof.forEach(group => {
          if (group.id === this.member.groupid && group.collection === coll) {
            ret = true
          }
        })
      }

      return ret
    }
  }
}
</script>
