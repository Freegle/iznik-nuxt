<template>
  <div>
    <b-btn v-if="groupid" variant="white" @click="remove">
      <v-icon name="times" /> Remove
    </b-btn>
    <b-btn v-if="groupid" variant="white" @click="ban">
      <v-icon name="trash-alt" /> Ban
    </b-btn>
    <b-btn variant="white" disabled>
      <v-icon name="ban" /> Scammer
    </b-btn>
    <b-btn variant="white" disabled>
      <v-icon name="check" /> Whitelist
    </b-btn>
    <b-btn v-if="groupid" variant="white" @click="addAComment">
      <v-icon name="tag" /> Add note
    </b-btn>
    <b-btn v-if="supportOrAdmin" variant="white" @click="purge">
      <v-icon name="trash-alt" /> Purge
    </b-btn>
    <ConfirmModal v-if="removeConfirm" ref="removeConfirm" :title="'Remove ' + displayname + ' from ' + groupname + '?'" @confirm="removeConfirmed" />
    <ConfirmModal v-if="banConfirm" ref="banConfirm" :title="'Ban ' + displayname + ' from ' + groupname + '?'" @confirm="banConfirmed" />
    <ConfirmModal v-if="purgeConfirm" ref="purgeConfirm" :title="'Purge ' + displayname + ' from the system?'" message="<p><b>This can't be undone.</b></p><p>Are you completely sure you want to do this?</p>" @confirm="purgeConfirmed" />
    <ModCommentAddModal v-if="addComment" ref="addComment" :user="user" :groupid="groupid" @added="updateComments" />
  </div>
</template>
<script>
import waitForRef from '../mixins/waitForRef'
import ModCommentAddModal from './ModCommentAddModal'
const ConfirmModal = () => import('./ConfirmModal')

export default {
  components: { ModCommentAddModal, ConfirmModal },
  mixins: [waitForRef],
  props: {
    userid: {
      type: Number,
      required: true
    },
    groupid: {
      type: Number,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      removeConfirm: false,
      banConfirm: false,
      purgeConfirm: false,
      addComment: false,
      user: null
    }
  },
  computed: {
    displayname() {
      return this.user ? this.user.displayname : null
    },
    group() {
      return this.$store.getters['group/get'](this.groupid)
    },
    groupname() {
      return this.group ? this.group.nameshort : null
    }
  },
  methods: {
    async fetchUser() {
      await this.$store.dispatch('user/fetch', {
        id: this.userid,
        info: true
      })

      this.user = this.$store.getters['user/get'](this.userid)
    },
    async remove() {
      if (!this.user) {
        await this.fetchUser()
      }

      this.removeConfirm = true

      this.waitForRef('removeConfirm', () => {
        this.$refs.removeConfirm.show()
      })
    },
    removeConfirmed() {
      this.$store.dispatch('members/remove', {
        userid: this.userid,
        groupid: this.groupid
      })
    },
    async ban() {
      if (!this.user) {
        await this.fetchUser()
      }

      this.banConfirm = true

      this.waitForRef('banConfirm', () => {
        this.$refs.banConfirm.show()
      })
    },
    banConfirmed() {
      this.$store.dispatch('members/ban', {
        userid: this.userid,
        groupid: this.groupid
      })
    },
    async purge() {
      if (!this.user) {
        await this.fetchUser()
      }

      this.purgeConfirm = true

      this.waitForRef('purgeConfirm', () => {
        this.$refs.purgeConfirm.show()
      })
    },
    purgeConfirmed() {
      this.$store.dispatch('members/purge', {
        userid: this.userid
      })
    },
    async addAComment() {
      if (!this.user) {
        await this.fetchUser()
      }

      this.addComment = true
      this.waitForRef('addComment', () => {
        this.$refs.addComment.show()
      })
    },
    async updateComments() {
      // The server API doesn't make it easy to refresh comments on memberships, because we can't refetch a
      // specific membership id.  Instead fetch the user and then pass any comments to the store to update there.
      await this.$store.dispatch('user/fetch', {
        id: this.user.id,
        info: true
      })

      const user = this.$store.getters['user/get'](this.user.id)

      await this.$store.dispatch('members/updateComments', {
        userid: this.user.id,
        comments: user.comments
      })
    }
  }
}
</script>
