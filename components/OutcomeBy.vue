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
      <label :class="'strong ' + (chooseError ? 'text-danger' : '')">
        Please tell us who took this item:
      </label>
    </div>
    <div
      v-for="user in selectedUsers"
      :key="'selected-' + user.userid"
      class="layout mb-2"
    >
      <span v-if="user.userid > 0" class="text--large font-weight-bold mt-1 text-left select">
        {{ user.displayname }}
      </span>
      <span v-else class="text--large font-weight-bold mt-1 text-left select">
        <span v-if="availableinitially === 1">Someone else</span>
        <span v-else>Other people</span>
      </span>
      <div class="ratings">
        <div class="d-none d-md-block ml-1">
          <Ratings v-if="user.userid > 0" :id="user.userid" size="lg" />
        </div>
        <div class="d-block d-md-none ml-1">
          <Ratings v-if="user.userid > 0" :id="user.userid" size="md" />
        </div>
      </div>
      <div :class="'ml-1 took ' + (availableinitially <= 1 ? 'd-none' : '')">
        <NumberIncrementDecrement
          label="Number taken"
          label-s-r-only
          append-text=" taken"
          :min="0"
          :max="left + user.count"
          :count.sync="user.count"
        />
      </div>
    </div>
    <div class="d-none d-md-block">
      <b-select
        v-if="moreUsersToSelect && showSelect"
        v-model="selectUser"
        :options="userOptions(false)"
        size="lg"
        :class="'font-weight-bold ' + (chooseError ? 'text-danger' : '')"
        @change="selected"
      />
    </div>
    <div class="d-block d-md-none">
      <b-select
        v-if="moreUsersToSelect && showSelect"
        v-model="selectUser"
        :options="userOptions(true)"
        size="lg"
        :class="'font-weight-bold ' + (chooseError ? 'text-danger' : '')"
        @change="selected"
      />
    </div>
    <p class="mt-1 text-muted small">
      We'll let anyone else who replied know, and it helps us identify reliable freeglers.
    </p>
  </div>
</template>
<script>
import Ratings from './Ratings'
import NumberIncrementDecrement from './NumberIncrementDecrement'

export default {
  components: { NumberIncrementDecrement, Ratings },
  props: {
    type: {
      type: String,
      required: true
    },
    availableinitially: {
      type: Number,
      required: true
    },
    msgid: {
      type: Number,
      required: true
    },
    left: {
      type: Number,
      required: true
    },
    takenBy: {
      type: Object,
      required: false,
      default: null
    },
    chooseError: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      showSelect: false,
      selectUser: -1,
      selectedUsers: [],
      emptyUser: {
        id: -1,
        count: 0
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
    repliers() {
      const ret = []

      if (this.message && this.message.replies) {
        this.message.replies.forEach(u => {
          if (u.user && u.user.id) {
            ret.push({
              userid: u.user.id,
              displayname: u.user.displayname
            })
          } else {
            ret.push({
              userid: null
            })
          }
        })
      }

      return ret
    },
    availableUsers() {
      // The users available to select are the ones which are not currently selected (unless that's the user for this
      // one.
      const ret = this.repliers.filter(
        u => !this.selectedUsers.find(u2 => u2.userid === u.userid)
      )

      const retids = ret.map(r => r.userid)

      // Now add any other users that we have chatted to.
      const chats = Object.values(this.$store.getters['chats/list'])

      chats.forEach(c => {
        if (c.chattype === 'User2User' && c.user1 && c.user2) {
          const otheruser = c.user1.id === this.myid ? c.user2 : c.user1
          if (!retids[otheruser.id]) {
            ret.push({
              userid: otheruser.id,
              displayname: otheruser.displayname
            })

            retids[otheruser.id] = true
          }
        }
      })

      return ret
    },
    moreUsersToSelect() {
      // We show the choose if there are some left and we have not got all users plus someone else.
      return (
        this.left &&
        (this.selectedUsers.length <= this.repliers.length ||
          !this.selectedUsers.find(u => !u.userid))
      )
    },
    sortedSelectors() {
      // Want Someone Else at the end, and alphabetic otherwise.
      const ret = JSON.parse(JSON.stringify(this.selectedUsers))
      return ret.sort((a, b) => {
        if (a.userid && !b.userid) {
          return -1
        } else if (!a.userid && b.userid) {
          return 1
        } else {
          return a.displayname
            .toLowerCase()
            .localeCompare(b.displayname.toLowerCase())
        }
      })
    }
  },
  watch: {
    selectedUsers(newVal) {
      this.$emit('tookUsers', newVal)
    }
  },
  async created() {
    // The message may already have some information about people who have taken some.  Fetch it (in non-summary mode)
    // to find out.
    const { message } = await this.$api.message.fetch({
      id: this.message.id
    })

    if (message && message.by) {
      this.selectedUsers = message.by
      this.$emit('tookUsers', this.selectedUsers)
    }

    if (this.takenBy) {
      this.selectedUsers.push(this.takenBy)
    }

    this.showSelect = true
  },
  methods: {
    selected(userid) {
      if (userid === 0) {
        this.selectedUsers.push({
          userid: null,
          count: 1
        })
      } else if (userid > 0) {
        const user = this.availableUsers.find(u => u.userid === userid)
        user.count = 1
        this.selectedUsers.push(user)
      }

      this.selectUser = -1
    },
    userOptions(small) {
      const options = []

      options.push({
        value: -1,
        html:
          this.selectedUsers.length >= 1
            ? '<em>-- Add someone --</em>'
            : this.userOptionsChoose(small)
      })

      for (const user of this.availableUsers) {
        options.push({
          value: user.userid,
          text: user.displayname
        })
      }

      if (!this.selectedUsers.find(u => u.userid === null)) {
        options.push({
          value: 0,
          html:
            this.availableinitially === 1
              ? '<em>Someone else</em>'
              : '<em>Other people</em>'
        })
      }

      return options
    },
    userOptionsChoose(small) {
      return small
        ? '<em>-- Please choose --</em>'
        : "<em>-- Please choose (this isn't public) --</em>"
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

.layout {
  display: grid;
  border: 1px solid $color-gray--faded;
  border-radius: 5px;
  padding: 10px;

  grid-template-rows: auto auto auto;
  grid-template-columns: 2fr 2fr;
  grid-column-gap: 5px;

  @include media-breakpoint-up(md) {
    padding: 10px;

    grid-template-rows: auto;
    grid-template-columns: 1fr 155px 160px;
  }

  .select {
    grid-column: 1 / 3;
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
