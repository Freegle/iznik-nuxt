<template>
  <div>
    <b-btn variant="white" @click="remove">
      <v-icon name="times" /> Remove
    </b-btn>
    <b-btn variant="white" @click="ban">
      <v-icon name="trash-alt" /> Ban
    </b-btn>
    <b-btn variant="white" disabled>
      <v-icon name="ban" /> Scammer
    </b-btn>
    <b-btn variant="white" disabled>
      <v-icon name="check" /> Whitelist
    </b-btn>
    <b-btn variant="white" disabled>
      <v-icon name="tag" /> Add note
    </b-btn>
    <b-btn v-if="supportOrAdmin" variant="white" disabled>
      <v-icon name="trash-alt" /> Purge
    </b-btn>
    <ConfirmModal v-if="removeConfirm" ref="removeConfirm" :title="'Remove ' + displayname + ' from ' + groupname + '?'" @confirm="removeConfirmed" />
    <ConfirmModal v-if="banConfirm" ref="banConfirm" :title="'Ban ' + displayname + ' from ' + groupname + '?'" @confirm="banConfirmed" />
  </div>
</template>
<script>
import waitForRef from '../mixins/waitForRef'
const ConfirmModal = () => import('./ConfirmModal')

export default {
  components: { ConfirmModal },
  mixins: [waitForRef],
  props: {
    userid: {
      type: Number,
      required: true
    },
    groupid: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      removeConfirm: false,
      banConfirm: false,
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
    }
  }
}
</script>
