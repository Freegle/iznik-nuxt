<template>
  <div>
    <div v-if="editreview" class="d-inline">
      <ModMessageButton
        :message="message"
        variant="primary"
        icon="check"
        approveedits
        label="Accept Edit"
      />
      <ModMessageButton
        :message="message"
        variant="danger"
        icon="times"
        revertedits
        label="Reject Edit"
      />
      <ModMessageButton
        :message="message"
        variant="primary"
        icon="envelope"
        leave
        label="Reply"
      />
    </div>
    <div v-else-if="pending" class="d-inline">
      <ModMessageButton
        v-if="!message.heldby && !cantpost"
        :message="message"
        variant="primary"
        icon="check"
        approve
        label="Approve"
      />
      <ModMessageButton
        v-if="!message.heldby"
        :message="message"
        variant="warning"
        icon="times"
        reject
        label="Reject"
      />
      <ModMessageButton
        v-if="!message.heldby"
        :message="message"
        variant="danger"
        icon="trash-alt"
        delete
        label="Delete"
      />
      <ModMessageButton
        v-if="!message.heldby"
        :message="message"
        variant="warning"
        icon="pause"
        hold
        label="Hold"
      />
      <ModMessageButton
        v-if="!message.heldby"
        :message="message"
        variant="danger"
        icon="ban"
        spam
        label="Spam"
      />
    </div>
    <div v-else-if="approved" class="d-inline">
      <ModMessageButton
        :message="message"
        variant="primary"
        icon="envelope"
        leave
        label="Reply"
      />
      <ModMessageButton
        :message="message"
        variant="danger"
        icon="trash-alt"
        delete
        label="Delete"
      />
      <ModMessageButton
        :message="message"
        variant="danger"
        icon="ban"
        spam
        label="Spam"
      />
      <SpinButton
        v-if="message.type === 'Offer' && !message.outcomes.length"
        variant="white"
        class="m-1"
        name="check"
        label="Mark as TAKEN"
        :handler="outcome('Taken')"
      />
      <SpinButton
        v-if="message.type === 'Wanted' && !message.outcomes.length"
        variant="white"
        class="m-1"
        name="check"
        label="Mark as RECEIVED"
        :handler="outcome('Received')"
      />
      <SpinButton
        v-if="!message.outcomes.length"
        variant="white"
        class="m-1"
        name="trash-alt"
        label="Mark as Withdrawn"
        :handler="outcome('Withdrawn')"
      />
    </div>
    <div v-else-if="spam" class="d-inline">
      <ModMessageButton
        :message="message"
        variant="danger"
        icon="trash-alt"
        spam
        label="Spam"
      />
      <ModMessageButton
        :message="message"
        variant="primary"
        icon="check"
        notspam
        label="Not spam"
      />
    </div>
    <div v-if="!editreview && !message.heldby" class="d-lg-inline">
      <ModMessageButton
        v-for="stdmsg in filtered"
        :key="stdmsg.id"
        :variant="variant(stdmsg)"
        :icon="icon(stdmsg)"
        :label="stdmsg.title"
        :stdmsgid="stdmsg.id"
        :message="message"
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
import stdmsgs from '../mixins/stdmsgs'
import ModMessageButton from './ModMessageButton'
import SpinButton from './SpinButton'

export default {
  components: { SpinButton, ModMessageButton },
  mixins: [stdmsgs],
  props: {
    message: {
      type: Object,
      required: true
    },
    modconfig: {
      type: Object,
      required: false,
      default: null
    },
    editreview: {
      type: Boolean,
      required: false,
      default: false
    },
    cantpost: {
      type: Boolean,
      required: false,
      default: false
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
      return this.hasCollection('Spam')
    },
    validActions() {
      // The standard messages we show depend on the valid ones for this type of message.
      if (this.pending) {
        const ret = ['Reject', 'Leave', 'Delete', 'Edit']
        if (!this.cantpost) {
          ret.push('Approve')
        }
        return ret
      } else if (this.approved) {
        return ['Leave Approved Message', 'Delete Approved Message', 'Edit']
      }

      return []
    },
    rareToShow() {
      return this.filterByAction.length - this.filtered.length
    },
    stdmsgs() {
      if (this.modconfig) {
        return this.copyStdMsgs(this.modconfig)
      } else {
        return []
      }
    },
    filterByAction() {
      if (this.modconfig) {
        return this.stdmsgs.filter(stdmsg => {
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
    hasCollection(coll) {
      let ret = false

      if (this.message.groups) {
        this.message.groups.forEach(group => {
          if (group.collection === coll) {
            ret = true
          }
        })
      }

      return ret
    },
    outcome(type) {
      const self = this

      return async function() {
        console.log('Outcome', type, self.message.id)
        await self.$store.dispatch('messages/update', {
          action: 'Outcome',
          id: self.message.id,
          outcome: type
        })
      }
    }
  }
}
</script>
