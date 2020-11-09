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
    <div v-if="availablenow > 1">
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
        @selected="selected(ix, $event)"
        @removed="removed(ix)"
        @took="took(ix, $event)"
      />
    </div>
    <div v-else>
      <div class="d-flex justify-content-center flex-wrap">
        <label class="font-weight-bold align-middle d-flex flex-column justify-content-center mr-4">
          <span v-if="type === 'Taken'">
            Taken by:
          </span>
          <span v-if="type === 'Received'">
            Received from:
          </span>
        </label>
        <b-select
          ref="userselect"
          v-model="selectedUser"
          autofocus
          :options="userOptions"
          size="lg"
          :class="'width mb-2 font-weight-bold ' + (selectedUser === -1 ? 'text-danger' : '')"
          @change="fetchUser"
        />
      </div>
      <b-card v-if="selectedUser > 0" bg-variant="info">
        <b-card-body>
          <p>How was this freegler? Please click.</p>
          <Ratings v-if="fetchedUser" :id="fetchedUser.id" :key="'user-' + selectedUser" class="" />
        </b-card-body>
      </b-card>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Ratings from './Ratings'
import OutcomeByOne from './OutcomeByOne'

export default {
  components: { OutcomeByOne, Ratings },
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
      Vue.set(this.usersTook, index, selected.took)
      this.updateParent()
    },
    removed(index) {
      this.$delete(this.selectedUsers, index)
      this.$delete(this.usersTook, index)
      this.updateParent()
    },
    took(index, value) {
      Vue.set(this.usersTook, index, value)
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
