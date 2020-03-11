<template>
  <div>
    <div v-if="editreview" class="d-inline">
      <ModMessageButton
        :message="message"
        variant="success"
        icon="check"
        acceptedits
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
        variant="success"
        icon="envelope"
        leave
        label="Reply"
      />
    </div>
    <div v-else-if="pending" class="d-inline">
      <ModMessageButton
        v-if="!message.heldby"
        :message="message"
        variant="success"
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
        v-if="message.heldby"
        :message="message"
        variant="warning"
        icon="play"
        release
        label="Release"
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
        variant="success"
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
        variant="success"
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
import ModMessageButton from './ModMessageButton'

export default {
  components: { ModMessageButton },
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
        return ['Approve', 'Reject', 'Leave', 'Delete', 'Edit']
      } else if (this.approved) {
        return ['Leave Approved Message', 'Delete Approved Message', 'Edit']
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
        case 'Approve':
          return 'check'
        case 'Reject':
          return 'times'
        case 'Leave':
        case 'Leave Approved Message':
          return 'envelope'
        case 'Delete':
        case 'Delete Approved Message':
          return 'trash-alt'
        case 'Edit':
          return 'pen'
        default:
          return 'check'
      }
    },

    variant(stdmsg) {
      switch (stdmsg.action) {
        case 'Approve':
          return 'success'
        case 'Reject':
          return 'warning'
        case 'Leave':
        case 'Leave Approved Message':
          return 'primary'
        case 'Delete':
        case 'Delete Approved Message':
          return 'danger'
        case 'Edit':
          return 'primary'
        default:
          return 'white'
      }
    },

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
    }
  }
}
</script>
