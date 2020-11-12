<template>
  <div>
    <div v-if="availableinitially > 1">
      <p>
        If you gave these to more than one person, please list each of them here.
      </p>
      <p>
        You can save and come back later if you like.
      </p>
    </div>
    <div v-else>
      <p>
        Please tell us who <span v-if="type === 'Taken'">took</span><span v-else>received</span> this.
        We'll let anyone else who replied know, and it helps identify reliable freeglers.
      </p>
    </div>
    <OutcomeByOne
      v-for="(s, ix) in selectedUsersPlusEmpty"
      :key="'selected-' + s.id"
      :user="s"
      :took="ix < usersTook.length ? usersTook[ix] : 0"
      :type="type"
      :users="users"
      :selected-users="selectedUsers"
      :left="left"
      class="mb-2"
      :show-took="availableinitially > 1"
      @selected="selected(ix, $event)"
      @removed="removed(ix)"
      @took="took(ix, $event)"
    />
  </div>
</template>
<script>
import Vue from 'vue'
import OutcomeByOne from './OutcomeByOne'

export default {
  components: { OutcomeByOne },
  props: {
    type: {
      type: String,
      required: true
    },
    availableinitially: {
      type: Number,
      required: true
    },
    users: {
      validator: prop => typeof prop === 'object' || prop === null,
      required: true
    },
    msgid: {
      type: Number,
      required: true
    },
    left: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      selectedUsers: [],
      usersTook: [],
      emptyUser: {
        id: -1
      }
    }
  },
  computed: {
    message() {
      if (this.msgid) {
        return this.$store.getters['messages/get'](this.msgid)
      }

      return null
    },
    selectedUsersPlusEmpty() {
      const ret = this.selectedUsers.filter(u => {
        return u.id !== -1
      })

      // Don't add the empty slot if there are none left to take, or we have already listed everyone including
      // someone else.
      if (
        this.left &&
        (!this.message ||
          !this.message.by ||
          this.users.length > this.message.by.length)
      ) {
        ret.push(this.emptyUser)
      }

      return ret
    }
  },
  watch: {
    left: {
      handler(newVal) {
        this.$emit('update:left', newVal)
      },
      immediate: true
    }
  },
  async created() {
    // The message may already have some information about people who have taken some.  Fetch it (in non-summary mode)
    // to find out.
    const { message } = await this.$api.message.fetch({
      id: this.message.id
    })

    if (message && message.by) {
      message.by.forEach(b => {
        this.selectedUsers.push({
          id: b.userid ? b.userid : 0,
          displayname: b.displayname
        })

        this.usersTook.push(b.count)
      })
    }
  },
  methods: {
    selected(index, selected) {
      Vue.set(this.selectedUsers, index, selected.user)
      Vue.set(this.usersTook, index, parseInt(selected.took))
      this.updateParent()
    },
    removed(index) {
      this.$delete(this.selectedUsers, index)
      this.$delete(this.usersTook, index)
      this.updateParent()
    },
    took(index, value) {
      if (index >= 0) {
        Vue.set(this.usersTook, index, parseInt(value))
        this.updateParent()
      }
    },
    updateParent() {
      const u = []

      for (let i = 0; i < this.selectedUsers.length; i++) {
        u.push({
          userid: this.selectedUsers[i].id,
          count: this.usersTook[i]
        })
      }

      this.$emit('tookUsers', u)
    }
  }
}
</script>
