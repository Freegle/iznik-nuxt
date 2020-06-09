<template>
  <div>
    <b-btn variant="white" @click="download">
      <v-icon name="download" /> Export
    </b-btn>
    <b-modal
      id="exportmodal"
      v-model="showModal"
      title="Member Export"
      no-stacking
    >
      <template slot="default">
        <p>
          This will export the members of this community.  It's very slow, but you probably won't need to do it often.
        </p>
        <b-progress
          height="48px"
          class="mt-2"
          animate
          variant="success"
        >
          <b-progress-bar :value="progressValue" />
        </b-progress>
      </template>
      <template slot="modal-footer">
        <b-button variant="white" @click="cancelit">
          Cancel
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import saveAs from 'save-file'
import waitForRef from '@/mixins/waitForRef'
const createCsvWriter = require('csv-writer').createObjectCsvStringifier

export default {
  mixins: [waitForRef],
  props: {
    groupid: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      showModal: false,
      context: null,
      cancelled: false,
      limit: 100,
      fetched: 0,
      exportList: []
    }
  },
  computed: {
    group() {
      return this.$store.getters['group/get'](this.groupid)
    },
    progressValue() {
      return this.group && this.group.membercount
        ? Math.round((100 * this.fetched) / this.group.membercount)
        : 0
    }
  },
  methods: {
    download() {
      this.showModal = true
      this.exportChunk()
    },
    cancelit() {
      this.cancelled = true
      this.showModal = false
    },
    async exportChunk() {
      if (!this.cancelled) {
        await this.$store.dispatch('members/clear')
        await this.$store.dispatch('members/fetchMembers', {
          groupid: this.groupid,
          collection: 'Approved',
          modtools: true,
          summary: false,
          context: this.context,
          limit: this.limit
        })
      }

      const members = this.$store.getters['members/getByGroup'](this.groupid)
      this.fetched += members.length

      const writer = createCsvWriter({
        path: 'members.csv',
        header: [
          { id: 'id', title: 'Id' },
          { id: 'name', title: 'Name' },
          { id: 'email', title: 'Email' },
          { id: 'joined', title: 'Joined' },
          { id: 'lastactive', title: 'Last Active' },
          { id: 'role', title: 'Role' },
          { id: 'otheremails', title: 'Other Emails' },
          { id: 'settings', title: 'Settings' },
          { id: 'postingstatus', title: 'Posting Status' },
          { id: 'bouncing', title: 'Bouncing' },
          { id: 'comments', title: 'Comments' }
        ]
      })

      members.forEach(member => {
        const otheremails = []
        member.otheremails.forEach(email => {
          if (email.email !== member.email) {
            otheremails.push(email.email)
          }
        })

        const comments = []
        member.comments.forEach(comment => {
          if (comment.user1) {
            comments.push(comment.user1)
          }
          if (comment.user2) {
            comments.push(comment.user2)
          }
          if (comment.user3) {
            comments.push(comment.user3)
          }
          if (comment.user4) {
            comments.push(comment.user4)
          }
          if (comment.user5) {
            comments.push(comment.user5)
          }
          if (comment.user6) {
            comments.push(comment.user6)
          }
          if (comment.user7) {
            comments.push(comment.user7)
          }
          if (comment.user8) {
            comments.push(comment.user8)
          }
          if (comment.user9) {
            comments.push(comment.user9)
          }
          if (comment.user10) {
            comments.push(comment.user10)
          }
          if (comment.user11) {
            comments.push(comment.user11)
          }
        })

        this.exportList.push({
          id: member.userid,
          name: member.displayname,
          email: member.email,
          joined: member.joined,
          lastactive: member.lastaccess,
          role: member.role,
          otheremails: otheremails.join(', '),
          settings: JSON.stringify(member.settings, null, 0),
          postingstatus: member.ourpostingstatus,
          bouncing: member.bouncing,
          comments: comments.join('; ')
        })
      })

      this.context = this.$store.getters['members/getContext']

      if (members.length) {
        // More to get
        this.$nextTick(() => {
          this.exportChunk()
        })
      } else {
        // Got them all.
        const str =
          writer.getHeaderString() + writer.stringifyRecords(this.exportList)
        const blob = new Blob([str], { type: 'text/csv;charset=utf-8' })
        await saveAs(blob, 'members.csv')

        this.showModal = false
      }
    }
  }
}
</script>
