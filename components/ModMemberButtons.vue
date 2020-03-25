<template>
  <div>
    <div v-if="pending" class="d-inline">
      <ModMemberButton
        v-if="!member.heldby"
        :member="member"
        variant="success"
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
        v-if="member.heldby"
        :member="member"
        variant="warning"
        icon="play"
        release
        label="Release"
      />
      <ModMemberButton
        v-if="!member.heldby"
        :member="member"
        variant="danger"
        icon="ban"
        spam
        label="Spam"
        disabled
      />
      <!--      TODO Spam button-->
    </div>
    <div v-else-if="spam" class="d-inline">
      <ModMemberButton
        :member="member"
        variant="success"
        icon="times"
        delete
        label="Request removal"
        disabled
      />
      <ModMemberButton
        v-if="supportOrAdmin"
        :member="member"
        variant="danger"
        icon="trash-alt"
        delete
        label="Remove from list"
        disabled
      />
      <ModMemberButton
        v-if="supportOrAdmin"
        :member="member"
        variant="primary"
        icon="check"
        notspam
        label="Whitelist"
        disabled
      />
    </div>
    <div v-else-if="approved" class="d-inline">
      <ModMemberButton
        :member="member"
        variant="success"
        icon="envelope"
        leave
        label="Reply"
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
        spam
        label="Spam"
        disabled
      />
    </div>
    <div v-if="!member.heldby" class="d-lg-inline">
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

export default {
  components: { ModMemberButton },
  props: {
    member: {
      type: Object,
      required: true
    },
    modconfig: {
      type: Object,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      showRare: false
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
