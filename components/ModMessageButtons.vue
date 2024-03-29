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
        label="Blank Reply"
      />
    </div>
    <div v-else-if="pending" class="d-inline">
      <ModMessageButton
        v-if="!cantpost"
        :message="message"
        variant="primary"
        icon="check"
        approve
        label="Approve"
      />
      <ModMessageButton
        :message="message"
        variant="warning"
        icon="times"
        reject
        label="Reject"
      />
      <ModMessageButton
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
        label="Blank Reply"
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
        confirm
      />
      <SpinButton
        v-if="message.type === 'Wanted' && !message.outcomes.length"
        variant="white"
        class="m-1"
        name="check"
        label="Mark as RECEIVED"
        :handler="outcome('Received')"
        confirm
      />
      <SpinButton
        v-if="!message.outcomes.length"
        variant="white"
        class="m-1"
        name="trash-alt"
        label="Mark as Withdrawn"
        :handler="outcome('Withdrawn')"
        confirm
      />
    </div>
    <div v-if="!editreview" class="d-lg-inline">
      <ModMessageButton
        v-for="stdmsg in filtered"
        :key="stdmsg.id"
        :variant="variant(stdmsg)"
        :icon="icon(stdmsg)"
        :label="stdmsg.title"
        :stdmsgid="stdmsg.id"
        :message="message"
        :autosend="(Boolean)(stdmsg.autosend && allowAutoSend)"
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
    <client-only>
      <div class="mt-1 mb-1 d-flex flex-wrap">
        <OurToggle
          v-model="allowAutoSend"
          :height="30"
          :width="150"
          :font-size="14"
          :sync="true"
          class="mr-1"
          :labels="{checked: 'Allow autosend', unchecked: 'Edit first'}"
          color="#61AE24"
        />
        <div class="small text-muted mt-1">
          Standard messages can be configured to send in a single click.  This toggle temporarily disables that so you can edit first.
        </div>
      </div>
    </client-only>
  </div>
</template>
<script>
import stdmsgs from '../mixins/stdmsgs'
import ModMessageButton from './ModMessageButton'
import SpinButton from './SpinButton'

const OurToggle = () => import('~/components/OurToggle')

export default {
  components: { OurToggle, SpinButton, ModMessageButton },
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
      showRare: false,
      allowAutoSend: true
    }
  },
  computed: {
    pending() {
      return this.hasCollection('Pending')
    },
    approved() {
      return this.hasCollection('Approved')
    },
    validActions() {
      // The standard messages we show depend on the valid ones for this type of message.
      if (this.pending) {
        const ret = ['Reject', 'Leave', 'Delete', 'Edit', 'Hold Message']
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
