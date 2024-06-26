<template>
  <div class="d-flex flex-wrap">
    <div v-if="spam" class="d-inline d-flex flex-wrap">
      <ModMemberActions
        v-if="actions && member.groupid"
        :userid="member.userid"
        :groupid="member.groupid"
        :banned="(Boolean)(member.bandate)"
        class="mr-1"
        :spam="spam"
      />
      <ModMemberButton
        v-if="spamignore"
        :member="member"
        variant="primary"
        icon="check"
        spamignore
        label="Ignore"
      />
      <div v-if="member.spammer.collection === 'PendingAdd'" class="d-inline">
        <ModMemberButton
          v-if="hasPermissionSpamAdmin && !member.heldby"
          :member="member"
          variant="primary"
          icon="check"
          spamconfirm
          label="Confirm add to spammer list"
        />
        <b-btn variant="white" @click="addAComment">
          <v-icon name="tag" /> Add note
        </b-btn>
        <ModMemberButton
          v-if="hasPermissionSpamAdmin && !member.heldby"
          :member="member"
          variant="danger"
          icon="trash-alt"
          spamremove
          label="Reject add to spammer list"
        />
        <ModMemberButton
          v-if="hasPermissionSpamAdmin && !member.heldby"
          :member="member"
          variant="primary"
          icon="check"
          spamwhitelist
          label="Whitelist"
        />
        <ModMemberButton
          v-else-if="!member.heldby"
          :member="member"
          variant="primary"
          icon="times"
          spamrequestremove
          label="Request removal from spammer list"
        />
        <ModMemberButton
          v-if="hasPermissionSpamAdmin && !member.heldby"
          :member="member"
          variant="warning"
          icon="pause"
          spamhold
          label="Hold"
        />
      </div>
      <div v-else-if="member.spammer.collection === 'Approved'" class="d-flex flex-wrap">
        <ModMemberButton
          v-if="hasPermissionSpamAdmin"
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
          label="Request removal from spammer list"
        />
      </div>
    </div>
    <div v-else-if="approved" class="d-flex flex-wrap">
      <ModMemberActions v-if="actions" :userid="member.userid" :groupid="member.groupid" :banned="(Boolean)(member.bandate)" class="mr-1" />
      <ModMemberButton
        v-if="spamignore && member.suspectreason"
        :member="member"
        variant="primary"
        icon="check"
        spamignore
        label="Ignore"
      />
      <ModMemberButton
        class="ml-1 mr-1"
        :member="member"
        variant="white"
        icon="envelope"
        leave
        label="Mail"
      />
    </div>
    <div class="d-flex flex-wrap">
      <ModMemberButton
        v-for="stdmsg in filtered"
        :key="stdmsg.id"
        :variant="variant(stdmsg)"
        :icon="icon(stdmsg)"
        :label="stdmsg.title"
        :stdmsgid="stdmsg.id"
        :member="member"
        class="mr-1"
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
      <ModCommentAddModal v-if="addComment" ref="addComment" :user="member" />
    </client-only>
  </div>
</template>
<script>
import ModMemberButton from './ModMemberButton'
import ModMemberActions from './ModMemberActions'
import ModCommentAddModal from '~/components/ModCommentAddModal'

const OurToggle = () => import('~/components/OurToggle')

export default {
  components: {
    ModCommentAddModal,
    ModMemberActions,
    ModMemberButton,
    OurToggle
  },

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
    },
    actions: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      showRare: false,
      allowAutoSend: true,
      addComment: false
    }
  },
  computed: {
    approved() {
      return this.hasCollection('Approved')
    },
    spam() {
      return this.member.spammer
    },
    validActions() {
      // The standard messages we show depend on the valid ones for this type of member.
      if (this.approved) {
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
          return 'primary'
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
    },
    addAComment() {
      this.addComment = true
      this.waitForRef('addComment', () => {
        this.$refs.addComment.show()
      })
    }
  }
}
</script>
