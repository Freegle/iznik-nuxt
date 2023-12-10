<template>
  <div>
    <b-modal
      id="banMemberModal"
      v-model="showModal"
      title="Ban Member"
      size="lg"
      no-stacking
    >
      <template slot="default">
        <NoticeMessage variant="info" class="mb-2">
          This will ban someone from your community. Please be responsible in how you use this feature.
        </NoticeMessage>
        <p>
          This could be someone who is already a member, someone who has left, or someone who has not joined yet.  You can find their userid from Logs or by mailing Support.
        </p>
        <b-input v-model="userid" type="number" placeholder="Enter their userid" class="mt-2 mb-2" />
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="white" @click="cancel">
          Close
        </b-button>
        <b-button variant="primary" :disabled="!userid" @click="ban">
          Ban
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import modal from '@/mixins/modal'
import NoticeMessage from './NoticeMessage'

export default {
  components: { NoticeMessage },
  mixins: [modal],
  props: {
    groupid: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      userid: null
    }
  },
  methods: {
    async ban() {
      await this.$store.dispatch('members/ban', {
        userid: this.userid,
        groupid: this.groupid
      })

      this.hide()
    }
  }
}
</script>
