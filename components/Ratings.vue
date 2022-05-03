<template>
  <client-only>
    <span :key="bump" class="d-inline">
      <span v-if="user && user.info">
        <span v-if="showName">
          {{ user.displayname }}
        </span>
        <b-btn
          v-b-tooltip.hover.top
          :size="size"
          :variant="user.info.ratings.Up > 0 ? 'primary' : 'white'"
          :title="uptitle"
          :disabled="((disabled || user.id === myid) ? 'true' : undefined)"
          :class="{
            mine: user.info.ratings.Mine === 'Up'
          }"
          @click="up"
        >
          <v-icon name="thumbs-up" />&nbsp;{{ user.info.ratings.Up }}
        </b-btn>
        <b-btn
          v-b-tooltip.hover.top
          :size="size"
          :variant="user.info.ratings.Down > 0 ? 'warning' : 'white'"
          :title="downtitle"
          :disabled="(disabled || user.id === myid) ? 'true' : undefined"
          :class="{
            mine: user.info.ratings.Mine === 'Down'
          }"
          @click="down"
        >
          <v-icon name="thumbs-down" />&nbsp;{{ user.info.ratings.Down }}
        </b-btn>
      </span>
      <span v-else-if="user">
        <b-btn
          variant="white"
          title="No ratings yet.  Click to rate."
          :disabled="(disabled || user.id === myid) ? 'true' : undefined"
          @click="up"
        >
          <v-icon name="thumbs-up" />&nbsp;0
        </b-btn>
        <b-btn
          variant="white"
          title="No ratings yet.  Click to rate."
          :disabled="(disabled || user.id === myid) ? 'true' : undefined"
          @click="down"
        >
          <v-icon name="thumbs-down" />&nbsp;0
        </b-btn>
      </span>
      <b-modal v-model="showDown" title="Giving a Thumbs Down..." ok-title="Submit" @ok="doSomeoneDown">
        <p>
          Please tell us why you're doing this.  Your local volunteers may see what you put, but the other freegler won't.
        </p>
        <div class="mt=2">
          <b-form-group v-slot="{ ariaDescribedby }" label="What went wrong?">
            <b-form-radio v-model="reason" :aria-describedby="ariaDescribedby" name="reason" value="NoShow">No Show</b-form-radio>
            <b-form-radio v-model="reason" :aria-describedby="ariaDescribedby" name="reason" value="Punctuality">Was late or early</b-form-radio>
            <b-form-radio v-model="reason" :aria-describedby="ariaDescribedby" name="reason" value="Ghosted">Stopped replying</b-form-radio>
            <b-form-radio v-model="reason" :aria-describedby="ariaDescribedby" name="reason" value="Rude">Unpleasant behaviour</b-form-radio>
            <b-form-radio v-model="reason" :aria-describedby="ariaDescribedby" name="reason" value="Other">Something else</b-form-radio>
          </b-form-group>
        </div>
        <div class="mt-2">
          <label class="font-weight-bold" for="text">
            Please give a bit of detail.
          </label>
          <b-form-textarea id="text" v-model="text" rows="3" placeholder="Explain what happened here..." />
        </div>
        <b-alert variant="danger" :show="showError" class="mt-2">
          Please select a reason and add some detail.  Thanks.
        </b-alert>
      </b-modal>
    </span>
  </client-only>
</template>
<script>
import { TooltipPlugin } from 'bootstrap-vue'
import Vue from 'vue'

Vue.use(TooltipPlugin)

export default {
  props: {
    id: {
      type: Number,
      required: false,
      default: null
    },
    size: {
      type: String,
      required: false,
      default: 'md'
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    showName: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      bump: 1,
      showDown: false,
      reason: null,
      text: null,
      showError: false
    }
  },
  computed: {
    user() {
      // Look for the user in both the user store (FD) and the members store (MT).  This saves some fetches which can
      // result in weird render errors.
      let ret = null

      if (this.id) {
        let user = this.$store.getters['user/get'](this.id)

        if (user && user.info) {
          ret = user
        } else {
          user = this.$store.getters['members/getByUserId'](this.id)

          if (user && user.info) {
            ret = user
          }
        }
      }

      return ret
    },
    uptitle() {
      if (this.user.info.ratings.Mine === 'Up') {
        return 'You gave them a thumbs up.  Click to undo.'
      } else {
        return (
          this.user.info.ratings.Up +
          ' freegler' +
          (this.user.info.ratings.Up !== 1 ? 's' : '') +
          '  gave them a thumbs up.  Click to rate, click again to undo.'
        )
      }
    },
    downtitle() {
      if (this.user.info.ratings.Mine === 'Down') {
        return 'You gave them a thumbs down.  Click to undo.'
      } else {
        return (
          this.user.info.ratings.Down +
          ' freegler' +
          (this.user.info.ratings.Down !== 1 ? 's' : '') +
          '  gave them a thumbs down.  Click to rate, click again to undo.'
        )
      }
    }
  },
  mounted() {
    // Components can't use asyncData, so we fetch here.  Can't do this for SSR, but that's fine as we don't
    // need to render this pane on the server.
    if (this.id) {
      // Not in the store yet - fetch.
      this.$store.dispatch('user/fetch', {
        id: this.id,
        info: true
      })
    }
  },
  methods: {
    async rate(rating, reason, text) {
      await this.$store.dispatch('user/rate', {
        id: this.id,
        rating: rating,
        reason: reason,
        text: text
      })

      this.bump++
    },
    async up() {
      this.showDown = false
      if (this.user.info.ratings.Mine === 'Up') {
        await this.rate(null)
      } else {
        await this.rate('Up')
      }
    },
    async down() {
      this.showDown = false

      if (this.user.info.ratings.Mine === 'Down') {
        await this.rate(null)
      } else {
        this.showDown = true
      }
    },
    async doSomeoneDown(e) {
      this.showError = false

      if (!this.reason || !this.text) {
        this.showError = true
      } else {
        await this.rate('Down', this.reason, this.text)
      }

      e.preventDefault()
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
.btn {
  margin: 1px;

  &.mine,
  &:hover {
    margin: 0px;
    border: 2px solid $color-black;
    box-shadow: 0px 0px 4px 1px $color-gray--dark;
  }
}

.btn-white:hover {
  background-color: white;
  color: black;
}
</style>
