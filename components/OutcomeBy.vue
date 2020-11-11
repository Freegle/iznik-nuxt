<template>
  <div>
    <div v-if="availablenow > 1">
      <p>
        <b>{{ availablenow }} left</b>.
        Split among several freeglers?  No problem - list them all.
      </p>
      <p>
        Only some {{ type.toLowerCase() }}?  Record that here, submit and then come back later.
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
      :key="'selected-' + ix"
      :user="s"
      :took="ix < usersTook.length ? usersTook[ix] : 0"
      :type="type"
      :users="users"
      :selected-users="selectedUsers"
      :left="left"
      class="mb-2"
      :show-took="availablenow > 1"
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
    availablenow: {
      type: Number,
      required: true
    },
    users: {
      validator: prop => typeof prop === 'object' || prop === null,
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
    left() {
      let taken = 0

      this.usersTook.forEach(u => {
        if (u) {
          taken += u
        }
      })

      return Math.max(0, this.availablenow - taken)
    },
    selectedUsersPlusEmpty() {
      const ret = this.selectedUsers.filter(u => {
        return u.id !== -1
      })

      if (this.left) {
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
      Vue.set(this.usersTook, index, parseInt(value))
      this.updateParent()
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
