<template>
  <div>
    <div class="layout">
      <b-select
        v-model="selectedUser"
        :options="userOptions"
        size="lg"
        :class="'select font-weight-bold ' + (selectedUser === -1 && selectedUsers.length < 1 ? 'text-danger' : '')"
        @change="fetchUser"
      />
      <Ratings v-if="selectedUser > 0 && fetchedUser" :id="fetchedUser.id" :key="'user-' + selectedUser" size="lg" class="ratings ml-1" />
      <div class="d-flex flex-column justify-content-center font-weight-bold tooktext">
        <div v-if="showTook && selectedUser > 0 && fetchedUser">
          took
        </div>
      </div>
      <b-input
        v-if="selectedUser > 0 && fetchedUser"
        v-model="currentTook"
        type="number"
        :min="0"
        :max="left + took"
        step="1"
        size="lg"
        :class="'width ml-1 took ' + (!showTook ? 'd-none' : '')"
      />
    </div>
  </div>
</template>
<script>
import Ratings from './Ratings'
export default {
  components: { Ratings },
  props: {
    type: {
      type: String,
      required: true
    },
    users: {
      validator: prop => typeof prop === 'object' || prop === null,
      required: true
    },
    selectedUsers: {
      type: Array,
      required: true
    },
    user: {
      type: Object,
      required: true
    },
    took: {
      type: Number,
      required: true
    },
    left: {
      type: Number,
      required: true
    },
    showTook: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      selectedUser: null,
      fetchedUser: null,
      currentTook: 1
    }
  },
  computed: {
    availableUsers() {
      // The users available to select are the ones which are not currently selected (unless that's the user for this
      // one.
      let ret = []

      if (this.users) {
        ret = this.users.filter(u => {
          return (
            this.user.id === u.id ||
            !this.selectedUsers.find(u2 => {
              return u2.id === u.id
            })
          )
        })
      }

      return ret
    },
    userOptions() {
      const options = []

      options.push({
        value: -1,
        html:
          this.selectedUsers.length >= 1
            ? '<em>-- Add another --</em>'
            : "<em>-- Please choose (this isn't public) --</em>"
      })

      for (const user of this.availableUsers) {
        options.push({
          value: user.id,
          text: user.displayname
        })
      }

      options.push({
        value: 0,
        html: '<em>Someone else</em>'
      })

      return options
    }
  },
  watch: {
    async selectedUser(newVal, oldVal) {
      if (newVal <= 0 && oldVal > 0) {
        this.$emit('removed')
      } else if (newVal > 0 && oldVal !== null) {
        await this.fetchUser(newVal)

        if (this.fetchedUser) {
          this.$emit('selected', {
            user: this.fetchedUser,
            took: oldVal === -1 ? 1 : this.took
          })
        }
      }

      if (newVal > 0) {
        this.fetchUser(newVal)
      }
    },
    currentTook(newVal) {
      if (newVal <= 0) {
        this.$emit('removed')
      } else {
        this.$emit('took', newVal)
      }
    },
    user: {
      handler(newVal, oldVal) {
        this.selectedUser = newVal.id
        this.fetchUser(this.selectedUser)
      },
      immediate: true
    },
    took(newVal) {
      this.currentTook = newVal
    }
  },
  methods: {
    async fetchUser(userid) {
      if (userid > 0) {
        this.fetchedUser = this.$store.getters['user/get'](userid)

        if (!this.fetchedUser) {
          await this.$store.dispatch('user/fetch', {
            id: userid,
            info: true
          })

          this.fetchedUser = this.$store.getters['user/get'](userid)
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

option {
  color: $color-black !important;
}

.btn[aria-pressed='true'] {
  box-shadow: 0px 0px 5px 2px $color-blue--base !important;
}

select {
  width: auto;
}

.width {
  width: 80px;
}

.layout {
  display: grid;
  border: 1px solid $color-gray--faded;
  border-radius: 5px;
  padding: 10px;

  grid-template-rows: auto auto;
  grid-template-columns: 2fr 1fr 1fr;

  @include media-breakpoint-up(md) {
    padding: 10px;

    grid-template-rows: auto;
    grid-template-columns: 2fr 1fr 60px 1fr;
  }

  .select {
    grid-column: 1 / 4;
    grid-row: 1 / 2;

    @include media-breakpoint-up(md) {
      grid-column: 1 / 2;
      grid-row: 1;
    }
  }

  .ratings {
    justify-self: start;
    margin-top: 1rem;

    grid-column: 1 / 2;
    grid-row: 2 / 3;

    @include media-breakpoint-up(md) {
      margin-top: 0;
      grid-column: 2 / 3;
      grid-row: 1;
    }
  }

  .tooktext {
    justify-self: center;
    align-self: center;

    grid-column: 2 / 3;
    grid-row: 2 / 3;

    @include media-breakpoint-up(md) {
      grid-column: 3 / 4;
      grid-row: 1;
    }
  }

  .took {
    justify-self: end;
    margin-top: 1rem;

    grid-column: 3 / 4;
    grid-row: 2 / 3;

    @include media-breakpoint-up(md) {
      margin-top: 0;
      grid-column: 4 / 5;
      grid-row: 1;
    }
  }
}
</style>
